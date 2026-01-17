
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { replyToReview } from '@/api/reviews';
import { Star, MessageCircle, Reply } from 'lucide-react';

export default function ReviewsList({ reviews }: { reviews: any[] }) {
    const [replyingId, setReplyingId] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReply = async (reviewId: number) => {
        if (!replyText.trim()) return;
        setLoading(true);
        try {
            await replyToReview(reviewId, replyText);
            setReplyingId(null);
            setReplyText('');
            // Ideally update the local state or let revalidatePath handle it
        } catch (e) {
            alert('Failed to send reply');
        } finally {
            setLoading(false);
        }
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-10">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <Heading className="text-gray-500">No reviews yet</Heading>
                <Text className="text-gray-400">Reviews for your products will appear here.</Text>
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
                            <Text className="text-gray-700 mb-4">{review.comment}</Text>

                            {/* Product Info (small) */}
                            <div className="flex items-center gap-2 mb-4">
                                {review.productImage && (
                                    <img src={JSON.parse(review.productImage)[0]} alt={review.productName} className="w-8 h-8 rounded object-cover" />
                                )}
                                <span className="text-xs text-gray-500">Product ID: {review.productId}</span>
                            </div>

                            {/* Vendor Reply Section */}
                            {review.vendorReply ? (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Reply className="w-4 h-4 text-blue-600" />
                                        <Text className="font-semibold text-blue-900 text-sm">Response from Store</Text>
                                    </div>
                                    <Text className="text-blue-800 text-sm">{review.vendorReply}</Text>
                                    <Text className="text-xs text-blue-500 mt-2">
                                        Replied on {new Date(review.replyDate).toLocaleDateString()}
                                    </Text>
                                </div>
                            ) : (
                                <div className="mt-2">
                                    {replyingId === review.id ? (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <Text className="font-medium text-sm mb-2">Reply to Customer</Text>
                                            <textarea
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                                rows={3}
                                                placeholder="Thank the customer for their review..."
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => setReplyingId(null)}
                                                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleReply(review.id)}
                                                    disabled={loading}
                                                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    {loading ? 'Sending...' : 'Post Reply'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setReplyingId(review.id)}
                                            className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                                        >
                                            <Reply className="w-4 h-4" /> Reply to Review
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
