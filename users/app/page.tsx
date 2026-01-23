'use client';

import { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { SearchIcon, ShoppingCartIcon, UserIcon, MapPinIcon, ChevronRightIcon } from 'lucide-react-native';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRecommendations, getUserProfile, getProductCategories } from '@/lib/api';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeftIcon } from '@/components/ui/icon';
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

  const navigateToCategory = (cat: string) => {
    setActiveCategory(cat);
    router.push(`/products?category=${encodeURIComponent(cat)}`);
  };

  return (
    <Box className="flex-1 min-h-screen bg-background pb-24">
      {/* Header */}
      <Box className="bg-background/95 backdrop-blur-md px-6 pt-12 pb-6 border-b border-border sticky top-0 z-50 shadow-sm">
        <HStack className="justify-between items-center mb-6">
          <VStack>
            <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-1">Logistics Hub</Text>
            <HStack className="items-center space-x-2">
              <MapPinIcon size={16} color="hsl(var(--primary))" />
              <Text className="text-foreground font-black text-lg tracking-tight">{userLga}, Abuja</Text>
            </HStack>
          </VStack>
          <HStack space="md" className="items-center">
            <ThemeToggle />
            <Link href="/cart">
              <Box className="bg-secondary p-3 rounded-2xl hover:bg-muted transition-all active:scale-95 relative border border-border/50">
                <ShoppingCartIcon size={20} className="text-foreground" />
              </Box>
            </Link>
            <Link href="/profile">
              <Box className="bg-secondary p-3 rounded-2xl hover:bg-muted transition-all active:scale-95 border border-border/50">
                <UserIcon size={20} className="text-foreground" />
              </Box>
            </Link>
          </HStack>
        </HStack>

        <VStack space="xl">
          <Box>
            <Heading className="text-4xl font-black text-foreground tracking-tighter leading-none mb-2">
              Welcome, <Text className="text-primary">{userName || 'Shopper'}</Text>
            </Heading>
            <Text className="text-muted-foreground font-medium text-lg tracking-tight">Discover local production today.</Text>
          </Box>

          <Input size="xl" className="bg-secondary/50 border-0 rounded-3xl h-16 focus:bg-card shadow-inner border-border/10">
            <InputSlot className="pl-6">
              <InputIcon as={SearchIcon} className="text-muted-foreground" />
            </InputSlot>
            <InputField
              placeholder="Search local catalog..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              className="text-foreground placeholder:text-muted-foreground/50 font-bold"
            />
          </Input>
        </VStack>
      </Box>

      {/* Categories */}
      <Box className="pt-10">
        <HStack className="px-7 justify-between items-center mb-5">
          <Heading size="sm" className="font-black text-foreground uppercase tracking-[0.2em] text-[10px] opacity-60">Global Categories</Heading>
          <Link href="/products">
            <Text className="text-primary font-black text-[10px] uppercase tracking-widest">Browse All</Text>
          </Link>
        </HStack>
        <HStack space="md" className="overflow-x-auto pb-4 px-6 scrollbar-hide">
          {categories.map((cat, index) => (
            <Button
              key={`${cat}-${index}`}
              size="sm"
              onPress={() => navigateToCategory(cat)}
              className={`rounded-2xl px-8 h-12 border transition-all active:scale-95 ${activeCategory === cat
                ? 'bg-primary border-primary shadow-lg shadow-primary/20 scale-105'
                : 'bg-secondary/50 border-border/30 hover:bg-secondary'
                }`}
            >
              <ButtonText className={`font-black uppercase tracking-widest text-[10px] ${activeCategory === cat ? 'text-primary-foreground' : 'text-foreground'}`}>
                {cat}
              </ButtonText>
            </Button>
          ))}
        </HStack>
      </Box>

      {/* Recommendations */}
      <Box className="p-6 mt-6">
        <HStack className="justify-between items-end mb-8 px-1">
          <VStack>
            <Heading size="2xl" className="text-foreground font-black tracking-tighter">Locally Sourced</Heading>
            <Text className="text-muted-foreground font-medium text-sm">Top picks in your area council</Text>
          </VStack>
          <Link href="/products">
            <HStack className="items-center space-x-1 hover:translate-x-1 transition-transform">
              <Text className="text-primary font-bold text-xs uppercase tracking-widest">Marketplace</Text>
              <ChevronRightIcon size={14} color="hsl(var(--primary))" />
            </HStack>
          </Link>
        </HStack>

        <Box className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>

        <Box className="mt-16 px-4">
          <Link href="/products" passHref legacyBehavior>
            <Button size="xl" className="w-full rounded-[2rem] bg-foreground hover:bg-foreground/90 h-16 border-0 shadow-2xl transition-all active:scale-[0.98] group" variant="solid">
              <ButtonText className="text-background font-black text-base uppercase tracking-[0.2em]">Explore Full Network</ButtonText>
              <Box className="ml-2 group-hover:translate-x-1 transition-transform">
                <ArrowLeftIcon  className="text-background rotate-180" />
              </Box>
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
