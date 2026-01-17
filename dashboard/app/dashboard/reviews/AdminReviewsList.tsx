
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Trash2, Star, MessageCircle, Store } from 'lucide-react';
import { deleteReview } from '@/api/reviews';
import { Button } from '@/components/ui/button';

export default function AdminReviewsList({ reviews }: { reviews: any[] }) {
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handleDelete = async (reviewId: number) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        setLoadingId(reviewId);
        try {
            await deleteReview(reviewId);
            // Let revalidatePath handle refresh
        } catch (e) {
            alert('Failed to delete review');
        } finally {
            setLoadingId(null);
        }
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-10">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <Heading className="text-gray-500">No reviews found</Heading>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <Card key={review.id} className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                                        />
                                    ))}
                                </div>
                                <Text className="text-sm text-gray-500">• {new Date(review.createdAt).toLocaleDateString()}</Text>
                            </div>

                            <Text className="font-semibold mb-1">{review.productName}</Text>
                            <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                                <Store className="w-4 h-4" />
                                <span>{review.storeName}</span>
                            </div>

                            <Text className="text-gray-700 mb-2">{review.comment}</Text>

                            {review.vendorReply && (
                                <div className="ml-4 pl-4 border-l-2 border-blue-200 bg-gray-50 p-2 text-sm text-gray-600">
                                    <span className="font-semibold text-blue-800">Vendor Reply: </span>
                                    {review.vendorReply}
                                </div>
                            )}
                        </div>

                        <div>
                            <Button
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 border-red-200"
                                onPress={() => handleDelete(review.id)}
                                disabled={loadingId === review.id}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {loadingId === review.id ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
