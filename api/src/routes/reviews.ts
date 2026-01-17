
import { Router } from 'express';
import { db } from '../db/index.js';
import { reviewsTable, insertReviewSchema, updateReviewSchema, replyReviewSchema } from '../db/reviewsSchema.js';
import { productsTable } from '../db/productsSchema.js';
import { eq, and, desc, sql } from 'drizzle-orm';
import { verifyToken, verifySeller, verifyAdmin } from '../middlewares/authMiddleware.js';
import { validateData } from '../middlewares/validationMiddleware.js';

const router = Router();

// 1. Get reviews for a specific product (Public)
router.get('/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await db
            .select()
            .from(reviewsTable)
            .where(eq(reviewsTable.productId, Number(productId)))
            .orderBy(desc(reviewsTable.createdAt));

        res.json(reviews);
    } catch (e) {
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});

// 2. Create a review (Authenticated User)
router.post('/', verifyToken, validateData(insertReviewSchema), async (req, res) => {
    try {
        const reviewData = req.cleanBody;
        // Force userId from token
        reviewData.userId = (req as any).userId;

        // Optional: Check if user purchased the product logic here (skipped for MVP)

        const [newReview] = await db
            .insert(reviewsTable)
            .values(reviewData)
            .returning();

        res.status(201).json(newReview);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error creating review' });
    }
});

// 3. Get reviews for Vendor (Authenticated Vendor)
router.get('/vendor/my-reviews', verifyToken, verifySeller, async (req, res) => {
    try {
        const userId = (req as any).userId;

        // Drizzle Join
        const reviews = await db.execute(sql`
        SELECT r.*, p.name as "productName", p.image as "productImage"
        FROM reviews r
        JOIN products p ON r."productId" = p.id
        JOIN vendors v ON p."sellerId" = v.id
        WHERE v."userId" = ${userId}
        ORDER BY r."createdAt" DESC
    `);

        res.json(reviews.rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error fetching vendor reviews' });
    }
});

// 4. Vendor Reply (Authenticated Vendor)
router.put('/:id/reply', verifyToken, verifySeller, validateData(replyReviewSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const { vendorReply } = req.cleanBody;
        const userId = (req as any).userId;

        // Verify ownership: Ensure the review belongs to a product owned by this vendor
        const accessCheck = await db.execute(sql`
        SELECT 1
        FROM reviews r
        JOIN products p ON r."productId" = p.id
        JOIN vendors v ON p."sellerId" = v.id
        WHERE r.id = ${id} AND v."userId" = ${userId}
        LIMIT 1
    `);

        if (accessCheck.rowCount === 0) {
            return res.status(403).json({ message: 'Not authorized to reply to this review' });
        }

        const [updatedReview] = await db
            .update(reviewsTable)
            .set({ vendorReply, replyDate: new Date() })
            .where(eq(reviewsTable.id, Number(id)))
            .returning();

        res.json(updatedReview);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error replying to review' });
    }
});

// 5. Admin: List All Reviews
router.get('/admin/all', verifyToken, verifyAdmin, async (req, res) => {
    try {
        // Return with product name and vendor name for context
        const reviews = await db.execute(sql`
        SELECT r.*, p.name as "productName", v."storeName"
        FROM reviews r
        JOIN products p ON r."productId" = p.id
        JOIN vendors v ON p."sellerId" = v.id
        ORDER BY r."createdAt" DESC
      `);
        res.json(reviews.rows);
    } catch (e) {
        res.status(500).json({ message: 'Error fetching admin reviews' });
    }
});

// 6. Admin: Delete Review
router.delete('/admin/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await db.delete(reviewsTable).where(eq(reviewsTable.id, Number(id)));
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ message: 'Error deleting review' });
    }
});

export default router;
