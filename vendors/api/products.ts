'use server';
import { API_URL } from '@/config';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// ==================== VENDOR PRODUCT MANAGEMENT ====================

/**
 * Get all products for the current logged-in vendor
 */
export async function getMyProducts(page = 1, limit = 20) {
	try {
		const token = cookies().get('token')?.value;
		if (!token) {
			throw new Error('No authentication token found');
		}

		// First, get the vendor profile to get the seller ID
		const profileRes = await fetch(`${API_URL}/vendors/profile/me`, {
			cache: 'no-store',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
		}).catch(err => {
			console.error(`❌ Failed to connect to API at ${API_URL}:`, err.message);
			throw new Error(`Cannot connect to API server at ${API_URL}. Make sure the backend is running.`);
		});

		if (!profileRes.ok) {
			if (profileRes.status === 401) {
				throw new Error('Unauthorized - please login again');
			}
			throw new Error(`Failed to load vendor profile (${profileRes.status})`);
		}

		const profile = await profileRes.json();
		const sellerId = profile.id;

		if (!sellerId) {
			throw new Error('Could not determine seller ID from profile');
		}

		// Now fetch products for this seller
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		const url = `${API_URL}/products/seller/${sellerId}?${params.toString()}`;

		const res = await fetch(url, {
			cache: 'no-store',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
		}).catch(err => {
			console.error(`❌ Failed to connect to API at ${API_URL}:`, err.message);
			throw new Error(`Cannot connect to API server at ${API_URL}. Make sure the backend is running.`);
		});

		if (!res.ok) {
			if (res.status === 401) {
				throw new Error('Unauthorized - please login again');
			}
			if (res.status === 404) {
				throw new Error('Products endpoint not found - API may be unavailable');
			}
			throw new Error(`Failed to load your products (${res.status})`);
		}

		return await res.json();
	} catch (error) {
		console.error('Error fetching your products:', error);
		throw error;
	}
}

export async function getProductsByVendor(vendorId: number | string, page = 1, limit = 20) {
	try {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		const res = await fetch(`${API_URL}/products/seller/${vendorId}?${params.toString()}`, {
			cache: 'no-store',
		});
		if (!res.ok) {
			throw new Error(`Error: ${res.status}`);
		}

		const data = await res.json();
		return data;
	} catch (error) {
		console.error('Error fetching vendor products:', error);
		throw error;
	}
}

export async function fetchProductById(id: number) {
	try {
		const url = `${API_URL}/products/${id}`;

		const res = await fetch(url, { cache: 'no-store' }).catch(err => {
			console.error(`❌ Failed to connect to API at ${API_URL}:`, err.message);
			throw new Error(`Cannot connect to API server at ${API_URL}. Make sure the backend is running.`);
		});

		if (!res.ok) {
			throw new Error(`Failed to load product (${res.status})`);
		}

		const data = await res.json();
		return data;
	} catch (error) {
		console.error('Error fetching product:', error);
		throw error;
	}
}

/**
 * Create a new product for the vendor
 */
export async function createProduct(productData: {
	name: string;
	description: string;
	price: number;
	stock: number;
	category?: string;
	images?: string[];
	sku?: string;
	weight?: number;
	dimensions?: string;
}) {
	try {
		const token = cookies().get('token')?.value;
		if (!token) {
			throw new Error('No authentication token found');
		}

		const url = `${API_URL}/products`;

		const res = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(productData),
		}).catch(err => {
			console.error(`❌ Failed to connect to API at ${API_URL}:`, err.message);
			throw new Error(`Cannot connect to API server at ${API_URL}. Make sure the backend is running.`);
		});

		if (!res.ok) {
			if (res.status === 401) {
				throw new Error('Unauthorized - please login again');
			}
			if (res.status === 404) {
				throw new Error('Products endpoint not found - API may be unavailable');
			}
			const errorData = await res.json().catch(() => ({}));
			throw new Error(errorData.message || `Failed to create product (${res.status})`);
		}

		revalidatePath('/dashboard/products');
		return await res.json();
	} catch (error) {
		console.error('Error creating product:', error);
		throw error;
	}
}

/**
 * Update an existing product
 */
export async function updateProduct(
	productId: number | string,
	productData: {
		name?: string;
		description?: string;
		price?: number;
		stock?: number;
		category?: string;
		images?: string[];
		sku?: string;
		weight?: number;
		dimensions?: string;
	}
) {
	try {
		const token = cookies().get('token')?.value;
		if (!token) {
			throw new Error('No authentication token found');
		}

		const res = await fetch(`${API_URL}/products/${productId}`, {
			method: 'PUT',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(productData),
		}).catch(err => {
			console.error(`❌ Failed to connect to API at ${API_URL}:`, err.message);
			throw new Error(`Cannot connect to API server at ${API_URL}. Make sure the backend is running.`);
		});

		if (!res.ok) {
			if (res.status === 401) {
				throw new Error('Unauthorized - please login again');
			}
			if (res.status === 404) {
				throw new Error('Product not found');
			}
			if (res.status === 403) {
				throw new Error('You do not have permission to update this product');
			}
			const errorData = await res.json().catch(() => ({}));
			throw new Error(errorData.message || 'Failed to update product');
		}

		revalidatePath('/dashboard/products');
		return await res.json();
	} catch (error) {
		console.error('Error updating product:', error);
		throw error;
	}
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: number | string) {
	try {
		const token = cookies().get('token')?.value;
		if (!token) {
			throw new Error('No authentication token found');
		}

		const res = await fetch(`${API_URL}/products/${productId}`, {
			method: 'DELETE',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
		}).catch(err => {
			console.error(`❌ Failed to connect to API at ${API_URL}:`, err.message);
			throw new Error(`Cannot connect to API server at ${API_URL}. Make sure the backend is running.`);
		});

		if (!res.ok) {
			if (res.status === 401) {
				throw new Error('Unauthorized - please login again');
			}
			if (res.status === 404) {
				throw new Error('Product not found');
			}
			if (res.status === 403) {
				throw new Error('You do not have permission to delete this product');
			}
			const errorData = await res.json().catch(() => ({}));
			throw new Error(errorData.message || 'Failed to delete product');
		}

		revalidatePath('/dashboard/products');
		return await res.json();
	} catch (error) {
		console.error('Error deleting product:', error);
		throw error;
	}
}
