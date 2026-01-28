import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { productsTable } from '../../db/productsSchema.js';
import { vendorsTable } from '../../db/vendorsSchema.js';
import { usersTable } from '../../db/usersSchema.js';
import { SQL, eq, and, sql, like, or, ilike, desc, asc } from 'drizzle-orm';
import _ from 'lodash';

export async function listProducts(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive numbers' });
    }

    const offset = (page - 1) * limit;

    const lga = req.query.lga as string;
    const category = req.query.category as string;

    const conditions = [eq(productsTable.status, 'active')];

    if (lga && lga !== 'All') {
      conditions.push(eq(vendorsTable.lga, lga as any));
    }

    if (category && category !== 'All') {
      conditions.push(eq(productsTable.productTags, category as any));
    }

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
        productTags: productsTable.productTags,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
        sellerId: productsTable.sellerId,
        video: productsTable.video,
        supportsOutsideLgaDelivery: productsTable.supportsOutsideLgaDelivery,
        vendor: {
          id: vendorsTable.id,
          storeName: vendorsTable.storeName,
          storeDescription: vendorsTable.storeDescription,
          businessAddress: vendorsTable.businessAddress,
          lga: vendorsTable.lga,
          assignedVerificationPointId: vendorsTable.assignedVerificationPointId,
        },
      })
      .from(productsTable)
      .leftJoin(vendorsTable, eq(productsTable.sellerId, vendorsTable.id))
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);
    console.log('Fetched products:', products);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(productsTable)
      .where(eq(productsTable.status, 'active'));

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
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
        sellerId: productsTable.sellerId,
        video: productsTable.video,
        supportsOutsideLgaDelivery: productsTable.supportsOutsideLgaDelivery,
        // Agricultural/Livestock-specific fields
        productTags: productsTable.productTags,
        speciesBreed: productsTable.speciesBreed,
        age: productsTable.age,
        weightSize: productsTable.weightSize,
        growthStage: productsTable.growthStage,
        healthStatus: productsTable.healthStatus,
        vaccinationStatus: productsTable.vaccinationStatus,
        diseaseHistory: productsTable.diseaseHistory,
        vendor: {
          id: vendorsTable.id,
          storeName: vendorsTable.storeName,
          storeDescription: vendorsTable.storeDescription,
          businessAddress: vendorsTable.businessAddress,
          businessPhone: vendorsTable.businessPhone,
          businessEmail: vendorsTable.businessEmail,
          assignedVerificationPointId: vendorsTable.assignedVerificationPointId,
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
        sku: productsTable.sku,
        status: productsTable.status,
        video: productsTable.video,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
        // Agricultural/Livestock-specific fields
        productTags: productsTable.productTags,
        speciesBreed: productsTable.speciesBreed,
        age: productsTable.age,
        weightSize: productsTable.weightSize,
        growthStage: productsTable.growthStage,
        healthStatus: productsTable.healthStatus,
        vaccinationStatus: productsTable.vaccinationStatus,
        supportsOutsideLgaDelivery: productsTable.supportsOutsideLgaDelivery,
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



// Helper to generate SKU
function generateSKU(name: string): string {
  const prefix = name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
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

    const { name, image, images, video, sku, ...rest } = req.cleanBody;
    console.log('Create Product CleanBody:', { name, image: image ? 'present' : 'missing', imagesCount: images?.length, sku, video: video ? 'present' : 'missing' });

    // Handle images: prefer 'images' array, fallback to 'image' string/array
    let finalImageString: string | null = null;
    let imageList: string[] = [];

    if (Array.isArray(images)) {
      imageList = images;
    } else if (Array.isArray(image)) {
      imageList = image;
    } else if (image) {
      imageList = [image];
    }

    if (imageList.length > 0) {
      if (imageList.length === 1) {
        finalImageString = imageList[0];
      } else {
        finalImageString = JSON.stringify(imageList);
      }
    }

    // Auto-generate SKU if missing
    const finalSku = sku && sku.trim() !== '' ? sku : generateSKU(name);

    const productData = {
      name,
      ...rest,
      sku: finalSku,
      image: finalImageString, // Can be string, JSON string, or null
      video, // Add video field
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

    const { image, images, video, ...rest } = req.cleanBody;
    console.log('Update Product CleanBody:', { image: image ? 'present' : 'missing', imagesCount: images?.length, video: video ? 'present' : 'missing' });
    const updatedFields: any = { ...rest };

    if (video !== undefined) {
      updatedFields.video = video;
    }

    // Handle image update if provided
    // Handle image update if provided
    if (images !== undefined || image !== undefined) {
      let imageList: string[] = [];
      if (Array.isArray(images)) {
        imageList = images;
      } else if (Array.isArray(image)) {
        imageList = image;
      } else if (image) {
        imageList = [image];
      }

      if (imageList.length === 0) {
        // Explicitly cleared images? Or just empty array sent.
        // If user sent empty array, maybe they meant to delete images?
        // Let's assume empty array means no images.
        updatedFields.image = null;
      } else if (imageList.length === 1) {
        updatedFields.image = imageList[0];
      } else {
        updatedFields.image = JSON.stringify(imageList);
      }
    }

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
    const searchQuery = req.query.q as string;
    const lga = req.query.lga as string;
    const category = req.query.category as string;
    const sort = req.query.sort as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Remove mandatory search query check to allow listing all products with filters
    // if (!searchQuery || searchQuery.trim() === '') {
    //   return res.status(400).json({ message: 'Search query is required' });
    // }

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'Page and limit must be positive numbers' });
    }

    const offset = (page - 1) * limit;

    // Build conditions
    const conditions: SQL[] = [eq(productsTable.status, 'active')];

    if (searchQuery && searchQuery.trim() !== '') {
      const searchCondition = or(
        ilike(productsTable.name, `%${searchQuery}%`),
        ilike(productsTable.description, `%${searchQuery}%`),
        ilike(vendorsTable.storeName, `%${searchQuery}%`),
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    if (lga && lga.trim() !== '' && lga !== 'All') {
      conditions.push(eq(vendorsTable.lga, lga as any));
    }

    if (category && category.trim() !== '' && category !== 'All') {
      conditions.push(eq(productsTable.productTags, category as any));
    }

    // Determine Sort Order
    let orderBy: any = desc(productsTable.createdAt); // Default: Newest first

    if (sort === 'price_asc') {
      orderBy = asc(productsTable.price);
    } else if (sort === 'price_desc') {
      orderBy = desc(productsTable.price);
    } else if (sort === 'oldest') {
      orderBy = asc(productsTable.createdAt);
    }

    // Search products
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
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
        sellerId: productsTable.sellerId,
        video: productsTable.video,
        productTags: productsTable.productTags,
        supportsOutsideLgaDelivery: productsTable.supportsOutsideLgaDelivery,
        vendor: {
          id: vendorsTable.id,
          storeName: vendorsTable.storeName,
          storeDescription: vendorsTable.storeDescription,
          businessAddress: vendorsTable.businessAddress,
          lga: vendorsTable.lga,
          assignedVerificationPointId: vendorsTable.assignedVerificationPointId,
        },
      })
      .from(productsTable)
      .leftJoin(vendorsTable, eq(productsTable.sellerId, vendorsTable.id))
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(productsTable)
      .leftJoin(vendorsTable, eq(productsTable.sellerId, vendorsTable.id))
      .where(and(...conditions));

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

export async function getProductCategories(req: Request, res: Response) {
  try {
    const categories = ['Chicken', 'Fish', 'Eggs'];
    res.json(categories);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}
export async function reduceStock(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { quantity } = req.body;

    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const [updatedProduct] = await db
      .update(productsTable)
      .set({ stock: product.stock - quantity })
      .where(eq(productsTable.id, id))
      .returning();

    // Broadcast stock update via WebSockets
    if (req.io && updatedProduct) {
      req.io.emit('stock_updated', {
        productId: id,
        newStock: updatedProduct.stock
      });
    }

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Failed to update stock: Product not found during update' });
    }

    res.json(updatedProduct);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}
