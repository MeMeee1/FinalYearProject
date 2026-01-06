import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { vendorsTable } from '../../db/vendorsSchema.js';
import { usersTable } from '../../db/usersSchema.js';
import { productsTable } from '../../db/productsSchema.js';
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

    res.json(vendor[0]);
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

    const vendorData = {
      ...req.cleanBody,
      userId: req.userId,
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

    res.json({
      vendorId,
      storeName: vendor[0].storeName,
      totalProducts,
      activeProducts,
      outOfStockProducts,
      status: vendor[0].status,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}
