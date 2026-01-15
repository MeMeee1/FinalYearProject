import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { productsTable } from '../../db/productsSchema.js';
import { vendorsTable } from '../../db/vendorsSchema.js';
import { usersTable } from '../../db/usersSchema.js';
import { eq, and, sql, like, or, ilike } from 'drizzle-orm';
import _ from 'lodash';
import { calculateDistance } from '../../utils/calculateDistance.js';
// Haversine formula to calculate distance between two coordinates

export async function listProducts(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const userLat = req.query.latitude ? Number(req.query.latitude) : null;
    const userLon = req.query.longitude ? Number(req.query.longitude) : null;
    const maxDistance = req.query.maxDistance ? Number(req.query.maxDistance) : null; // in km

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive numbers' });
    }

    const offset = (page - 1) * limit;

    // Get all products with vendor info
    const products = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        image: productsTable.image,
        price: productsTable.price,
        stock: productsTable.stock,
        sku: productsTable.sku,
        status: productsTable.status,
        productAddress: productsTable.productAddress,
        longitude: productsTable.longitude,
        latitude: productsTable.latitude,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
        sellerId: productsTable.sellerId,
        vendor: {
          id: vendorsTable.id,
          storeName: vendorsTable.storeName,
          storeDescription: vendorsTable.storeDescription,
          businessAddress: vendorsTable.businessAddress,
        },
      })
      .from(productsTable)
      .leftJoin(vendorsTable, eq(productsTable.sellerId, vendorsTable.id))
      .where(eq(productsTable.status, 'active'))
      .limit(limit)
      .offset(offset);
    console.log('Fetched products:', products);
    // Filter by distance using Haversine formula if coordinates provided
    let filteredProducts = products;
    if (userLat !== null && userLon !== null && maxDistance !== null) {
      filteredProducts = products.filter((product) => {
        if (!product.latitude || !product.longitude) return false;

        const productLat = Number(product.latitude);
        const productLon = Number(product.longitude);

        const distance = calculateDistance(userLat, userLon, productLat, productLon);
        return distance <= maxDistance;
      });
    }

    // Add distance to response if coordinates provided
    const productsWithDistance = filteredProducts.map((product) => {
      if (userLat !== null && userLon !== null && product.latitude && product.longitude) {
        const distance = calculateDistance(
          userLat,
          userLon,
          Number(product.latitude),
          Number(product.longitude)
        );
        return { ...product, distance };
      }
      return product;
    });

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(productsTable)
      .where(eq(productsTable.status, 'active'));

    const totalPages = Math.ceil(count / limit);

    res.json({
      data: productsWithDistance,
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

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        image: productsTable.image,
        price: productsTable.price,
        stock: productsTable.stock,
        sku: productsTable.sku,
        status: productsTable.status,
        productAddress: productsTable.productAddress,
        longitude: productsTable.longitude,
        latitude: productsTable.latitude,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
        sellerId: productsTable.sellerId,
        vendor: {
          id: vendorsTable.id,
          storeName: vendorsTable.storeName,
          storeDescription: vendorsTable.storeDescription,
          businessAddress: vendorsTable.businessAddress,
          businessPhone: vendorsTable.businessPhone,
          businessEmail: vendorsTable.businessEmail,
        },
      })
      .from(productsTable)
      .leftJoin(vendorsTable, eq(productsTable.sellerId, vendorsTable.id))
      .where(eq(productsTable.id, Number(id)));

    if (!product || product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product[0]);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function getProductsBySeller(req: Request, res: Response) {
  try {
    const { sellerId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive numbers' });
    }

    const offset = (page - 1) * limit;

    const products = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        image: productsTable.image,
        price: productsTable.price,
        stock: productsTable.stock,
        status: productsTable.status,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
      })
      .from(productsTable)
      .where(eq(productsTable.sellerId, Number(sellerId)))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(productsTable)
      .where(eq(productsTable.sellerId, Number(sellerId)));

    const totalPages = Math.ceil(count / limit);

    res.json({
      data: products,
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

export async function getProductsByDistance(req: Request, res: Response) {
  try {
    const { latitude, longitude, maxDistance } = req.query;

    if (!latitude || !longitude || !maxDistance) {
      return res
        .status(400)
        .json({ message: 'latitude, longitude, and maxDistance are required' });
    }

    const userLat = Number(latitude);
    const userLon = Number(longitude);
    const maxDist = Number(maxDistance);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive numbers' });
    }

    const offset = (page - 1) * limit;

    // Get all active products
    const allProducts = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        image: productsTable.image,
        price: productsTable.price,
        stock: productsTable.stock,
        sku: productsTable.sku,
        status: productsTable.status,
        longitude: productsTable.longitude,
        latitude: productsTable.latitude,
        productAddress: productsTable.productAddress,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
        sellerId: productsTable.sellerId,
        vendor: {
          id: vendorsTable.id,
          storeName: vendorsTable.storeName,
          businessAddress: vendorsTable.businessAddress,
        },
      })
      .from(productsTable)
      .leftJoin(vendorsTable, eq(productsTable.sellerId, vendorsTable.id))
      .where(eq(productsTable.status, 'active'));

    // Filter products within distance
    const productsWithinDistance = allProducts
      .filter((product) => {
        if (!product.latitude || !product.longitude) return false;

        const productLat = Number(product.latitude);
        const productLon = Number(product.longitude);
        const distance = calculateDistance(userLat, userLon, productLat, productLon);

        return distance <= maxDist;
      })
      .map((product) => {
        const distance = calculateDistance(
          userLat,
          userLon,
          Number(product.latitude),
          Number(product.longitude)
        );
        return { ...product, distance };
      })
      .sort((a, b) => a.distance - b.distance); // Sort by distance (closest first)

    // Apply pagination
    const paginatedProducts = productsWithinDistance.slice(offset, offset + limit);
    const totalPages = Math.ceil(productsWithinDistance.length / limit);

    res.json({
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total: productsWithinDistance.length,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get vendor by userId
    const vendor = await db
      .select()
      .from(vendorsTable)
      .where(eq(vendorsTable.userId, Number(req.userId)));

    if (!vendor || vendor.length === 0) {
      return res.status(403).json({ message: 'Vendor profile not found' });
    }

    if (vendor[0].status !== 'active') {
      console.log(`Vendor account is not active${vendor[0].status}`);
      return res.status(403).json({ message: 'Vendor account is not active' });
    }

    const productData = {
      ...req.cleanBody,
      sellerId: vendor[0].id,
    };

    const [product] = await db
      .insert(productsTable)
      .values(productData)
      .returning();

    res.status(201).json(product);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get vendor by userId
    const vendor = await db
      .select()
      .from(vendorsTable)
      .where(eq(vendorsTable.userId, req.userId as number));

    if (!vendor || vendor.length === 0) {
      return res.status(403).json({ message: 'Vendor profile not found' });
    }

    if (vendor[0].status !== 'active') {
      return res.status(403).json({ message: 'Vendor account must be active to perform this action' });
    }

    // Check if product belongs to this vendor
    const product = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));

    if (!product || product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product[0].sellerId !== vendor[0].id && req.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updatedFields = req.cleanBody;

    const [updatedProduct] = await db
      .update(productsTable)
      .set({ ...updatedFields, updatedAt: new Date() })
      .where(eq(productsTable.id, id))
      .returning();

    res.json(updatedProduct);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get vendor by userId
    const vendor = await db
      .select()
      .from(vendorsTable)
      .where(eq(vendorsTable.userId, Number(req.userId)));

    if (!vendor || vendor.length === 0) {
      return res.status(403).json({ message: 'Vendor profile not found' });
    }

    if (vendor[0].status !== 'active') {
      return res.status(403).json({ message: 'Vendor account must be active to perform this action' });
    }

    // Check if product belongs to this vendor
    const product = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));

    if (!product || product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product[0].sellerId !== vendor[0].id && req.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();

    if (deletedProduct) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Product was not found' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function searchProducts(req: Request, res: Response) {
  try {
    const searchQuery = req.query.q as string; // search query
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!searchQuery || searchQuery.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive numbers' });
    }

    const offset = (page - 1) * limit;

    // Search products by name or description
    const products = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        image: productsTable.image,
        price: productsTable.price,
        stock: productsTable.stock,
        sku: productsTable.sku,
        status: productsTable.status,
        productAddress: productsTable.productAddress,
        longitude: productsTable.longitude,
        latitude: productsTable.latitude,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
        sellerId: productsTable.sellerId,
        vendor: {
          id: vendorsTable.id,
          storeName: vendorsTable.storeName,
          storeDescription: vendorsTable.storeDescription,
          businessAddress: vendorsTable.businessAddress,
        },
      })
      .from(productsTable)
      .leftJoin(vendorsTable, eq(productsTable.sellerId, vendorsTable.id))
      .where(
        and(
          eq(productsTable.status, 'active'),
          or(
            ilike(productsTable.name, `%${searchQuery}%`),
            ilike(productsTable.description, `%${searchQuery}%`),
            ilike(vendorsTable.storeName, `%${searchQuery}%`),
          )
        )
      )
      .limit(limit)
      .offset(offset);

    console.log('Search results:', products);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(productsTable)
      .where(
        and(
          eq(productsTable.status, 'active'),
          or(
            like(productsTable.name, `%${searchQuery}%`),
            like(productsTable.description, `%${searchQuery}%`),

          )
        )
      );

    const totalPages = Math.ceil(count / limit);

    res.json({
      data: products,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasMore: page < totalPages,
      },
      searchQuery,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}