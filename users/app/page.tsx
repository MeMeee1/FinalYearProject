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
    getRecommendations(userLga, activeCategory).then(setProducts);
  }, [userLga, activeCategory]);

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
    <Box className="flex-1 min-h-screen bg-background pb-32">
      {/* Dynamic Header / Hero */}
      <Box className="relative overflow-hidden pt-16 pb-12 px-8">
        {/* Background Accent */}
        <Box className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <Box className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

        <VStack space="xl" className="relative z-10">
          <HStack className="justify-between items-start">
            <VStack space="xs">
              <HStack className="items-center space-x-2 bg-secondary/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50 self-start mb-2">
                <MapPinIcon size={12} color="hsl(var(--primary))" />
                <Text className="text-foreground font-black text-[10px] uppercase tracking-widest">{userLga}, Abuja</Text>
              </HStack>
              <Heading className="text-5xl font-black text-foreground tracking-tighter leading-[0.9] mb-1">
                Welcome, <Text className="text-primary italic">{userName || 'Shopper'}</Text>
              </Heading>
              <Text className="text-muted-foreground font-medium text-lg leading-snug max-w-[80%]">Curating the best local produce for your household.</Text>
            </VStack>

            <HStack space="md" className="items-center mt-2">
              <ThemeToggle />
              <Link href="/cart">
                <Box className="bg-secondary p-4 rounded-[1.5rem] hover:bg-primary transition-all active:scale-95 relative border border-border/50 group">
                  <ShoppingCartIcon size={20} className="text-foreground group-hover:text-primary-foreground" />
                </Box>
              </Link>
            </HStack>
          </HStack>

          {/* Premium Search Bar */}
          <Box className="relative group">
            <Box className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-xl group-focus-within:bg-primary/10 transition-all" />
            <Input size="xl" className="bg-secondary/40 backdrop-blur-xl border border-border/30 rounded-[2rem] h-20 focus:border-primary/50 transition-all relative z-10">
              <InputSlot className="pl-8">
                <InputIcon as={SearchIcon} className="text-muted-foreground w-6 h-6" />
              </InputSlot>
              <InputField
                placeholder="Search local agricultural hub..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                className="text-foreground placeholder:text-muted-foreground/40 font-bold text-lg"
              />
            </Input>
          </Box>
        </VStack>
      </Box>

      {/* Modern Categories */}
      <Box className="pt-4">
        <HStack className="px-9 justify-between items-center mb-6">
          <HStack space="sm" className="items-center">
            <Box className="w-1.5 h-4 bg-primary rounded-full" />
            <Heading size="xs" className="font-black text-foreground uppercase tracking-[0.2em] text-[10px]">Taxonomies</Heading>
          </HStack>
          <Link href="/products">
            <Text className="text-muted-foreground hover:text-primary font-black text-[10px] uppercase tracking-widest transition-colors">Marketplace</Text>
          </Link>
        </HStack>
        <HStack space="md" className="overflow-x-auto pb-6 px-8 scrollbar-hide">
          {categories.map((cat, index) => (
            <Button
              key={`${cat}-${index}`}
              size="sm"
              onPress={() => navigateToCategory(cat)}
              className={`rounded-[1.25rem] px-8 h-12 border transition-all active:scale-95 ${activeCategory === cat
                ? 'bg-primary border-primary shadow-xl shadow-primary/30 scale-105'
                : 'bg-secondary/30 border-border/20 hover:bg-secondary/60'
                }`}
            >
              <ButtonText className={`font-black uppercase tracking-widest text-[10px] ${activeCategory === cat ? 'text-primary-foreground' : 'text-foreground'}`}>
                {cat}
              </ButtonText>
            </Button>
          ))}
        </HStack>
      </Box>

      {/* Enhanced Recommendations */}
      <Box className="px-8 mt-4">
        <HStack className="justify-between items-end mb-10">
          <VStack space="xs">
            <Text className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">Curated Feed</Text>
            <Heading size="3xl" className="text-foreground font-black tracking-tighter">Locally Sourced</Heading>
          </VStack>
          <Link href="/products">
            <HStack className="items-center space-x-2 group-hover:translate-x-1 transition-transform bg-secondary/30 px-4 py-2 rounded-full border border-border/50">
              <Text className="text-foreground font-bold text-[10px] uppercase tracking-widest">View All Products</Text>
              <ChevronRightIcon size={12} className="text-primary" />
            </HStack>
          </Link>
        </HStack>

        <Box className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>

        {/* Global Action CTA */}
        <Box className="mt-24 mb-50">
          <Link href="/products">
            <Button size="sm" className="w-[50%] mx-auto rounded-[2.5rem] bg-foreground hover:bg-foreground/90 h-20 border-0 shadow-2xl transition-all active:scale-[0.98] group overflow-hidden relative" variant="solid">
              <Box className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <HStack space="md" className="items-center relative z-10">
                <ButtonText className="text-background font-black text-md uppercase tracking-[0.25em]">See more Products</ButtonText>
                <Box className="group-hover:translate-x-2 transition-transform duration-500">
                  <ChevronRightIcon size={24} className="text-background" />
                </Box>
              </HStack>
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
