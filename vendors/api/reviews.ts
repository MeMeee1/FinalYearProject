
'use server';
import { API_URL } from '@/config';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function fetchVendorReviews() {
    const token = cookies().get('token')?.value;
    const res = await fetch(`${API_URL}/reviews/vendor/my-reviews`, {
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

export async function replyToReview(reviewId: number, reply: string) {
    const token = cookies().get('token')?.value;
    const res = await fetch(`${API_URL}/reviews/${reviewId}/reply`, {
        method: 'PUT',
        headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vendorReply: reply }),
    });

    if (!res.ok) {
        throw new Error('Failed to reply to review');
    }

    revalidatePath('/dashboard/reviews');
    return res.json();
}
