'use client';

import { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { SearchIcon, ShoppingCartIcon, UserIcon, MapPinIcon } from 'lucide-react-native';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRecommendations, getUserProfile, getProductCategories } from '@/lib/api';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [userLga, setUserLga] = useState('Ikeja');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    getUserProfile().then((user: any) => {
      if (user) {
        if (user.lga) setUserLga(user.lga);
        if (user.name) setUserName(user.name.split(' ')[0]);
      }
    }).catch((err) => {
      console.error(err);
      router.push('/login');
    });

    getProductCategories().then(cats => {
      setCategories(['All', ...cats]);
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    getRecommendations(userLga).then(setProducts);
  }, [userLga]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box className="flex-1 min-h-screen bg-background pb-24">
      {/* Header */}
      <Box className="bg-background/95 backdrop-blur-md px-6 pt-12 pb-6 border-b border-border sticky top-0 z-50">
        <HStack className="justify-between items-center mb-6">
          <VStack>
            <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Delivering to</Text>
            <HStack className="items-center space-x-1">
              <MapPinIcon size={16} color="hsl(var(--primary))" />
              <Text className="text-foreground font-bold text-lg">{userLga}, Abuja</Text>
            </HStack>
          </VStack>
          <HStack space="md" className="items-center">
            <ThemeToggle />
            <Link href="/cart">
              <Box className="bg-secondary p-3 rounded-full hover:bg-muted transition-colors relative">
                <ShoppingCartIcon size={20} className="text-foreground" />
              </Box>
            </Link>
            <Link href="/profile">
              <Box className="bg-secondary p-3 rounded-full hover:bg-muted transition-colors">
                <UserIcon size={20} className="text-foreground" />
              </Box>
            </Link>
          </HStack>
        </HStack>

        <VStack space="md">
          <Box>
            <Heading className="text-3xl font-extrabold text-foreground">
              Hello, <Text className="text-primary">{userName || 'Shopper'}</Text>
            </Heading>
            <Text className="text-muted-foreground mt-1 text-lg">What are you looking for today?</Text>
          </Box>

          <Input size="xl" className="bg-secondary border-0 rounded-full h-14 focus:bg-muted">
            <InputSlot className="pl-4">
              <InputIcon as={SearchIcon} className="text-muted-foreground" />
            </InputSlot>
            <InputField
              placeholder="Search fresh products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              className="text-foreground placeholder:text-muted-foreground font-medium"
            />
          </Input>
        </VStack>
      </Box>

      {/* Categories */}
      <Box className="pt-8">
        <Box className="px-6 mb-4">
          <Heading size="sm" className="font-bold text-foreground uppercase tracking-widest text-xs">Categories</Heading>
        </Box>
        <HStack space="sm" className="overflow-x-auto pb-4 px-6 scrollbar-hide">
          {categories.map((cat, index) => (
            <Button
              key={`${cat}-${index}`}
              size="sm"
              onPress={() => setActiveCategory(cat)}
              className={`rounded-full px-6 py-2 border h-10 ${activeCategory === cat
                  ? 'bg-primary border-primary'
                  : 'bg-secondary border-transparent hover:bg-muted'
                }`}
            >
              <ButtonText className={`font-semibold ${activeCategory === cat ? 'text-primary-foreground' : 'text-foreground'}`}>
                {cat}
              </ButtonText>
            </Button>
          ))}
        </HStack>
      </Box>

      {/* Recommendations */}
      <Box className="p-6">
        <HStack className="justify-between items-end mb-6">
          <Heading size="xl" className="text-foreground font-bold">Recommended</Heading>
          <Link href="/products">
            <Text className="text-primary font-bold text-sm mb-1 hover:text-primary/80">View All</Text>
          </Link>
        </HStack>

        <Box className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>

        <Box className="mt-12">
          <Link href="/products" passHref legacyBehavior>
            <Button size="xl" className="w-full rounded-full bg-primary hover:bg-primary/90 h-14 border-0" variant="solid">
              <ButtonText className="text-primary-foreground font-bold text-lg">Explore All Products</ButtonText>
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
