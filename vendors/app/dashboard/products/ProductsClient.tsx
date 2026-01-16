'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import { Plus, Package, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useVendorStore } from '@/store/vendorStore';
import { useVendorProfile } from '@/hooks/useVendorProfile';

import { Button, ButtonText } from '@/components/ui/button';
import { deleteProduct } from './actions';
import { useRouter } from 'next/navigation';

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

    // Seed the store with server data on mount
    useEffect(() => {
        if (vendorProfile && !storeProfile) {
            setVendorStoreProfile(vendorProfile);
        }
    }, [vendorProfile, storeProfile, setVendorStoreProfile]);

    const activeProfile = storeProfile || vendorProfile;
    const isActive = activeProfile?.status === 'active';

    const displayedProducts = initialProducts;
    const query = searchParams.q?.trim();

    // Delete State
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
        <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
            <div className="mb-4 sm:mb-6 lg:mb-8">
                <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4">
                    <Heading size="xl" className="text-lg sm:text-xl">Your Products</Heading>
                    {isActive && (
                        <Link
                            href="/dashboard/products/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                        >
                            <Plus size={20} />
                            <span className="hidden sm:inline">Add Product</span>
                            <span className="sm:hidden">Add</span>
                        </Link>
                    )}
                </div>
                {!isActive && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        <Text className="text-sm">Account pending approval. You can manage products once approved.</Text>
                    </div>
                )}
                <SearchBar />
            </div>

            <div>
                {displayedProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg mb-4">
                            {query ? 'No matching products found' : 'No products yet'}
                        </p>
                        {isActive && (
                            <Link
                                href="/dashboard/products/create"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                            >
                                <Plus size={20} />
                                Create Your First Product
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8">
                            {displayedProducts.map((product: any) => {
                                // Parse image if it's a string, or handle string directly
                                let previewImage = product.image;
                                if (product.image && typeof product.image === 'string') {
                                    try {
                                        const parsed = JSON.parse(product.image);
                                        if (Array.isArray(parsed) && parsed.length > 0) {
                                            previewImage = parsed[0];
                                        } else if (Array.isArray(parsed)) {
                                            previewImage = null; // empty array
                                        } else {
                                            // Is just a JSON string of a single URL or not JSON?
                                            // Actually our controller code stores JSON string array or falls back.
                                        }
                                    } catch (e) {
                                        // Not JSON, so it's a raw URL string
                                        previewImage = product.image;
                                    }
                                }

                                return (
                                    <Card key={product.id} className="w-full h-full p-4 rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-200 overflow-hidden">
                                        <div className="relative pt-[75%] mb-4 overflow-hidden rounded-md bg-gradient-to-br from-gray-50 to-gray-100">
                                            {previewImage ? (
                                                <img
                                                    src={previewImage}
                                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                                    alt={product.name}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Package className="w-12 h-12 text-gray-300" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow mb-4">
                                            <Heading size="sm" className="mb-2 line-clamp-2">{product.name}</Heading>
                                            {product.description && (
                                                <Text className="text-sm text-slate-600 line-clamp-2 mb-3">
                                                    {product.description}
                                                </Text>
                                            )}

                                            <div className="mt-auto pt-3 border-t border-gray-100">
                                                <div className="flex justify-between items-center mb-2">
                                                    <Text className="text-lg font-bold text-green-600">
                                                        ${product.price?.toFixed(2) || '0.00'}
                                                    </Text>
                                                    <Text className={`text-sm font-medium ${product.stock > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                                        {product.stock} in stock
                                                    </Text>
                                                </div>
                                            </div>
                                        </div>

                                        {isActive && (
                                            <div className="flex gap-2 pt-3 border-t border-gray-100">
                                                <Link
                                                    href={`/dashboard/products/${product.id}/edit`}
                                                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors duration-200 font-medium text-sm"
                                                >
                                                    <Edit2 size={16} />
                                                    <span className="hidden sm:inline">Edit</span>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={isDeleting}
                                                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors duration-200 font-medium text-sm disabled:opacity-50"
                                                >
                                                    <Trash2 size={16} />
                                                    <span className="hidden sm:inline">Delete</span>
                                                </button>
                                            </div>
                                        )}
                                    </Card>
                                )
                            })}
                        </div>

                        {initialPagination && initialPagination.totalPages > 1 && (
                            <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-200">
                                <Pagination
                                    currentPage={initialPagination.page || 1}
                                    totalPages={initialPagination.totalPages || 1}
                                    searchQuery={query}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
