'use server';

import { API_URL } from '@/config';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Get the current logged-in vendor's profile
 * Fetches fresh data from the backend each time
 */
export async function getVendorProfile() {
	try {
		const token = cookies().get('token')?.value;
		if (!token) {
			throw new Error('No authentication token found');
		}

		const url = `${API_URL}/vendors/profile/me`;


		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const res = await fetch(url, {
			cache: 'no-store',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
			signal: controller.signal,
		}).finally(() => clearTimeout(timeoutId)).catch(err => {
			if (err.name === 'AbortError') {
				throw new Error('Request timed out after 10 seconds');
			}
			console.error(`❌ Failed to connect to API at ${API_URL}:`, err.message);
			throw new Error(`Cannot connect to API server at ${API_URL}. Make sure the backend is running.`);
		});
		console.log('[getVendorProfile] Response status:', res.status)

		if (!res.ok) {
			if (res.status === 401) {
				throw new Error('Unauthorized - please login again');
			}
			if (res.status === 404) {
				throw new Error('Vendor profile not found');
			}
			throw new Error(`Failed to load vendor profile (${res.status})`);
		}

		const profileData = await res.json();
		console.log('[getVendorProfile] Fetched profile with status:', profileData.status);
		return profileData;
	} catch (error) {
		console.error('Error fetching vendor profile:', error);
		throw error;
	}
}

/**
 * Update vendor profile
 */
export async function updateVendorProfile(profileData: any) {
	try {
		const token = cookies().get('token')?.value;
		if (!token) {
			throw new Error('No authentication token found');
		}

		const res = await fetch(`${API_URL}/vendors/profile/me`, {
			method: 'PUT',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(profileData),
		});

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}));
			throw new Error(errorData.message || 'Failed to update vendor profile');
		}

		revalidatePath('/dashboard');
		return await res.json();
	} catch (error) {
		console.error('Error updating vendor profile:', error);
		throw error;
	}
}

/**
 * Get vendor statistics
 */
export async function getVendorStats() {
	try {
		const token = cookies().get('token')?.value;
		if (!token) {
			throw new Error('No authentication token found');
		}

		const url = `${API_URL}/vendors/stats/me`;

		const res = await fetch(url, {
			cache: 'no-store',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
		});

		if (!res.ok) {
			throw new Error(`Failed to load vendor statistics (${res.status})`);
		}

		return await res.json();
	} catch (error) {
		console.error('Error fetching vendor stats:', error);
		throw error;
	}
}

export async function getVendorById(id: number | string) {
	const res = await fetch(`${API_URL}/vendors/by-id/${id}`, { cache: 'no-store' });
	if (!res.ok) {
		throw new Error('Failed to load vendor');
	}
	return await res.json();
}

export async function createVendor(vendorData: any, token: string) {
	const res = await fetch(`${API_URL}/vendors`, {
		method: 'POST',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(vendorData),
	});
	if (!res.ok) {
		const error = await res.json();
		throw new Error(error.message || 'Failed to create vendor profile');
	}
	return await res.json();
}
