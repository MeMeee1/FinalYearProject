
import { Router } from 'express';
import { db } from '../db/index.js';
import { fulfillmentPointsTable, insertFulfillmentPointSchema, updateFulfillmentPointSchema, lgaEnum } from '../db/fulfillmentPointsSchema.js';
import { eq, sql } from 'drizzle-orm';
import { verifyToken, verifyAdmin, verifySeller } from '../middlewares/authMiddleware.js';
import { validateData } from '../middlewares/validationMiddleware.js';

const router = Router();

// 0. Get all LGAs from enum
router.get('/lgas', (req, res) => {
    res.json(lgaEnum.enumValues);
});

// 1. List all Fulfillment Points (Public - for Signup/Checkout)
router.get('/', async (req, res) => {
    try {
        const points = await db.select().from(fulfillmentPointsTable).where(eq(fulfillmentPointsTable.isActive, true));
        res.json(points);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error fetching fulfillment points' });
    }
});

// 2. Create Fulfillment Point (Admin Only)
router.post('/', verifyToken, verifyAdmin, validateData(insertFulfillmentPointSchema), async (req, res) => {
    try {
        const [newPoint] = await db.insert(fulfillmentPointsTable).values(req.cleanBody).returning();
        res.status(201).json(newPoint);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error creating fulfillment point' });
    }
});

// 3. Update Fulfillment Point (Admin Only)
router.put('/:id', verifyToken, verifyAdmin, validateData(updateFulfillmentPointSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedPoint] = await db
            .update(fulfillmentPointsTable)
            .set({ ...req.cleanBody, updatedAt: new Date() })
            .where(eq(fulfillmentPointsTable.id, Number(id)))
            .returning();

        if (!updatedPoint) {
            return res.status(404).json({ message: 'Fulfillment Point not found' });
        }
        res.json(updatedPoint);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error updating fulfillment point' });
    }
});

// 4. Delete/Deactivate Fulfillment Point (Admin Only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        // Soft delete by setting isActive to false
        const [updatedPoint] = await db
            .update(fulfillmentPointsTable)
            .set({ isActive: false, updatedAt: new Date() })
            .where(eq(fulfillmentPointsTable.id, Number(id)))
            .returning();

        if (!updatedPoint) {
            return res.status(404).json({ message: 'Fulfillment Point not found' });
        }
        res.json({ message: 'Fulfillment Point deactivated successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error deleting fulfillment point' });
    }
});

export default router;
