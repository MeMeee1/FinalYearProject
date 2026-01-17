
'use server';
import { API_URL } from '@/config';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function fetchAllReviews() {
    const token = cookies().get('token')?.value;
    const res = await fetch(`${API_URL}/reviews/admin/all`, {
        headers: {
            Authorization: `${token}`,
        },
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch reviews');
    }
    return res.json();
}

export async function deleteReview(reviewId: number) {
    const token = cookies().get('token')?.value;
    const res = await fetch(`${API_URL}/reviews/admin/${reviewId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to delete review');
    }

    revalidatePath('/dashboard/reviews');
}
