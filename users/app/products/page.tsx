'use client';

import { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText, ButtonIcon, ButtonSpinner } from '@/components/ui/button';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '@/components/ui/select';
import { SearchIcon, ArrowLeftIcon, FilterIcon, ChevronDownIcon, SlidersHorizontal, MapPinIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchProducts, getProductCategories, getUserProfile } from '@/lib/api';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

export default function AllProducts() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [activeCategory, setActiveCategory] = useState('All');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [loading, setLoading] = useState(true);

    // Filters
    const [userLga, setUserLga] = useState('Abuja');
    const [lgaFilter, setLgaFilter] = useState('All');
    const [sortOption, setSortOption] = useState('newest');

    useEffect(() => {
        getProductCategories().then(cats => {
            setCategories(['All', ...cats]);
        }).catch(err => console.error(err));

        getUserProfile().then((user: any) => {
            if (user && user.lga) {
                setUserLga(user.lga);
                setLgaFilter(user.lga);
            }
        }).catch(() => { });
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [activeCategory, lgaFilter, sortOption]);

    const fetchProducts = async (query = searchQuery) => {
        setLoading(true);
        try {
            const results = await searchProducts(query, lgaFilter, sortOption);
            setProducts(results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchProducts(searchQuery);
    };

    const filteredProducts = activeCategory === 'All'
        ? products
        : products.filter(p => p.productTags === activeCategory || (p as any).category === activeCategory);

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

                <HStack space="sm" className="mb-4">
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
                    <Box className="w-12 h-12 bg-primary rounded-full items-center justify-center shadow-lg">
                        <SlidersHorizontal size={20} color="white" />
                    </Box>
                </HStack>

                <HStack space="md" className="justify-between items-center">
                    {/* Sort Select */}
                    <Box className="flex-1">
                        <Select onValueChange={setSortOption} selectedValue={sortOption}>
                            <SelectTrigger variant="outline" size="md" className="rounded-full justify-between border-border bg-secondary shadow-sm h-10">
                                <SelectInput placeholder="Sort By" className="text-xs font-semibold text-foreground/70" />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent className="bg-popover border-border">
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator className="bg-muted-foreground/30" />
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem label="Newest Arrivals" value="newest" className="hover:bg-accent text-popover-foreground" />
                                    <SelectItem label="Price: Low to High" value="price_asc" className="hover:bg-accent text-popover-foreground" />
                                    <SelectItem label="Price: High to Low" value="price_desc" className="hover:bg-accent text-popover-foreground" />
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </Box>

                    {/* LGA Filter Toggle */}
                    <Button
                        variant={lgaFilter === 'All' ? 'outline' : 'solid'}
                        action={lgaFilter === 'All' ? 'secondary' : 'primary'}
                        className={`flex-1 rounded-full h-10 ${lgaFilter !== 'All' ? 'bg-primary border-0' : 'bg-secondary border-border'}`}
                        onPress={() => setLgaFilter(lgaFilter === 'All' ? userLga : 'All')}
                    >
                        <ButtonIcon as={MapPinIcon} className={lgaFilter !== 'All' ? 'text-primary-foreground mr-2 w-4 h-4' : 'text-muted-foreground mr-2 w-4 h-4'} />
                        <ButtonText className={`text-xs font-bold ${lgaFilter !== 'All' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                            {lgaFilter === 'All' ? 'All Locations' : userLga}
                        </ButtonText>
                    </Button>
                </HStack>
            </Box>

            {/* Category Tabs */}
            <Box className="bg-background border-b border-border pb-2">
                <HStack space="sm" className="overflow-x-auto px-6 py-2 scrollbar-hide">
                    {categories.map((cat, index) => (
                        <Button
                            key={`${cat}-${index}`}
                            size="xs"
                            onPress={() => setActiveCategory(cat)}
                            className={`rounded-full px-5 h-8 border ${activeCategory === cat ? 'bg-primary border-primary shadow-sm' : 'bg-secondary border-transparent hover:bg-muted'}`}
                        >
                            <ButtonText className={`font-semibold text-xs ${activeCategory === cat ? 'text-primary-foreground' : 'text-foreground'}`}>{cat}</ButtonText>
                        </Button>
                    ))}
                </HStack>
            </Box>

            <Box className="p-4 px-6 bg-background flex-1 min-h-[500px]">
                {loading ? (
                    <Box className="flex-1 justify-center items-center py-20">
                        <ButtonSpinner size="large" color="hsl(var(--primary))" />
                    </Box>
                ) : (
                    <Box className="pb-20">
                        <HStack className="justify-between items-center mb-4">
                            <Text className="text-muted-foreground font-medium text-sm">{filteredProducts.length} items found</Text>
                        </HStack>

                        <Box className="grid grid-cols-2 gap-4 sm:gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </Box>

                        {filteredProducts.length === 0 && (
                            <Box className="col-span-2 py-20 items-center justify-center flex-1">
                                <Box className="w-20 h-20 bg-muted rounded-full items-center justify-center mb-4">
                                    <SearchIcon size={32} className="text-muted-foreground" />
                                </Box>
                                <Heading className="text-foreground text-lg mb-2">No products found</Heading>
                                <Text className="text-muted-foreground text-center max-w-xs">Try adjusting your search terms or filters to find what you're looking for.</Text>
                                <Button className="mt-6 rounded-full bg-primary" onPress={() => {
                                    setSearchQuery('');
                                    setLgaFilter('All');
                                    setActiveCategory('All');
                                    fetchProducts('');
                                }}>
                                    <ButtonText className="text-primary-foreground font-bold">Clear Filters</ButtonText>
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
