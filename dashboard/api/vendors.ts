'use server';
import { API_URL } from '@/config';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
type Pagination = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasMore: boolean;
};

export async function listActiveVendors(page = 1, limit = 12) {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});

	const res = await fetch(`${API_URL}/vendors?${params.toString()}`, {
		cache: 'no-store',
	});
	if (!res.ok) {
		const text = await res.text().catch(() => 'Unknown error');
		throw new Error(`Failed to load vendors: ${res.status} ${text}`);
	}
	return (await res.json()) as { data: any[]; pagination: Pagination };
}

export async function listPendingVendors(page = 1, limit = 12) {
	const token = cookies().get('token')?.value;
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});
	const res = await fetch(`${API_URL}/admin/vendors/pending?${params.toString()}`, {
		cache: 'no-store',
		headers: {
			Authorization: token ?? '',
			'Content-Type': 'application/json',
		},
	});
	if (!res.ok) {
		const text = await res.text().catch(() => 'Unknown error');
		throw new Error(`Failed to load pending vendors: ${res.status} ${text}`);
	}
	return (await res.json()) as { data: any[]; pagination: Pagination };
}
export async function listSuspendingVendors(page = 1, limit = 12) {
	const token = cookies().get('token')?.value;
	const params = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});
	const res = await fetch(`${API_URL}/admin/vendors/suspended?${params.toString()}`, {
		cache: 'no-store',
		headers: {
			Authorization: token ?? '',
			'Content-Type': 'application/json',
		},
	});
	if (!res.ok) {
		const text = await res.text().catch(() => 'Unknown error');
		throw new Error(`Failed to load pending vendors: ${res.status} ${text}`);
	}
	return (await res.json()) as { data: any[]; pagination: Pagination };
}
export async function getVendorById(id: number | string) {
	const res = await fetch(`${API_URL}/vendors/by-id/${id}`, { cache: 'no-store' });
	if (!res.ok) {
		throw new Error('Failed to load vendor');
	}
	return await res.json();
}

export async function getVendorAnalytics(vendorId: number | string) {
	const token = cookies().get('token')?.value;
	const res = await fetch(`${API_URL}/admin/vendors/${vendorId}/analytics`, {
		cache: 'no-store',
		headers: {
			Authorization: token ?? '',
			'Content-Type': 'application/json',
		},
	});
	if (!res.ok) {
		throw new Error('Failed to load vendor analytics');
	}
	return await res.json();
}

export async function getPlatformStats() {
	const token = cookies().get('token')?.value;
	const res = await fetch(`${API_URL}/admin/platform/stats`, {
		cache: 'no-store',
		headers: {
			Authorization: token ?? '',
			'Content-Type': 'application/json',
		},
	});
	if (!res.ok) {
		throw new Error('Failed to load platform stats');
	}
	return await res.json();
}



export async function approveVendor(vendorId: number | string) {
	const token = cookies().get('token')?.value;
	const res = await fetch(`${API_URL}/admin/vendors/${vendorId}/approve`, {
		method: 'POST',
		headers: { Authorization: token ?? '', 'Content-Type': 'application/json' },
	});
	if (!res.ok) throw new Error('Failed to approve vendor');
	revalidatePath('/dashboard/vendors');
}

export async function rejectVendor(vendorId: number | string, reason?: string) {
	const token = cookies().get('token')?.value;
	const res = await fetch(`${API_URL}/admin/vendors/${vendorId}/reject`, {
		method: 'POST',
		headers: { Authorization: token ?? '', 'Content-Type': 'application/json' },
		body: JSON.stringify({ reason }),
	});
	if (!res.ok) throw new Error('Failed to reject vendor');
	revalidatePath('/dashboard/vendors');
}

export async function suspendVendor(vendorId: number | string, reason?: string) {
	const token = cookies().get('token')?.value;
	const res = await fetch(`${API_URL}/admin/vendors/${vendorId}/suspend`, {
		method: 'POST',
		headers: { Authorization: token ?? '', 'Content-Type': 'application/json' },
		body: JSON.stringify({ reason }),
	});
	if (!res.ok) {
		const errorText = await res.text().catch(() => 'Unknown error');
		console.error('Suspend vendor error:', res.status, errorText);
		throw new Error(`Failed to suspend vendor: ${res.status} - ${errorText}`);
	}
	revalidatePath('/dashboard/vendors');
}

export async function updateVendorCommission(vendorId: number | string, commissionRate: number) {
	const token = cookies().get('token')?.value;
	const res = await fetch(`${API_URL}/admin/vendors/${vendorId}/commission`, {
		method: 'PUT',
		headers: { Authorization: token ?? '', 'Content-Type': 'application/json' },
		body: JSON.stringify({ commissionRate }),
	});

	if (!res.ok) {
		const errorText = await res.text().catch(() => 'Unknown error');
		throw new Error(`Failed to update commission rate: ${res.status} - ${errorText}`);
	}
	revalidatePath(`/dashboard/vendors/${vendorId}`);
}

export async function updatePlatformCommission(commissionRate: number) {
	const token = cookies().get('token')?.value;
	const res = await fetch(`${API_URL}/admin/platform/commission`, {
		method: 'PUT',
		headers: { Authorization: token ?? '', 'Content-Type': 'application/json' },
		body: JSON.stringify({ commissionRate }),
	});

	if (!res.ok) {
		const errorText = await res.text().catch(() => 'Unknown error');
		throw new Error(`Failed to update platform commission: ${res.status} - ${errorText}`);
	}
	revalidatePath('/dashboard');
}
