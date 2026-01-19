import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { vendorsTable } from '../../db/vendorsSchema.js';
import { usersTable } from '../../db/usersSchema.js';
import { productsTable } from '../../db/productsSchema.js';
import { ordersTable } from '../../db/ordersSchema.js';
import { fulfillmentPointsTable } from '../../db/fulfillmentPointsSchema.js';
import { eq, sql } from 'drizzle-orm';

// Add this temporary debug endpoint
export async function debugVendors(req: Request, res: Response) {
  try {
    // Get ALL vendors regardless of status
    const allVendors = await db
      .select()
      .from(vendorsTable);

    res.json({
      total: allVendors.length,
      vendors: allVendors,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}
export async function listVendors(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive numbers' });
    }

    const offset = (page - 1) * limit;

    const vendors = await db
      .select({
        id: vendorsTable.id,
        storeName: vendorsTable.storeName,
        storeDescription: vendorsTable.storeDescription,
        storeLogo: vendorsTable.storeLogo,
        storeBanner: vendorsTable.storeBanner,
        businessAddress: vendorsTable.businessAddress,
        businessEmail: vendorsTable.businessEmail,
        businessPhone: vendorsTable.businessPhone,
        status: vendorsTable.status,
        createdAt: vendorsTable.createdAt,
      })
      .from(vendorsTable)
      .where(eq(vendorsTable.status, 'active'))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(vendorsTable)
      .where(eq(vendorsTable.status, 'active'));

    const totalPages = Math.ceil(count / limit);

    res.json({
      data: vendors,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function getVendorById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const vendor = await db
      .select({
        id: vendorsTable.id,
        userId: vendorsTable.userId,
        storeName: vendorsTable.storeName,
        storeDescription: vendorsTable.storeDescription,
        storeLogo: vendorsTable.storeLogo,
        storeBanner: vendorsTable.storeBanner,
        businessName: vendorsTable.businessName,
        businessAddress: vendorsTable.businessAddress,
        businessEmail: vendorsTable.businessEmail,
        businessPhone: vendorsTable.businessPhone,
        status: vendorsTable.status,
        platformCommissionRate: vendorsTable.platformCommissionRate,
        createdAt: vendorsTable.createdAt,
        updatedAt: vendorsTable.updatedAt,
      })
      .from(vendorsTable)
      .where(eq(vendorsTable.id, Number(id)));

    if (!vendor || vendor.length === 0) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(vendor[0]);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function getVendorProfile(req: Request, res: Response) {
  try {
    console.log('[DEBUG] getVendorProfile called. userId:', req.userId);
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Join with fulfillment points to get verification details if assigned
    const vendorResult = await db
      .select({
        vendor: vendorsTable,
        fulfillmentPoint: fulfillmentPointsTable
      })
      .from(vendorsTable)
      .leftJoin(fulfillmentPointsTable, eq(vendorsTable.assignedVerificationPointId, fulfillmentPointsTable.id))
      .where(eq(vendorsTable.userId, req.userId as number));

    console.log('[DEBUG] Vendor search result:', vendorResult);

    if (!vendorResult || vendorResult.length === 0) {
      console.log('[DEBUG] No vendor found for userId:', req.userId, '. Creating default vendor profile.');

      // Auto-create a default vendor profile
      try {
        const user = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, req.userId as number));

        if (!user || user.length === 0) {
          return res.status(401).json({ message: 'User not found' });
        }

        const defaultVendor = {
          userId: req.userId as number,
          storeName: user[0].name || 'My Store',
          businessName: user[0].name || 'My Business',
          businessEmail: user[0].email || '',
          status: 'pending' as 'pending' | 'active' | 'suspended',
        };

        const [newVendor] = await db
          .insert(vendorsTable)
          .values(defaultVendor)
          .returning();

        console.log('[DEBUG] Created default vendor profile:', newVendor);
        // Return new vendor with null fulfillment point
        return res.status(201).json({ ...newVendor, fulfillmentPoint: null });
      } catch (createError) {
        console.error('[DEBUG] Error creating default vendor profile:', createError);
        return res.status(500).json({ message: 'Failed to create vendor profile' });
      }
    }

    const { vendor, fulfillmentPoint } = vendorResult[0];

    // Return flat object with nested fulfillmentPoint or merged properties if preferred.
    // Client currently expects vendor properties at root.
    res.json({
      ...vendor,
      fulfillmentPoint: fulfillmentPoint // Include the full point object
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function createVendor(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if vendor already exists
    const existingVendor = await db
      .select()
      .from(vendorsTable)
      .where(eq(vendorsTable.userId, req.userId as number));

    if (existingVendor && existingVendor.length > 0) {
      return res.status(400).json({ message: 'Vendor profile already exists' });
    }

    let assignedVerificationPointId = null;
    const vendorLga = req.cleanBody.lga;

    if (vendorLga) {
      // Find a verification point in the same LGA
      // We explicitly cast the enum column to text for comparison to avoid strict type issues if they arise
      const verificationPoints = await db.execute(sql`
        SELECT id FROM fulfillment_points 
        WHERE lga = ${vendorLga} 
        AND "isActive" = true 
        AND "canVerifyVendors" = true
        LIMIT 1
      `);

      if (verificationPoints.rows.length > 0) {
        assignedVerificationPointId = verificationPoints.rows[0].id;
        console.log(`[createVendor] Auto-assigned verification point ${assignedVerificationPointId} for LGA ${vendorLga}`);
      } else {
        console.log(`[createVendor] No verification point found for LGA ${vendorLga}`);
      }
    }

    const vendorData = {
      ...req.cleanBody,
      userId: req.userId,
      assignedVerificationPointId: assignedVerificationPointId,
      status: 'pending' as 'pending' | 'active' | 'suspended', // Explicit cast to satisfy Drizzle types
    };

    const [vendor] = await db
      .insert(vendorsTable)
      .values(vendorData)
      .returning();

    res.status(201).json(vendor);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function updateVendor(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const vendor = await db
      .select()
      .from(vendorsTable)
      .where(eq(vendorsTable.userId, req.userId as number));

    if (!vendor || vendor.length === 0) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    const [updatedVendor] = await db
      .update(vendorsTable)
      .set({ ...req.cleanBody, updatedAt: new Date() })
      .where(eq(vendorsTable.userId, req.userId as number))
      .returning();

    res.json(updatedVendor);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function getVendorStats(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const vendor = await db
      .select()
      .from(vendorsTable)
      .where(eq(vendorsTable.userId, req.userId as number));

    if (!vendor || vendor.length === 0) {
      return res.status(404).json({ message: 'Vendor profile not found' });
    }

    const vendorId = vendor[0].id;

    // Get total products
    const [{ totalProducts }] = await db
      .select({ totalProducts: sql<number>`count(*)` })
      .from(productsTable)
      .where(eq(productsTable.sellerId, vendorId as number));

    // Get active products
    const [{ activeProducts }] = await db
      .select({ activeProducts: sql<number>`count(*)` })
      .from(productsTable)
      .where(
        sql`${productsTable.sellerId} = ${vendorId} AND ${productsTable.status} = 'active'`
      );

    // Get out of stock products
    const [{ outOfStockProducts }] = await db
      .select({ outOfStockProducts: sql<number>`count(*)` })
      .from(productsTable)
      .where(sql`${productsTable.sellerId} = ${vendorId} AND ${productsTable.stock} = 0`);

    // Get Order Stats for this vendor
    // We need to query orders based on sellerId

    // Total Orders
    const [{ totalOrders }] = await db
      .select({ totalOrders: sql<number>`count(*)` })
      .from(ordersTable) // Assuming ordersTable has a sellerId or similar way to filter
      // If ordersTable has sellerId (which it seems to based on schema):
      .where(eq(ordersTable.sellerId, vendorId));

    // Total Revenue
    const [{ totalRevenue }] = await db
      .select({ totalRevenue: sql<number>`sum(${ordersTable.sellerAmount})` }) // Use sellerAmount
      .from(ordersTable)
      .where(eq(ordersTable.sellerId, vendorId));

    res.json({
      vendorId,
      storeName: vendor[0].storeName,
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalOrders: Number(totalOrders || 0),
      totalRevenue: Number(totalRevenue || 0),
      status: vendor[0].status,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}
