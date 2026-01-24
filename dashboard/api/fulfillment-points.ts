'use server';

import { API_URL } from '@/config';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function fetchFulfillmentPoints() {
    const res = await fetch(`${API_URL}/fulfillment-points`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch fulfillment points');
    return await res.json();
}

export async function createFulfillmentPoint(data: any) {
    const token = cookies().get('token')?.value;
    const res = await fetch(`${API_URL}/fulfillment-points`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ?? '',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error');
        throw new Error(`Failed to create fulfillment point: ${res.status} ${errorText}`);
    }

    revalidatePath('/dashboard/fulfillment-points');
    return await res.json();
}

export async function updateFulfillmentPoint(id: number | string, data: any) {
    const token = cookies().get('token')?.value;
    const res = await fetch(`${API_URL}/fulfillment-points/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ?? '',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error');
        throw new Error(`Failed to update fulfillment point: ${res.status} ${errorText}`);
    }

    revalidatePath('/dashboard/fulfillment-points');
    return await res.json();
}

export async function deleteFulfillmentPoint(id: number | string) {
    const token = cookies().get('token')?.value;
    const res = await fetch(`${API_URL}/fulfillment-points/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token ?? '',
        },
    });

    if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error');
        throw new Error(`Failed to delete fulfillment point: ${res.status} ${errorText}`);
    }

    revalidatePath('/dashboard/fulfillment-points');
    return await res.json();
}
