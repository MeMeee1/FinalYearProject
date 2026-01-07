import { getProductsByVendor } from '@/api/products';
import { getVendorById } from '@/api/vendors';
import ProductListItem from '../../ProductListItem';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { AddIcon, Icon } from '@/components/ui/icon';
import { ArrowLeft } from 'lucide-react';

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
    const limit = 20;

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
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <Link 
            href="/dashboard/products" 
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vendors
          </Link>
          
          <div className="flex items-start gap-4">
            {vendor.storeLogo && (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={vendor.storeLogo} alt={vendor.storeName} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <Heading size="xl" className="mb-1">{vendor.storeName}</Heading>
              {vendor.storeDescription && (
                <Text className="text-slate-600">{vendor.storeDescription}</Text>
              )}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-grow">
          {products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500 text-lg">
                No products available from this vendor
              </p>
            </div>
          ) : (
            <>
              {/* Grid layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8">
                <Link
                  href="/dashboard/products/create"
                  className="block"
                >
                  <Card className="w-full h-full p-4 sm:p-5 lg:p-6 flex items-center justify-center min-h-[180px] sm:min-h-[200px] lg:min-h-[220px] hover:shadow-lg transition-shadow duration-300">
                    <div className="text-center">
                      <Icon as={AddIcon} className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600 text-sm sm:text-base lg:text-lg">Add New Product</p>
                    </div>
                  </Card>
                </Link>

                {products.map((product: any) => (
                  <div key={product.id}>
                    <ProductListItem product={product} />
                  </div>
                ))}
              </div>

              {/* Simple pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-200 flex justify-center gap-2">
                  {currentPage > 1 && (
                    <Link 
                      href={`/dashboard/products/vendor/${vendorId}?page=${currentPage - 1}`}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Previous
                    </Link>
                  )}
                  <span className="px-4 py-2">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  {currentPage < pagination.totalPages && (
                    <Link 
                      href={`/dashboard/products/vendor/${vendorId}?page=${currentPage + 1}`}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Spacer for mobile */}
        <div className="h-4 sm:h-6 lg:h-8"></div>
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
