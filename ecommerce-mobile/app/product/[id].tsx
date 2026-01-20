import { Stack, useLocalSearchParams } from 'expo-router';
import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/api/products';
import { listProductReviews } from '@/api/reviews';
import { ActivityIndicator, ScrollView, FlatList } from 'react-native';
import { useCart } from '@/store/cartStore';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const addProduct = useCart((state) => state.addProduct);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', id],
    queryFn: () => fetchProductById(Number(id)),
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => listProductReviews(Number(id)),
    enabled: !!id,
  });

  const addToCart = () => {
    if (product) {
      addProduct(product);
    }
  };

  if (isLoading) {
    return <ActivityIndicator className="flex-1" />;
  }

  if (error || !product) {
    return <Text>Product not found!</Text>;
  }

  const getImages = (imageString: string | null) => {
    if (!imageString) return [];
    try {
      const parsed = JSON.parse(imageString);
      if (Array.isArray(parsed)) return parsed;
      return [imageString];
    } catch {
      return [imageString];
    }
  };

  const images = getImages(product.image);
  const mainImage = images.length > 0 ? images[0] : 'https://via.placeholder.com/300';

  return (
    <Box className="flex-1 bg-white">
      <Stack.Screen options={{ title: product.name }} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card className="p-5 rounded-lg w-full mb-6">
          <Image
            source={{
              uri: mainImage,
            }}
            className="mb-6 h-[240px] w-full rounded-md"
            alt={`${product.name} image`}
            resizeMode="contain"
          />
          <Text className="text-sm font-normal mb-2 text-typography-700">
            {product.name}
          </Text>
          <VStack className="mb-6">
            <Heading size="md" className="mb-4">
              ${product.price}
            </Heading>
            <Text size="sm">{product.description}</Text>
          </VStack>

          {product.vendor && (
            <Box className="mb-4 p-3 bg-gray-50 rounded-md">
              <Text className="text-xs text-gray-500 uppercase font-bold">Sold By</Text>
              <Text className="text-sm font-semibold">{product.vendor.storeName}</Text>
            </Box>
          )}

          <Box className="flex-col sm:flex-row">
            <Button
              onPress={addToCart}
              className="px-4 py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 sm:flex-1"
            >
              <ButtonText size="sm">Add to cart</ButtonText>
            </Button>
            <Button
              variant="outline"
              className="px-4 py-2 border-outline-300 sm:flex-1"
            >
              <ButtonText size="sm" className="text-typography-600">
                Wishlist
              </ButtonText>
            </Button>
          </Box>
        </Card>

        <Heading size="lg" className="mb-4">Reviews</Heading>
        {reviews && reviews.length > 0 ? (
          <VStack space="md">
            {reviews.map((review) => (
              <Card key={review.id} className="p-4 bg-gray-50">
                <Box className="flex-row justify-between mb-2">
                  <Text className="font-bold text-yellow-600">{review.rating} / 5 Stars</Text>
                  <Text className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</Text>
                </Box>
                <Text className="text-gray-700">{review.comment}</Text>
                {review.vendorReply && (
                  <Box className="mt-3 pl-3 border-l-2 border-gray-300">
                    <Text className="text-xs font-bold text-gray-600 mb-1">Store Reply:</Text>
                    <Text className="text-sm text-gray-600 italic">{review.vendorReply}</Text>
                  </Box>
                )}
              </Card>
            ))}
          </VStack>
        ) : (
          <Text className="text-gray-500 italic">No reviews yet.</Text>
        )}
      </ScrollView>
    </Box>
  );
}
