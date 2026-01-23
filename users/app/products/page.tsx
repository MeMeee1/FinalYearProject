'use client';

import { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText, ButtonIcon, ButtonSpinner } from '@/components/ui/button';
import { SearchIcon, ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, FilterIcon, SlidersHorizontalIcon } from 'lucide-react-native';
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
        <Box className="flex-1 min-h-screen bg-background pb-32">
            {/* Premium Sticky Header */}
            <Box className="bg-background/80 backdrop-blur-3xl px-6 pt-12 pb-6 border-b border-border/40 sticky top-0 z-[100]">
                <VStack space="lg">
                    <HStack className="items-center justify-between">
                        <HStack space="md" className="items-center">
                            <Button
                                variant="solid"
                                className="rounded-xl bg-secondary/50 border border-border/40 w-10 h-10 p-0 items-center justify-center hover:bg-secondary/80 transition-all active:scale-95"
                                onPress={() => router.back()}
                            >
                                <ArrowLeftIcon size={20} color="hsl(var(--foreground))" />
                            </Button>
                            <VStack>
                                <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] leading-none mb-1">Marketplace Pipeline</Text>
                                <Heading size="lg" className="text-foreground font-black tracking-tighter">Global Inventory</Heading>
                            </VStack>
                        </HStack>
                        <Box className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                            <Text className="text-primary font-black text-[10px] uppercase tracking-widest">{pagination.total} Units</Text>
                        </Box>
                    </HStack>

                    <HStack space="sm">
                        <Input size="xl" className="flex-1 bg-secondary/40 border-border/40 rounded-2xl h-14 px-4 focus:bg-secondary/60 transition-all">
                            <InputSlot className="mr-3">
                                <SearchIcon size={20} color="hsl(var(--muted-foreground))" />
                            </InputSlot>
                            <InputField
                                placeholder="Scan inventory..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={handleSearch}
                                className="text-foreground font-bold placeholder:text-muted-foreground/50"
                            />
                        </Input>
                    </HStack>

                    {/* Taxonomy Navigation */}
                    <HStack space="xs" className="overflow-x-auto pb-1 scrollbar-hide py-1">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                onPress={() => { setActiveCategory(cat); setPage(1); }}
                                className={`rounded-xl px-4 py-1.5 h-10 border transition-all ${activeCategory === cat ? 'bg-primary border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-card/40 border-border/40 hover:bg-card/60'}`}
                            >
                                <ButtonText className={`text-[10px] font-black uppercase tracking-widest ${activeCategory === cat ? 'text-black' : 'text-muted-foreground'}`}>
                                    {cat}
                                </ButtonText>
                            </Button>
                        ))}
                    </HStack>
                </VStack>
            </Box>

            {/* Processing Controls Layer */}
            <Box className="bg-secondary/10 px-6 py-4 border-b border-border/30">
                <HStack className="justify-between items-center">
                    <HStack space="md" className="items-center">
                        <SlidersHorizontalIcon size={14} color="hsl(var(--muted-foreground))" />
                        <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Sort Protocol</Text>
                    </HStack>
                    <HStack space="sm">
                        {[
                            { id: 'newest', label: 'Recent' },
                            { id: 'price-low', label: 'Val: Low' },
                            { id: 'price-high', label: 'Val: High' }
                        ].map((s) => (
                            <Button
                                key={s.id}
                                variant="link"
                                className="px-2"
                                onPress={() => { setActiveSort(s.id); setPage(1); }}
                            >
                                <ButtonText className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeSort === s.id ? 'text-primary' : 'text-muted-foreground/40 hover:text-muted-foreground'}`}>
                                    {s.label}
                                </ButtonText>
                            </Button>
                        ))}
                    </HStack>
                </HStack>
            </Box>

            {/* Inventory Grid */}
            <Box className="p-6 max-w-7xl mx-auto flex-1">
                {loading ? (
                    <Box className="flex-1 justify-center items-center py-32">
                        <VStack space="xl" className="items-center">
                            <Box className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center border border-primary/20 animate-pulse">
                                <SearchIcon size={32} color="hsl(var(--primary))" />
                            </Box>
                            <Text className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px]">Scanning Active Nodes...</Text>
                        </VStack>
                    </Box>
                ) : (
                    <VStack space="2xl">
                        {products.length > 0 ? (
                            <>
                                <Box className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </Box>

                                {/* Pagination Controls */}
                                {pagination.totalPages > 1 && (
                                    <HStack className="justify-center items-center space-x-4 mt-12 mb-8">
                                        <Button
                                            variant="solid"
                                            className="rounded-2xl bg-card border border-border/40 h-14 w-14 p-0 items-center justify-center hover:bg-secondary/40 active:scale-90 transition-all disabled:opacity-20"
                                            disabled={page === 1}
                                            onPress={() => setPage(page - 1)}
                                        >
                                            <ChevronLeftIcon size={24} color="hsl(var(--foreground))" />
                                        </Button>

                                        <Box className="bg-primary/10 border border-primary/20 px-8 py-3 rounded-2xl">
                                            <Text className="text-primary font-black text-sm uppercase tracking-widest">{page} / {pagination.totalPages}</Text>
                                        </Box>

                                        <Button
                                            variant="solid"
                                            className="rounded-2xl bg-card border border-border/40 h-14 w-14 p-0 items-center justify-center hover:bg-secondary/40 active:scale-90 transition-all disabled:opacity-20"
                                            disabled={!pagination.hasMore}
                                            onPress={() => setPage(page + 1)}
                                        >
                                            <ChevronRightIcon size={24} color="hsl(var(--foreground))" />
                                        </Button>
                                    </HStack>
                                )}
                            </>
                        ) : (
                            <Box className="py-32 items-center justify-center">
                                <VStack space="2xl" className="items-center">
                                    <Box className="w-32 h-32 bg-secondary/20 rounded-[3rem] items-center justify-center border border-border/30">
                                        <SearchIcon size={48} color="hsl(var(--muted-foreground))" strokeWidth={1} />
                                    </Box>
                                    <VStack className="items-center" space="xs">
                                        <Heading className="text-foreground font-black tracking-tight text-center">Null Result Detected</Heading>
                                        <Text className="text-muted-foreground text-center font-medium max-w-[280px]">No active inventory units match your current filter parameters or search query.</Text>
                                    </VStack>
                                    <Button className="mt-4 rounded-2xl bg-primary px-8 h-16 shadow-xl shadow-primary/20" onPress={() => {
                                        setSearchQuery('');
                                        setActiveCategory('All');
                                        setPage(1);
                                    }}>
                                        <ButtonText className="text-black font-black uppercase tracking-widest text-sm">Reset Protocol</ButtonText>
                                    </Button>
                                </VStack>
                            </Box>
                        )}
                    </VStack>
                )}
            </Box>
        </Box>
    );
}
