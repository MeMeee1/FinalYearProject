import { useAuth } from '@/store/authStore';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Review {
    id: number;
    userId: number;
    productId: number;
    rating: number;
    comment: string | null;
    vendorReply: string | null;
    replyDate: string | null;
    isVerifiedPurchase: boolean;
    createdAt: string;
    updatedAt: string;
}

export async function listProductReviews(productId: number): Promise<Review[]> {
    const res = await fetch(`${API_URL}/reviews/products/${productId}`);
    if (!res.ok) {
        throw new Error('Error fetching reviews');
    }
    return res.json();
}

export async function createReview(productId: number, rating: number, comment: string) {
    const token = useAuth.getState().token;

    const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token || '',
        },
        body: JSON.stringify({ productId, rating, comment }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error creating review');
    }

    return res.json();
}
