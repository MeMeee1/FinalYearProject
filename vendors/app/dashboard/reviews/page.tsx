import { fetchVendorReviews } from '@/api/reviews';
import ReviewsList from './ReviewsList';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Star, MessageCircle } from 'lucide-react';

export default async function ReviewsPage() {
    let reviews = [];
    try {
        reviews = await fetchVendorReviews();
    } catch (e) {
        console.error(e);
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Star className="w-4 h-4 text-primary" />
                        </div>
                        <Text className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Customer Voice</Text>
                    </div>
                    <Heading className="text-3xl font-black tracking-tight text-foreground">Product Feedback</Heading>
                    <Text className="text-muted-foreground font-medium">Build trust by engaging with your buyers.</Text>
                </div>
            </div>

            <ReviewsList reviews={reviews} />
        </div>
    );
}
