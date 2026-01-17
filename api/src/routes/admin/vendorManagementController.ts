import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { vendorsTable } from '../../db/vendorsSchema.js';
import { ordersTable } from '../../db/ordersSchema.js';
import { productsTable } from '../../db/productsSchema.js';
import { eq, sql } from 'drizzle-orm';

export async function listPendingVendors(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive numbers' });
    }

    const offset = (page - 1) * limit;

    const vendors = await db
      .select()
      .from(vendorsTable)
      .where(eq(vendorsTable.status, 'pending'))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(vendorsTable)
      .where(eq(vendorsTable.status, 'pending'));

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

export async function listSuspendedVendors(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive numbers' });
    }

    const offset = (page - 1) * limit;

    const vendors = await db
      .select()
      .from(vendorsTable)
      .where(eq(vendorsTable.status, 'suspended'))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(vendorsTable)
      .where(eq(vendorsTable.status, 'suspended'));

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

export async function approveVendor(req: Request, res: Response) {
  try {
    const { vendorId } = req.params;

    const vendor = await db
      .select()
      .from(vendorsTable)
      .where(eq(vendorsTable.id, Number(vendorId)));

    if (!vendor || vendor.length === 0) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const [updatedVendor] = await db
      .update(vendorsTable)
      .set({ status: 'active', updatedAt: new Date() })
      .where(eq(vendorsTable.id, Number(vendorId)))
      .returning();

    res.json({
      message: 'Vendor approved successfully',
      vendor: updatedVendor,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function rejectVendor(req: Request, res: Response) {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body;

    const vendor = await db
      .select()
      .from(vendorsTable)
      .where(eq(vendorsTable.id, Number(vendorId)));

    if (!vendor || vendor.length === 0) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const [updatedVendor] = await db
      .update(vendorsTable)
      .set({ status: 'suspended', updatedAt: new Date() })
      .where(eq(vendorsTable.id, Number(vendorId)))
      .returning();

    // TODO: Send rejection email with reason

    res.json({
      message: 'Vendor rejected successfully',
      vendor: updatedVendor,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function suspendVendor(req: Request, res: Response) {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body;

    console.log('[suspendVendor] Request received:', { vendorId, reason });

    const vendor = await db
      .select()
      .from(vendorsTable)
      .where(eq(vendorsTable.id, Number(vendorId)));

    if (!vendor || vendor.length === 0) {
      console.log('[suspendVendor] Vendor not found:', vendorId);
      return res.status(404).json({ message: 'Vendor not found' });
    }

    console.log('[suspendVendor] Current vendor status:', vendor[0].status);

    const [updatedVendor] = await db
      .update(vendorsTable)
      .set({ status: 'suspended', updatedAt: new Date() })
      .where(eq(vendorsTable.id, Number(vendorId)))
      .returning();

    console.log('[suspendVendor] Vendor suspended successfully:', updatedVendor.id);

    res.json({
      message: 'Vendor suspended successfully',
      vendor: updatedVendor,
    });
  } catch (e) {
    console.error('[suspendVendor] Error:', e);
    res.status(500).json({
      message: 'Internal server error',
      error: e instanceof Error ? e.message : 'Unknown error'
    });
  }
}

export async function getVendorAnalytics(req: Request, res: Response) {
  try {
    const { vendorId } = req.params;

    // Get vendor info
    const vendor = await db
      .select()
      .from(vendorsTable)
      .where(eq(vendorsTable.id, Number(vendorId)));

    if (!vendor || vendor.length === 0) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Total products
    const [{ totalProducts }] = await db
      .select({ totalProducts: sql<number>`count(*)` })
      .from(productsTable)
      .where(eq(productsTable.sellerId, Number(vendorId)));

    // Total orders (where any item belongs to this vendor)
    const [{ totalOrders }] = await db
      .select({ totalOrders: sql<number>`count(distinct ${ordersTable.id})` })
      .from(ordersTable)
      .where(eq(ordersTable.sellerId, Number(vendorId)));

    // Total revenue (sum of sellerAmount for this vendor)
    const [{ totalRevenue }] = await db
      .select({ totalRevenue: sql<number>`coalesce(sum(${ordersTable.sellerAmount}), 0)` })
      .from(ordersTable)
      .where(eq(ordersTable.sellerId, Number(vendorId)));

    res.json({
      vendorId: vendor[0].id,
      storeName: vendor[0].storeName,
      status: vendor[0].status,
      totalProducts,
      totalOrders,
      totalRevenue: Number(totalRevenue),
      createdAt: vendor[0].createdAt,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function getPlatformStats(req: Request, res: Response) {
  try {
    // Total vendors
    const [{ totalVendors }] = await db
      .select({ totalVendors: sql<number>`count(*)` })
      .from(vendorsTable);

    // Active vendors
    const [{ activeVendors }] = await db
      .select({ activeVendors: sql<number>`count(*)` })
      .from(vendorsTable)
      .where(eq(vendorsTable.status, 'active'));

    // Pending vendors
    const [{ pendingVendors }] = await db
      .select({ pendingVendors: sql<number>`count(*)` })
      .from(vendorsTable)
      .where(eq(vendorsTable.status, 'pending'));

    // Suspended vendors
    const [{ suspendedVendors }] = await db
      .select({ suspendedVendors: sql<number>`count(*)` })
      .from(vendorsTable)
      .where(eq(vendorsTable.status, 'suspended'));

    // Total orders
    const [{ totalOrders }] = await db
      .select({ totalOrders: sql<number>`count(*)` })
      .from(ordersTable);

    // Total platform revenue (sum of platformFee)
    const [{ totalPlatformRevenue }] = await db
      .select({ totalPlatformRevenue: sql<number>`coalesce(sum(${ordersTable.platformFee}), 0)` })
      .from(ordersTable);

    res.json({
      totalVendors,
      activeVendors,
      pendingVendors,
      suspendedVendors,
      totalOrders,
      totalPlatformRevenue: Number(totalPlatformRevenue),
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function updatePlatformCommission(req: Request, res: Response) {
  try {
    const { commissionRate } = req.body;

    if (typeof commissionRate !== 'number' || commissionRate < 0 || commissionRate > 100) {
      return res.status(400).json({ message: 'Invalid commission rate' });
    }

    const result = await db
      .update(vendorsTable)
      .set({ platformCommissionRate: commissionRate, updatedAt: new Date() })
      .returning();

    res.json({
      message: 'Platform commission updated for all vendors',
      updatedCount: result.length,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
}
