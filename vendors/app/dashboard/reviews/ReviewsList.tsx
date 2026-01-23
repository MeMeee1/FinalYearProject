'use client';

import { useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { replyToReview } from '@/api/reviews';
import { Star, MessageCircle, Reply, ChevronRight, Send, X } from 'lucide-react';

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
            window.location.reload(); // Simple sync
        } catch (e) {
            alert('Failed to send reply');
        } finally {
            setLoading(false);
        }
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="bg-card rounded-[2.5rem] border border-border py-24 flex flex-col items-center justify-center text-center px-6">
                <div className="w-24 h-24 bg-secondary rounded-[2.5rem] flex items-center justify-center mb-6">
                    <MessageCircle className="w-10 h-10 text-muted-foreground opacity-20" />
                </div>
                <Text className="text-xl font-black text-foreground mb-1">Silence is Golden</Text>
                <Text className="text-sm text-muted-foreground font-medium max-w-xs">You haven't received any reviews yet. Great listings naturally attract feedback!</Text>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 pb-12">
            {reviews.map((review) => (
                <div key={review.id} className="bg-card rounded-[2.5rem] border border-border overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 group">
                    <div className="p-8 md:p-10 space-y-6">
                        <div className="flex flex-col md:flex-row justify-between gap-6 md:items-center">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-0.5 bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3 h-3 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground opacity-20'}`}
                                        />
                                    ))}
                                    <Text className="text-[10px] font-black text-primary ml-1.5">{review.rating.toFixed(1)}</Text>
                                </div>
                                <Text className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60">
                                    {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </Text>
                            </div>

                            <div className="flex items-center gap-3 bg-secondary/30 px-4 py-2 rounded-2xl border border-border/50 max-w-fit">
                                {review.productImage && (
                                    <img
                                        src={review.productImage.startsWith('[') ? JSON.parse(review.productImage)[0] : review.productImage}
                                        alt={review.productName}
                                        className="w-8 h-8 rounded-lg object-cover ring-2 ring-background shadow-sm"
                                    />
                                )}
                                <div>
                                    <Text className="text-[10px] font-black text-foreground truncate max-w-[120px] uppercase tracking-tighter">{review.productName}</Text>
                                    <Text className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest opacity-50">Ref: #{review.productId}</Text>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Text className="text-lg font-bold text-foreground leading-relaxed italic">
                                "{review.comment}"
                            </Text>
                            <Text className="text-xs font-black text-muted-foreground uppercase tracking-tighter">— Buyer ID: {review.userId}</Text>
                        </div>

                        {/* Reply Section */}
                        {review.vendorReply ? (
                            <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 relative overflow-hidden group/reply animate-in slide-in-from-left-2 transition-all">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Reply className="w-16 h-16 text-primary" />
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                                        <Reply className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                    <Text className="text-xs font-black text-primary uppercase tracking-widest">Store Official Response</Text>
                                </div>
                                <Text className="text-sm font-medium text-foreground/80 leading-relaxed mb-3">{review.vendorReply}</Text>
                                <Text className="text-[10px] text-primary/60 font-black uppercase">
                                    Replied on {new Date(review.replyDate).toLocaleDateString()}
                                </Text>
                            </div>
                        ) : (
                            <div className="pt-2">
                                {replyingId === review.id ? (
                                    <div className="bg-secondary/30 p-8 rounded-[2rem] border border-border animate-in zoom-in-95 duration-200">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                                    <Send className="w-5 h-5 text-primary" />
                                                </div>
                                                <Text className="text-sm font-black text-foreground uppercase tracking-widest">Craft a Response</Text>
                                            </div>
                                            <button onClick={() => setReplyingId(null)} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <textarea
                                            className="w-full p-6 bg-card border border-border rounded-3xl text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none mb-6 outline-none"
                                            rows={3}
                                            placeholder="Example: Thank you for the positive feedback! We hope to serve you again soon..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                        />
                                        <div className="flex justify-end pr-2">
                                            <button
                                                onClick={() => handleReply(review.id)}
                                                disabled={loading || !replyText.trim()}
                                                className="px-10 py-3.5 bg-primary text-primary-foreground rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                                            >
                                                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                {loading ? 'Transmitting...' : 'Post Response'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setReplyingId(review.id)}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary transition-all group-hover:bg-secondary/50 shadow-sm"
                                    >
                                        <Reply className="w-3.5 h-3.5" /> Acknowledge Review
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
