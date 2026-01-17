
import { fetchVendorReviews } from '@/api/reviews';
import ReviewsList from './ReviewsList';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default async function ReviewsPage() {
    let reviews = [];
    try {
        reviews = await fetchVendorReviews();
    } catch (e) {
        console.error(e);
    }

    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="mb-6">
                <Heading size="xl" className="mb-2">Product Reviews</Heading>
                <Text className="text-gray-500">Manage customer feedback and respond to reviews</Text>
            </div>

            <ReviewsList reviews={reviews} />
        </div>
    );
}
