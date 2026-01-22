'use client';

import { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText, ButtonIcon, ButtonSpinner } from '@/components/ui/button';
import { SearchIcon, ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchProducts } from '@/lib/api';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

export default function AllProducts() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        total: 0,
        hasMore: false
    });

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const fetchProducts = async (currentPage = page, query = searchQuery) => {
        setLoading(true);
        try {
            const response = await searchProducts(query, 'All', 'newest', currentPage, 10);
            setProducts(response.data);
            setPagination(response.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchProducts(1, searchQuery);
    };

    return (
        <Box className="flex-1 min-h-screen bg-background text-foreground">
            {/* Header */}
            <Box className="bg-background px-6 py-4 shadow-sm z-20 sticky top-0 border-b border-border">
                <HStack className="items-center space-x-4 mb-4">
                    <Button variant="link" className="p-2 -ml-2 rounded-full hover:bg-secondary" onPress={() => router.back()}>
                        <ButtonIcon as={ArrowLeftIcon} className="text-foreground w-6 h-6" />
                    </Button>
                    <Heading size="xl" className="font-extrabold text-foreground">Marketplace</Heading>
                </HStack>

                <HStack space="sm" className="mb-2">
                    <Input size="xl" className="flex-1 bg-secondary border-0 rounded-full h-12 focus:bg-muted shadow-inner">
                        <InputSlot className="pl-4">
                            <InputIcon as={SearchIcon} className="text-muted-foreground" />
                        </InputSlot>
                        <InputField
                            placeholder="Search products..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            className="text-foreground font-medium placeholder:text-muted-foreground"
                        />
                    </Input>
                </HStack>
            </Box>

            <Box className="p-4 px-6 bg-background flex-1 min-h-[500px]">
                {loading ? (
                    <Box className="flex-1 justify-center items-center py-20">
                        <ButtonSpinner size="large" color="hsl(var(--primary))" />
                    </Box>
                ) : (
                    <Box className="pb-20">
                        <HStack className="justify-between items-center mb-6">
                            <Text className="text-muted-foreground font-medium text-sm">{pagination.total} items found</Text>
                            <Text className="text-muted-foreground font-medium text-sm">Page {page} of {pagination.totalPages}</Text>
                        </HStack>

                        <Box className="grid grid-cols-2 gap-4 sm:gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </Box>

                        {products.length === 0 && (
                            <Box className="col-span-2 py-20 items-center justify-center flex-1">
                                <Box className="w-20 h-20 bg-muted rounded-full items-center justify-center mb-4">
                                    <SearchIcon size={32} className="text-muted-foreground" />
                                </Box>
                                <Heading className="text-foreground text-lg mb-2">No products found</Heading>
                                <Button className="mt-6 rounded-full bg-primary" onPress={() => {
                                    setSearchQuery('');
                                    setPage(1);
                                    fetchProducts(1, '');
                                }}>
                                    <ButtonText className="text-primary-foreground font-bold">Clear Search</ButtonText>
                                </Button>
                            </Box>
                        )}

                        {/* Pagination Controls */}
                        {pagination.totalPages > 1 && (
                            <HStack className="justify-center items-center space-x-4 mt-12 mb-8">
                                <Button
                                    variant="outline"
                                    className="rounded-full border-border bg-secondary h-12 w-12 p-0 items-center justify-center"
                                    disabled={page === 1}
                                    onPress={() => setPage(page - 1)}
                                >
                                    <ButtonIcon as={ChevronLeftIcon} className={page === 1 ? "text-muted-foreground" : "text-foreground"} />
                                </Button>

                                <Box className="bg-primary px-4 py-2 rounded-full">
                                    <Text className="text-primary-foreground font-bold">{page}</Text>
                                </Box>

                                <Button
                                    variant="outline"
                                    className="rounded-full border-border bg-secondary h-12 w-12 p-0 items-center justify-center"
                                    disabled={!pagination.hasMore}
                                    onPress={() => setPage(page + 1)}
                                >
                                    <ButtonIcon as={ChevronRightIcon} className={!pagination.hasMore ? "text-muted-foreground" : "text-foreground"} />
                                </Button>
                            </HStack>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
