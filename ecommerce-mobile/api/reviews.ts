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
