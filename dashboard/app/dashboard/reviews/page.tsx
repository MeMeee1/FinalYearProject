
import { fetchAllReviews } from '@/api/reviews';
import AdminReviewsList from './AdminReviewsList';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default async function AdminReviewsPage() {
    let reviews = [];
    try {
        reviews = await fetchAllReviews();
    } catch (e) {
        console.error(e);
    }

    return (
        <div className="max-w-5xl mx-auto py-6">
            <div className="mb-6">
                <Heading size="xl" className="mb-2">Platform Reviews</Heading>
                <Text className="text-gray-500">Moderate all product reviews across the platform</Text>
            </div>

            <AdminReviewsList reviews={reviews} />
        </div>
    );
}
