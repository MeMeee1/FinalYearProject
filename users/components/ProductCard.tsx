import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';

import { Product } from '@/lib/types';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from './ui/button';
import { PlusIcon } from 'lucide-react-native';
import { reduceStock } from '@/lib/api';
import { useState, useCallback } from 'react';
import { useStockSync } from '@/hooks/useStockSync';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const [localStock, setLocalStock] = useState(product.stock);

    const handleSyncUpdate = useCallback((data: { productId: number, newStock: number }) => {
        if (data.productId === product.id) {
            setLocalStock(data.newStock);
        }
    }, [product.id]);

    useStockSync(handleSyncUpdate);

    const handleQuickAdd = async (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        if (localStock <= 0) {
            alert('Out of stock!');
            return;
        }

        try {
            // First update UI/Context
            addToCart(product, 1);

            // Reduce stock in DB
            await reduceStock(product.id, 1);

            // Update local stock display
            setLocalStock(prev => prev - 1);
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Node synchronization failed.');
        }
    };

    return (
        <Link href={`/product/${product.id}`} passHref legacyBehavior>
            <Box className="cursor-pointer group flex-1 transition-all duration-500 hover:-translate-y-2">
                <Card size="md" variant="elevated" className="p-0 overflow-hidden h-full border border-border/40 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-card rounded-xl sm:rounded-[1.5rem] md:rounded-[2rem]">
                    <Box className="relative h-36 sm:h-44 md:h-56 w-full bg-secondary/30 overflow-hidden">
                        <img
                            src={
                                product.image
                                    ? product.image.startsWith('http')
                                        ? product.image
                                        : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '')}${product.image.startsWith('/') ? '' : '/'}${product.image}`
                                    : 'https://placehold.co/400'
                            }
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/400';
                            }}
                        />
                        {/* Status/Tag Badge */}
                        <Box className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                            <Text className="text-primary text-[9px] uppercase font-black tracking-[0.2em]">{product.productTags || 'Local'}</Text>
                        </Box>

                        {/* Overlay Gradient */}
                        <Box className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Box>

                    <VStack className="p-3 sm:p-4 md:p-6 justify-between flex-1 space-y-2 sm:space-y-3 md:space-y-4">
                        <Box className="space-y-1">
                            <HStack className="items-center space-x-1.5">
                                <Box className="w-1 h-1 rounded-full bg-primary" />
                                <Text className="text-[10px] text-muted-foreground font-black mb-1 tracking-[0.15em] uppercase">{product.vendor?.storeName}</Text>
                            </HStack>
                            <Heading className="text-sm sm:text-base md:text-lg font-black text-foreground line-clamp-2 leading-[1.1] tracking-tight group-hover:text-primary transition-colors duration-300">{product.name}</Heading>
                        </Box>

                        <HStack className="justify-between items-center pt-2 sm:pt-3 md:pt-4 border-t border-border/50">
                            <VStack>
                                <Text className="text-muted-foreground text-[8px] sm:text-[9px] font-black uppercase tracking-widest">Stock: {localStock}</Text>
                                <Text className="text-foreground font-black text-sm sm:text-base md:text-xl tracking-tighter">₦{product.price.toLocaleString()}</Text>
                            </VStack>
                            <Button
                                variant="link"
                                onPress={handleQuickAdd}
                                className="rounded-lg sm:rounded-xl md:rounded-2xl w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-secondary group-hover:bg-primary transition-all duration-500 flex items-center justify-center shadow-lg group-active:scale-90 overflow-hidden p-0"
                            >
                                <Box className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <PlusIcon size={20} color="hsl(var(--primary))" className="group-hover:text-black transition-colors" />
                            </Button>
                        </HStack>
                    </VStack>
                </Card>
            </Box>
        </Link>
    );
}
