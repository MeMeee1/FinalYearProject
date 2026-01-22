import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Product } from '@/lib/types';
import Link from 'next/link';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/product/${product.id}`} passHref legacyBehavior>
            <Box className="cursor-pointer group flex-1 transition-all duration-300 hover:-translate-y-1">
                <Card size="md" variant="elevated" className="p-0 overflow-hidden h-full border border-border shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 bg-card rounded-2xl">
                    <Box className="relative h-48 w-full bg-muted overflow-hidden">
                        <Image
                            source={{ uri: product.image || 'https://placehold.co/400' }}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        />
                        {/* Tag Badge */}
                        {product.productTags && (
                            <Box className="absolute top-3 left-3 bg-background/60 backdrop-blur-md px-3 py-1 rounded-full border border-border/10">
                                <Text className="text-primary text-[10px] uppercase font-bold tracking-wider">{product.productTags}</Text>
                            </Box>
                        )}
                        {/* Overlay Gradient on hover */}
                        <Box className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </Box>
                    <VStack className="p-4 justify-between flex-1 space-y-3">
                        <Box>
                            <Text className="text-xs text-muted-foreground font-medium mb-1 tracking-wide uppercase">{product.vendor?.storeName}</Text>
                            <Heading size="sm" className="font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">{product.name}</Heading>
                        </Box>
                        <HStack className="justify-between items-center pt-2 border-t border-border">
                            <Text className="text-foreground font-extrabold text-lg">₦{product.price.toLocaleString()}</Text>
                            <Box className="rounded-full w-8 h-8 bg-muted group-hover:bg-primary transition-colors flex items-center justify-center">
                                <Text className="text-primary group-hover:text-primary-foreground font-bold text-lg transition-colors">+</Text>
                            </Box>
                        </HStack>
                    </VStack>
                </Card>
            </Box>
        </Link>
    );
}
