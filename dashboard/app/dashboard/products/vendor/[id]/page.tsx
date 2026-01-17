import { getProductsByVendor } from '@/api/products';
import { getVendorById } from '@/api/vendors';
import ProductListItem from '../../ProductListItem';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { AddIcon, Icon } from '@/components/ui/icon';
import { ArrowLeft, ShoppingBagIcon } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default async function VendorProductsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  try {
    const vendorId = params.id;
    const currentPage = Math.max(1, Number(searchParams.page) || 1);
    const limit = 5;

    const [vendor, productsResponse] = await Promise.all([
      getVendorById(vendorId),
      getProductsByVendor(vendorId, currentPage, limit),
    ]);

    const products = productsResponse?.data ?? productsResponse?.products ?? [];
    const pagination = productsResponse?.pagination || {
      page: currentPage,
      total: products.length,
      totalPages: Math.ceil(products.length / limit),
      hasMore: products.length === limit
    };

    return (
      <div className="w-full min-h-screen bg-gray-50/50">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header Section */}
          <div className="mb-8">
            <Link
              href="/dashboard/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-300 shadow-sm transition-all">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Vendors
            </Link>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {vendor.storeLogo ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white shadow-md border border-gray-100 flex-shrink-0">
                  <img src={vendor.storeLogo} alt={vendor.storeName} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center flex-shrink-0 shadow-inner">
                  <Icon as={ShoppingBagIcon} className="w-10 h-10 text-indigo-300" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{vendor.storeName}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Pro Seller</span>
                    <span>•</span>
                    <span>{pagination.total} Products</span>
                  </div>
                </div>
                {vendor.storeDescription && (
                  <p className="mt-4 text-gray-600 leading-relaxed max-w-2xl">{vendor.storeDescription}</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Icon as={ShoppingBagIcon} className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-500">This vendor has not added any products yet.</p>
              </div>
            ) : (
              <>
                {/* Grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {/* "Add Product" card removed as this is likely an admin view. If needed, can be re-added via separate request or condition. */}

                  {products.map((product: any) => {
                    let imageUrl = product.image;
                    try {
                      const parsed = JSON.parse(product.image);
                      if (Array.isArray(parsed) && parsed.length > 0) {
                        imageUrl = parsed[0];
                      }
                    } catch (e) {
                      // Keep original if not JSON
                    }

                    return (
                      <Link key={product.id} href={`/dashboard/products/${product.id}`} className="block group h-full">
                        <Card className="h-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
                          {/* Image Area */}
                          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden group-hover:opacity-95 transition-opacity">
                            <Image
                              source={{ uri: imageUrl || '/placeholder-image.jpg' }}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              alt={product.name}
                            />
                            {product.stock <= 0 && (
                              <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
                                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider">Out of Stock</span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4 flex flex-col flex-grow">
                            <div className="flex-grow">
                              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                {product.description || 'No description'}
                              </p>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex items-end justify-between">
                              <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Price</p>
                                <p className="text-lg font-bold text-gray-900">${Number(product.price).toFixed(2)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Stock</p>
                                <p className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                  {product.stock}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center border-t border-gray-200 pt-8">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                      <Link
                        href={currentPage > 1 ? `/dashboard/products/vendor/${vendorId}?page=${currentPage - 1}` : '#'}
                        className={`p-2 rounded hover:bg-gray-50 transition-colors ${currentPage <= 1 ? 'text-gray-300 pointer-events-none' : 'text-gray-600'}`}
                      >
                        <span className="text-sm font-medium">Previous</span>
                      </Link>
                      <span className="px-4 text-sm font-medium text-gray-900">
                        Page {currentPage} of {pagination.totalPages}
                      </span>
                      <Link
                        href={currentPage < pagination.totalPages ? `/dashboard/products/vendor/${vendorId}?page=${currentPage + 1}` : '#'}
                        className={`p-2 rounded hover:bg-gray-50 transition-colors ${currentPage >= pagination.totalPages ? 'text-gray-300 pointer-events-none' : 'text-gray-600'}`}
                      >
                        <span className="text-sm font-medium">Next</span>
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error('Error loading vendor products:', error);
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 py-10">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vendors
        </Link>
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          <p className="font-medium">Error loading products</p>
          <p className="text-sm mt-1">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
}
