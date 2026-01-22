import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Button, ButtonIcon } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react-native'; // Assuming PlusIcon is available or I'll use a text '+' if generic
import { Product } from '@/lib/types';
import Link from 'next/link';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/product/${product.id}`} passHref legacyBehavior>
            <Box className="cursor-pointer group flex-1">
                <Card size="md" variant="elevated" className="p-0 overflow-hidden h-full border-0 shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl">
                    <Box className="relative h-40 w-full bg-gray-100">
                        <Image
                            source={{ uri: product.image || 'https://placehold.co/400' }}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {/* Tag Badge */}
                        {product.productTags && (
                            <Box className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-md">
                                <Text className="text-white text-xs font-bold">{product.productTags}</Text>
                            </Box>
                        )}
                    </Box>
                    <VStack className="p-3 justify-between flex-1" space="xs">
                        <Box>
                            <Text className="text-xs text-gray-500 mb-1">{product.vendor?.storeName}</Text>
                            <Heading size="sm" className="font-semibold line-clamp-2 h-10">{product.name}</Heading>
                        </Box>
                        <HStack className="justify-between items-center mt-2">
                            <Text className="text-primary-600 font-bold text-lg">₦{product.price.toLocaleString()}</Text>
                            <Box className="rounded-full w-8 h-8 bg-primary-50 flex items-center justify-center">
                                <Text className="text-primary-600 font-bold text-lg">+</Text>
                            </Box>
                        </HStack>
                    </VStack>
                </Card>
            </Box>
        </Link>
    );
}
