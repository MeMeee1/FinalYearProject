'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import { Plus, Package, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useVendorStore } from '@/store/vendorStore';
import { useVendorProfile } from '@/hooks/useVendorProfile';

import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { deleteProduct } from './actions';
import { useRouter } from 'next/navigation';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';

interface ProductsClientProps {
    initialProducts: any[];
    initialPagination: any;
    vendorProfile: any;
    searchParams: { q?: string; page?: string };
}

export default function ProductsClient({
    initialProducts,
    initialPagination,
    vendorProfile,
    searchParams,
}: ProductsClientProps) {
    const router = useRouter();
    const { vendorProfile: storeProfile, fetchProfile } = useVendorProfile();
    const setVendorStoreProfile = useVendorStore(state => state.setVendorProfile);

    useEffect(() => {
        if (vendorProfile && !storeProfile) {
            setVendorStoreProfile(vendorProfile);
        }
    }, [vendorProfile, storeProfile, setVendorStoreProfile]);

    const activeProfile = storeProfile || vendorProfile;
    const isActive = activeProfile?.status === 'active';

    const displayedProducts = initialProducts;
    const query = searchParams.q?.trim();

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (productId: number) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteProduct(productId);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete product', error);
            alert('Failed to delete product');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-6">
            <VStack space="xl">
                <HStack className="justify-between items-center mb-2">
                    <Heading size="xl" className="text-2xl font-bold text-slate-800">Your Products</Heading>
                    {isActive && (
                        <Link href="/dashboard/products/create">
                            <Button className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 h-11 border-0 shadow-sm">
                                <ButtonIcon as={Plus} className="mr-2 text-white" />
                                <ButtonText className="text-white font-bold">Add Product</ButtonText>
                            </Button>
                        </Link>
                    )}
                </HStack>

                <Box className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm mb-4">
                    <SearchBar />
                </Box>

                {!isActive && (
                    <Box className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex-row items-center gap-3">
                        <Package className="text-amber-600 w-5 h-5" />
                        <Text className="text-amber-800 font-medium">Account pending approval. You can manage products once approved.</Text>
                    </Box>
                )}

                <div>
                    {displayedProducts.length === 0 ? (
                        <VStack className="items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
                            <Box className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-4">
                                <Package className="w-10 h-10 text-slate-300" />
                            </Box>
                            <Text className="text-slate-500 text-lg font-semibold mb-6">
                                {query ? 'No matching products found' : 'No products in your catalog yet'}
                            </Text>
                            {isActive && (
                                <Link href="/dashboard/products/create">
                                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-lg px-8">
                                        <ButtonText className="text-white font-bold">Add Your First Product</ButtonText>
                                    </Button>
                                </Link>
                            )}
                        </VStack>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                                {displayedProducts.map((product: any) => {
                                    let previewImage = product.image;
                                    if (product.image && typeof product.image === 'string') {
                                        try {
                                            const parsed = JSON.parse(product.image);
                                            if (Array.isArray(parsed) && parsed.length > 0) {
                                                previewImage = parsed[0];
                                            }
                                        } catch (e) {
                                            previewImage = product.image;
                                        }
                                    }

                                    return (
                                        <Card key={product.id} className="p-0 border border-slate-100 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                                            <Box className="relative aspect-video bg-slate-50 overflow-hidden">
                                                {previewImage ? (
                                                    <img
                                                        src={previewImage}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        alt={product.name}
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full">
                                                        <Package className="w-12 h-12 text-slate-200" />
                                                    </div>
                                                )}
                                            </Box>

                                            <VStack className="p-5 flex-1 justify-between" space="md">
                                                <VStack>
                                                    <Heading size="sm" className="text-slate-900 font-bold line-clamp-1 mb-1">{product.name}</Heading>
                                                    <Text className="text-xs text-slate-500 font-medium mb-3">{product.category || 'Product'}</Text>

                                                    <HStack className="justify-between items-center mt-2">
                                                        <Text className="text-xl font-bold text-green-600">
                                                            ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                                        </Text>
                                                        <Text className={`text-[10px] font-bold px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                                            {product.stock} In stock
                                                        </Text>
                                                    </HStack>
                                                </VStack>

                                                {isActive && (
                                                    <HStack space="md" className="mt-4 pt-4 border-t border-slate-50">
                                                        <Link href={`/dashboard/products/${product.id}/edit`} className="flex-1">
                                                            <Button className="w-full bg-blue-50 hover:bg-blue-100 h-10 border-0 rounded-lg shadow-none group/edit">
                                                                <ButtonIcon as={Edit2} className="text-blue-600 w-4 h-4 mr-2" />
                                                                <ButtonText className="text-blue-600 font-bold text-xs uppercase tracking-wider">Edit</ButtonText>
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            className="flex-1 bg-red-50 hover:bg-red-100 h-10 border-0 rounded-lg shadow-none group/delete"
                                                            onPress={() => handleDelete(product.id)}
                                                            disabled={isDeleting}
                                                        >
                                                            <ButtonIcon as={Trash2} className="text-red-600 w-4 h-4 mr-2" />
                                                            <ButtonText className="text-red-600 font-bold text-xs uppercase tracking-wider">Delete</ButtonText>
                                                        </Button>
                                                    </HStack>
                                                )}
                                            </VStack>
                                        </Card>
                                    )
                                })}
                            </div>

                            {initialPagination && initialPagination.totalPages > 1 && (
                                <Pagination
                                    currentPage={initialPagination.page || 1}
                                    totalPages={initialPagination.totalPages || 1}
                                    searchQuery={query}
                                />
                            )}
                        </>
                    )}
                </div>
            </VStack>
        </div>
    );
}
