'use client';

import { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText, ButtonIcon, ButtonSpinner } from '@/components/ui/button';
import { SearchIcon, ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, FilterIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchProducts, getProductCategories } from '@/lib/api';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

export default function AllProducts() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const initialCategory = searchParams.get('category') || 'All';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [activeSort, setActiveSort] = useState('newest');
    const [categories, setCategories] = useState<string[]>(['All']);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        total: 0,
        hasMore: false
    });

    useEffect(() => {
        getProductCategories().then(cats => setCategories(['All', ...cats]));
    }, []);

    useEffect(() => {
        fetchProducts(page, searchQuery, activeCategory, activeSort);
    }, [page, activeCategory, activeSort]);

    const fetchProducts = async (currentPage = page, query = searchQuery, category = activeCategory, sort = activeSort) => {
        setLoading(true);
        try {
            const response = await searchProducts(query, category, sort, currentPage, 10);
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
        fetchProducts(1, searchQuery, activeCategory, activeSort);
    };

    return (
        <Box className="flex-1 min-h-screen bg-background text-foreground">
            {/* Header */}
            <Box className="bg-background px-6 py-4 z-20 sticky top-0 border-b border-border shadow-sm">
                <HStack className="items-center space-x-4 mb-4">
                    <Button variant="link" className="p-2 -ml-2 rounded-full hover:bg-secondary" onPress={() => router.back()}>
                        <ButtonIcon as={ArrowLeftIcon} className="text-foreground w-6 h-6" />
                    </Button>
                    <Heading size="xl" className="font-extrabold text-foreground">Shopping Market</Heading>
                </HStack>

                <HStack space="sm" className="mb-4">
                    <Input size="xl" className="flex-1 bg-secondary border-0 rounded-full h-12 focus:bg-muted shadow-inner">
                        <InputSlot className="pl-4">
                            <InputIcon as={SearchIcon} className="text-muted-foreground" />
                        </InputSlot>
                        <InputField
                            placeholder="Find products..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            className="text-foreground font-medium placeholder:text-muted-foreground"
                        />
                    </Input>
                </HStack>

                {/* Filter Chips Layer */}
                <HStack space="xs" className="overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            onPress={() => { setActiveCategory(cat); setPage(1); }}
                            className={`rounded-full px-5 py-1.5 h-9 border ${activeCategory === cat ? 'bg-primary border-primary' : 'bg-secondary border-transparent'}`}
                        >
                            <ButtonText className={`text-xs font-bold ${activeCategory === cat ? 'text-primary-foreground' : 'text-foreground'}`}>
                                {cat}
                            </ButtonText>
                        </Button>
                    ))}
                </HStack>
            </Box>

            {/* Sorting Layer */}
            <Box className="bg-secondary/30 px-6 py-3 border-b border-border">
                <HStack className="justify-between items-center">
                    <HStack space="md" className="items-center">
                        <FilterIcon size={14} className="text-muted-foreground" />
                        <Text className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sort By:</Text>
                    </HStack>
                    <HStack space="sm">
                        {[
                            { id: 'newest', label: 'Recent' },
                            { id: 'price-low', label: 'Price: Low' },
                            { id: 'price-high', label: 'Price: High' }
                        ].map((s) => (
                            <Button
                                key={s.id}
                                size="xs"
                                variant="link"
                                className="px-1"
                                onPress={() => { setActiveSort(s.id); setPage(1); }}
                            >
                                <ButtonText className={`text-xs font-black uppercase ${activeSort === s.id ? 'text-primary' : 'text-muted-foreground/60'}`}>
                                    {s.label}
                                </ButtonText>
                            </Button>
                        ))}
                    </HStack>
                </HStack>
            </Box>

            <Box className="p-4 px-6 bg-background flex-1 min-h-[500px]">
                {loading ? (
                    <Box className="flex-1 justify-center items-center py-20">
                        <ButtonSpinner size="large" color="hsl(var(--primary))" />
                        <Text className="text-muted-foreground font-bold mt-4 uppercase tracking-[0.2em] text-[10px]">Scanning Pipeline...</Text>
                    </Box>
                ) : (
                    <Box className="pb-20">
                        <HStack className="justify-between items-center mb-6">
                            <Text className="text-muted-foreground font-bold text-xs uppercase tracking-tighter">{pagination.total} Deliverables Matched</Text>
                            <Text className="text-muted-foreground font-bold text-xs">Vector {page}/{pagination.totalPages}</Text>
                        </HStack>

                        <Box className="grid grid-cols-2 gap-4 sm:gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </Box>

                        {products.length === 0 && (
                            <Box className="col-span-2 py-20 items-center justify-center flex-1">
                                <Box className="w-20 h-20 bg-secondary rounded-[2rem] items-center justify-center mb-6">
                                    <SearchIcon size={32} className="text-muted-foreground opacity-30" />
                                </Box>
                                <Heading className="text-foreground text-lg font-black mb-2 uppercase tracking-tight">Zero Results</Heading>
                                <Text className="text-muted-foreground text-center font-medium max-w-[240px]">We couldn't find items matching these parameters.</Text>
                                <Button className="mt-8 rounded-full bg-primary px-8 h-12 shadow-lg shadow-primary/20" onPress={() => {
                                    setSearchQuery('');
                                    setActiveCategory('All');
                                    setPage(1);
                                }}>
                                    <ButtonText className="text-primary-foreground font-black uppercase tracking-widest text-xs">Reset Environment</ButtonText>
                                </Button>
                            </Box>
                        )}

                        {/* Pagination Controls */}
                        {pagination.totalPages > 1 && (
                            <HStack className="justify-center items-center space-x-6 mt-12 mb-8">
                                <Button
                                    variant="outline"
                                    className="rounded-2xl border-border bg-secondary h-12 w-12 p-0 items-center justify-center active:scale-90 transition-transform"
                                    disabled={page === 1}
                                    onPress={() => setPage(page - 1)}
                                >
                                    <ButtonIcon as={ChevronLeftIcon} className={page === 1 ? "text-muted-foreground/30" : "text-foreground"} />
                                </Button>

                                <Box className="bg-primary/10 border border-primary/20 px-6 py-2 rounded-2xl">
                                    <Text className="text-primary font-black">{page}</Text>
                                </Box>

                                <Button
                                    variant="outline"
                                    className="rounded-2xl border-border bg-secondary h-12 w-12 p-0 items-center justify-center active:scale-90 transition-transform"
                                    disabled={!pagination.hasMore}
                                    onPress={() => setPage(page + 1)}
                                >
                                    <ButtonIcon as={ChevronRightIcon} className={!pagination.hasMore ? "text-muted-foreground/30" : "text-foreground"} />
                                </Button>
                            </HStack>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
