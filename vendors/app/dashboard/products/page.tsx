'use client';
import { getMyProducts } from '@/api/products';
import { getVendorProfile } from '@/api/vendors';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import { Plus, Package, Edit2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [vendorProfile, setVendorProfile] = useState<any>(null);

  const query = searchParams.q?.trim();
  const currentPage = Math.max(1, Number(searchParams.page) || 1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [productsRes, profileRes] = await Promise.all([
          getMyProducts(currentPage, 12),
          getVendorProfile().catch(() => null)
        ]);

        setVendorProfile(profileRes);
        const response = productsRes;
        let fetchedProducts = response?.data ?? [];

        // Client-side search filter
        if (query) {
          fetchedProducts = fetchedProducts.filter((p: any) =>
            p.name?.toLowerCase().includes(query.toLowerCase()) ||
            p.description?.toLowerCase().includes(query.toLowerCase())
          );
        }

        setProducts(fetchedProducts);
        setPagination(response?.pagination || {
          page: currentPage,
          total: fetchedProducts.length,
          totalPages: Math.ceil(fetchedProducts.length / 12),
          hasMore: false
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, query]);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4">
          <Heading size="xl" className="text-lg sm:text-xl">Your Products</Heading>
          {vendorProfile?.status === 'active' && (
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
        {vendorProfile?.status !== 'active' && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            <Text className="text-sm">Account pending approval. You can manage products once approved.</Text>
          </div>
        )}
        <SearchBar />
      </div>

      {/* Main content area */}
      <div>
        {loading ? (
          <div className="text-center py-10">
            <p className="text-slate-500 text-lg">Loading products...</p>
          </div>
        ) : error ? (
          <Card className="p-6 border-red-200 bg-red-50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <p className="text-red-600 font-bold text-2xl">!</p>
              </div>
              <div className="flex-1">
                <Text className="font-semibold text-red-900 mb-2">Failed to load your products</Text>
                <Text className="text-sm text-red-700 mb-4">{error}</Text>
                <div className="text-sm text-red-700 space-y-1">
                  <p><strong>Troubleshooting tips:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Make sure the backend API is running on port 3001</li>
                    <li>Check your internet connection</li>
                    <li>Try refreshing the page (F5)</li>
                    <li>Log out and log back in</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-4">
              {query ? 'No matching products found' : 'No products yet'}
            </p>
            {vendorProfile?.status === 'active' && (
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
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8">
              {products.map((product: any) => (
                <Card key={product.id} className="w-full h-full p-4 rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-200 overflow-hidden">
                  {/* Product Image */}
                  <div className="relative pt-[75%] mb-4 overflow-hidden rounded-md bg-gradient-to-br from-gray-50 to-gray-100">
                    {product.images && product.images[0] ? (
                      <Image
                        source={{ uri: product.images[0] }}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        alt={product.name}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow mb-4">
                    <Heading size="sm" className="mb-2 line-clamp-2">{product.name}</Heading>
                    {product.description && (
                      <Text className="text-sm text-slate-600 line-clamp-2 mb-3">
                        {product.description}
                      </Text>
                    )}

                    {/* Price and Stock */}
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

                  {/* Action Buttons */}
                  {vendorProfile?.status === 'active' && (
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <Link
                        href={`/dashboard/products/edit/${product.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors duration-200 font-medium text-sm"
                      >
                        <Edit2 size={16} />
                        <span className="hidden sm:inline">Edit</span>
                      </Link>
                      <button
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors duration-200 font-medium text-sm"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-200">
                <Pagination
                  currentPage={pagination.page || currentPage}
                  totalPages={pagination.totalPages || 1}
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