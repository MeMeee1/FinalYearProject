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
import { SearchIcon, ArrowLeftIcon, FilterIcon, ChevronDownIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { searchProducts, getProductCategories, getUserProfile } from '@/lib/api';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

export default function AllProducts() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [loading, setLoading] = useState(true);

    // Filters
    const [userLga, setUserLga] = useState('Abuja');
    const [lgaFilter, setLgaFilter] = useState('All'); // 'All' or userLga
    const [sortOption, setSortOption] = useState('newest');

    useEffect(() => {
        // Fetch categories
        getProductCategories().then(cats => {
            setCategories(['All', ...cats]);
        }).catch(err => console.error(err));

        // Fetch user profile to get LGA
        getUserProfile().then((user: any) => {
            if (user && user.lga) {
                setUserLga(user.lga);
                setLgaFilter(user.lga); // Default to user's LGA
            }
        }).catch(() => { });
    }, []);

    // Re-fetch when filters change
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
        <Box className="flex-1 min-h-screen bg-white">
            <Box className="bg-white p-6 shadow-sm z-10 sticky top-0">
                <HStack className="items-center mb-4 space-x-4">
                    <Button variant="link" className="p-0 mr-2" onPress={() => router.back()}>
                        <ButtonIcon as={ArrowLeftIcon} className="text-gray-900" />
                    </Button>
                    <Heading size="lg" className="font-bold flex-1">All Products</Heading>
                </HStack>

                <HStack space="sm" className="mb-4">
                    <Input variant="outline" size="md" className="flex-1 bg-gray-50 border-gray-200 rounded-xl">
                        <InputSlot className="pl-3">
                            <InputIcon as={SearchIcon} className="text-gray-400" />
                        </InputSlot>
                        <InputField
                            placeholder="Search..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                        />
                    </Input>
                </HStack>

                <HStack space="sm" className="mb-4 justify-between">
                    {/* Sort Select */}
                    <Box className="w-[48%]">
                        <Select onValueChange={setSortOption} selectedValue={sortOption}>
                            <SelectTrigger variant="outline" size="md" className="rounded-xl justify-between border-gray-200">
                                <SelectInput placeholder="Sort By" />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem label="Newest" value="newest" />
                                    <SelectItem label="Price: Low to High" value="price_asc" />
                                    <SelectItem label="Price: High to Low" value="price_desc" />
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </Box>

                    {/* LGA Filter Toggle (Simple Button for now) */}
                    <Button
                        variant={lgaFilter === 'All' ? 'outline' : 'solid'}
                        action={lgaFilter === 'All' ? 'secondary' : 'primary'}
                        className={`w-[48%] rounded-xl ${lgaFilter !== 'All' ? 'bg-primary-600' : 'border-gray-200'}`}
                        onPress={() => setLgaFilter(lgaFilter === 'All' ? userLga : 'All')}
                    >
                        <ButtonText className={lgaFilter !== 'All' ? 'text-white' : 'text-gray-600'}>
                            {lgaFilter === 'All' ? 'All Locations' : `In ${userLga}`}
                        </ButtonText>
                    </Button>
                </HStack>

                <HStack space="sm" className="overflow-x-auto pb-2">
                    {categories.map((cat, index) => (
                        <Button
                            key={`${cat}-${index}`}
                            size="xs"
                            action={activeCategory === cat ? 'primary' : 'secondary'}
                            variant={activeCategory === cat ? 'solid' : 'outline'}
                            onPress={() => setActiveCategory(cat)}
                            className={`rounded-full px-4 ${activeCategory === cat ? 'bg-primary-600 border-primary-600' : 'border-gray-300'}`}
                        >
                            <ButtonText className={activeCategory === cat ? 'text-white' : 'text-gray-600'}>{cat}</ButtonText>
                        </Button>
                    ))}
                </HStack>
            </Box>

            <Box className="p-4 bg-gray-50 flex-1">
                {loading ? (
                    <Box className="flex-1 justify-center items-center py-10">
                        <ButtonSpinner color="black" />
                    </Box>
                ) : (
                    <Box className="grid grid-cols-2 gap-4 pb-10">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                        {filteredProducts.length === 0 && (
                            <Box className="col-span-2 py-10 items-center">
                                <Text className="text-gray-500 text-center">No products found</Text>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
