
'use client';

import { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { SearchIcon, ShoppingCartIcon, UserIcon } from 'lucide-react-native';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRecommendations, searchProducts, getUserProfile, getProductCategories } from '@/lib/api';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [userLga, setUserLga] = useState('Ikeja');

  useEffect(() => {
    // Fetch user profile to get LGA
    getUserProfile().then((user: any) => {
      if (user && user.lga) setUserLga(user.lga);
    }).catch((err) => {
      console.error(err);
      router.push('/login');
    });

    // Fetch categories
    getProductCategories().then(cats => {
      setCategories(['All', ...cats]);
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    // Fetch recommendations based on LGA
    getRecommendations(userLga).then(setProducts);
  }, [userLga]);

  const handleSearch = async () => {
    // Implement search logic or navigation to search results
    console.log('Searching for:', searchQuery);
    // const results = await searchProducts(searchQuery);
    // setProducts(results);
  };

  return (
    <Box className="flex-1 min-h-screen bg-background-0 pb-20">
      {/* Header / Search Section */}
      <Box className="bg-primary-500 p-6 rounded-b-[30px] shadow-md">
        <VStack space="md">
          <HStack className="justify-between items-center">
            <Heading className="text-white text-2xl font-bold">ShopLocal</Heading>
            <Link href="/cart">
              <Button variant="link" size="sm" className="bg-white/20 rounded-full p-2 mr-2">
                <ButtonIcon as={ShoppingCartIcon} className="text-white" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="link" size="sm" className="bg-white/20 rounded-full p-2">
                <ButtonIcon as={UserIcon} className="text-white" />
              </Button>
            </Link>
          </HStack>

          <VStack space="xs">
            <Text className="text-white/80">Delivering to</Text>
            <HStack space="xs" className="items-center">
              <Text className="text-white font-bold text-lg">{userLga}, Lagos</Text>
            </HStack>
          </VStack>

          <Input variant="outline" size="lg" className="bg-white border-0 rounded-full shadow-sm mt-2">
            <InputSlot className="pl-3">
              <InputIcon as={SearchIcon} className="text-gray-400" />
            </InputSlot>
            <InputField
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </Input>
        </VStack>
      </Box>

      {/* Categories */}
      <Box className="pt-6 pl-6">
        <Heading size="sm" className="mb-3 text-typography-700">Categories</Heading>
        <HStack space="sm" className="overflow-x-auto pb-2 pr-6">
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              action={activeCategory === cat ? 'primary' : 'secondary'}
              variant={activeCategory === cat ? 'solid' : 'outline'}
              onPress={() => setActiveCategory(cat)}
              className={`rounded-full px-4 ${activeCategory === cat ? 'bg-primary-500 border-primary-500' : 'border-gray-300'}`}
            >
              <ButtonText className={activeCategory === cat ? 'text-white' : 'text-typography-600'}>{cat}</ButtonText>
            </Button>
          ))}
        </HStack>
      </Box>

      {/* Recommendations */}
      <Box className="p-6">
        <HStack className="justify-between items-center mb-4">
          <Heading size="md" className="text-typography-800">Recommended in {userLga}</Heading>
        </HStack>

        <Box className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>

        <Box className="mt-8 mb-4">
          <Link href="/products" passHref legacyBehavior>
            <Button size="lg" className="w-full rounded-xl bg-gray-100 border border-gray-200" variant="outline">
              <ButtonText className="text-primary-600 font-bold">See All Products</ButtonText>
            </Button>
          </Link>
        </Box>
      </Box>

    </Box>
  );
}
