// page.tsx - Show vendors first, then their products
import { listActiveVendors } from '@/api/vendors';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import { ShoppingBagIcon } from 'lucide-react';
import { Icon } from '@/components/ui/icon';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  try {
    const query = searchParams.q?.trim();
    const currentPage = Math.max(1, Number(searchParams.page) || 1);
    const limit = 2;

    const response = await listActiveVendors(currentPage, limit);
    let vendors = response?.data ?? [];
    
    // Client-side search filter
    if (query) {
      vendors = vendors.filter((v: any) =>
        v.storeName?.toLowerCase().includes(query.toLowerCase())
      );
    }

    const pagination = response?.pagination || {
      page: currentPage,
      total: vendors.length,
      totalPages: Math.ceil(vendors.length / limit),
      hasMore: vendors.length === limit
    };

    return (
      <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <Heading size="xl" className="mb-3 sm:mb-4 text-lg sm:text-xl">Browse Products by Vendor</Heading>
          <SearchBar />
        </div>

        {/* Main content area */}
        <div>
          {vendors.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500 text-lg">
                {query ? 'No matching vendors found' : 'No vendors available'}
              </p>
            </div>
          ) : (
            <>
              {/* Vendor Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8">
                {vendors.map((vendor: any) => (
                  <Link key={vendor.id} href={`/dashboard/products/vendor/${vendor.id}`} className="block">
                    <Card className="w-full h-full p-4 rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-200">
                      {/* Vendor Logo/Banner */}
                      <div className="relative pt-[60%] mb-4 overflow-hidden rounded-md bg-gradient-to-br from-blue-50 to-indigo-100">
                        {vendor.storeLogo ? (
                          <Image
                            source={{ uri: vendor.storeLogo }}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            alt={vendor.storeName}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon as={ShoppingBagIcon} className="w-12 h-12 text-indigo-300" />
                          </div>
                        )}
                      </div>
                      
                      {/* Vendor Info */}
                      <div className="flex-grow">
                        <Heading size="md" className="mb-2 line-clamp-1">{vendor.storeName}</Heading>
                        {vendor.storeDescription && (
                          <Text className="text-sm text-slate-600 line-clamp-2 mb-3">
                            {vendor.storeDescription}
                          </Text>
                        )}
                        
                        <div className="mt-auto pt-3 border-t border-gray-100">
                          <Text className="text-xs text-blue-600 font-medium">View Products →</Text>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-200">
                <Pagination
                  currentPage={pagination.page || currentPage}
                  totalPages={pagination.totalPages || 1}
                  searchQuery={query}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  } catch (error: any) {
    console.error('Error loading vendors:', error);
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 py-10">
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          <p className="font-medium">Error loading vendors</p>
          <p className="text-sm mt-1">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
}