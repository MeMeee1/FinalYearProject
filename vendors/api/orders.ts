'use server';
import { API_URL } from '@/config';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Get all orders for the current logged-in vendor
 */
export async function fetchVendorOrders(page = 1, limit = 20) {
	try {
		const token = cookies().get('token')?.value;

		if (!token) {
			throw new Error('No authentication token found');
		}

		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		const url = `${API_URL}/orders?${params.toString()}`;
		
		const response = await fetch(url, {
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		}).catch(err => {
			console.error(`❌ Failed to connect to API at ${API_URL}:`, err.message);
			throw new Error(`Cannot connect to API server at ${API_URL}. Make sure the backend is running.`);
		});

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error('Unauthorized - please login again');
			}
			if (response.status === 404) {
				throw new Error('Orders endpoint not found - API may be unavailable');
			}
			console.error('Server response:', response.status);
			throw new Error(`Failed to fetch orders (${response.status})`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching vendor orders:', error);
		throw error;
	}
}

/**
 * Get a specific order by ID
 */
export async function fetchOrder(id: number) {
	try {
		const token = cookies().get('token')?.value;

		if (!token) {
			throw new Error('No authentication token found');
		}

		const response = await fetch(`${API_URL}/orders/${id}`, {
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error('Unauthorized - please login again');
			}
			if (response.status === 404) {
				throw new Error('Order not found');
			}
			if (response.status === 403) {
				throw new Error('You do not have permission to view this order');
			}
			console.error('Server response:', response.status);
			throw new Error('Failed to fetch order');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching order:', error);
		throw error;
	}
}

/**
 * Update order status
 */
export async function updateOrderStatus(
	orderId: number | string,
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
	notes?: string
) {
	try {
		const token = cookies().get('token')?.value;

		if (!token) {
			throw new Error('No authentication token found');
		}

		const updateData: Record<string, any> = { status };
		if (notes) {
			updateData.notes = notes;
		}

		const response = await fetch(`${API_URL}/orders/${orderId}`, {
			method: 'PUT',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateData),
		});

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error('Unauthorized - please login again');
			}
			if (response.status === 404) {
				throw new Error('Order not found');
			}
			if (response.status === 403) {
				throw new Error('You do not have permission to update this order');
			}
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || 'Failed to update order');
		}

		revalidatePath('/dashboard/orders');
		return await response.json();
	} catch (error) {
		console.error('Error updating order status:', error);
		throw error;
	}
}

/**
 * Update order details
 */
export async function updateOrder(
	orderId: number | string,
	orderData: {
		status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
		notes?: string;
		shippingAddress?: string;
		trackingNumber?: string;
	}
) {
	try {
		const token = cookies().get('token')?.value;

		if (!token) {
			throw new Error('No authentication token found');
		}

		const response = await fetch(`${API_URL}/orders/${orderId}`, {
			method: 'PUT',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(orderData),
		});

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error('Unauthorized - please login again');
			}
			if (response.status === 404) {
				throw new Error('Order not found');
			}
			if (response.status === 403) {
				throw new Error('You do not have permission to update this order');
			}
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || 'Failed to update order');
		}

		revalidatePath('/dashboard/orders');
		return await response.json();
	} catch (error) {
		console.error('Error updating order:', error);
		throw error;
	}
}

/**
 * Get order statistics for vendor dashboard
 */
export async function getOrderStats() {
	try {
		const token = cookies().get('token')?.value;

		if (!token) {
			throw new Error('No authentication token found');
		}

		const response = await fetch(`${API_URL}/orders/stats/me`, {
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error('Unauthorized - please login again');
			}
			console.error('Server response:', response.status);
			throw new Error('Failed to fetch order statistics');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching order stats:', error);
		throw error;
	}
}
