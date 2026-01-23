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
            <Box className="cursor-pointer group flex-1 transition-all duration-500 hover:-translate-y-2">
                <Card size="md" variant="elevated" className="p-0 overflow-hidden h-full border border-border/40 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-card rounded-[2rem]">
                    <Box className="relative h-56 w-full bg-secondary/30 overflow-hidden">
                        <Image
                            source={{ uri: product.image || 'https://placehold.co/400' }}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        {/* Status/Tag Badge */}
                        <Box className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                            <Text className="text-primary text-[9px] uppercase font-black tracking-[0.2em]">{product.productTags || 'Local'}</Text>
                        </Box>

                        {/* Overlay Gradient */}
                        <Box className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Box>

                    <VStack className="p-6 justify-between flex-1 space-y-4">
                        <Box className="space-y-1">
                            <HStack className="items-center space-x-1.5">
                                <Box className="w-1 h-1 rounded-full bg-primary" />
                                <Text className="text-[10px] text-muted-foreground font-black mb-1 tracking-[0.15em] uppercase">{product.vendor?.storeName}</Text>
                            </HStack>
                            <Heading size="md" className="font-black text-foreground line-clamp-2 leading-[1.1] tracking-tight group-hover:text-primary transition-colors duration-300">{product.name}</Heading>
                        </Box>

                        <HStack className="justify-between items-center pt-4 border-t border-border/50">
                            <VStack>
                                <Text className="text-muted-foreground text-[9px] font-black uppercase tracking-widest">Pricing</Text>
                                <Text className="text-foreground font-black text-xl tracking-tighter">₦{product.price.toLocaleString()}</Text>
                            </VStack>
                            <Box className="rounded-2xl w-12 h-12 bg-secondary group-hover:bg-primary transition-all duration-500 flex items-center justify-center shadow-lg group-active:scale-90 overflow-hidden relative">
                                <Box className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <Text className="text-primary group-hover:text-primary-foreground font-black text-2xl relative z-10 transition-colors">+</Text>
                            </Box>
                        </HStack>
                    </VStack>
                </Card>
            </Box>
        </Link>
    );
}
