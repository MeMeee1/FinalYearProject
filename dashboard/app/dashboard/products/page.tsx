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
    const limit = 8;

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
      <div className="w-full min-h-screen bg-gray-50/50">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <Heading size="2xl" className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                  Marketplace Vendors
                </Heading>
                <Text className="mt-2 text-lg text-gray-500">
                  Discover unique products from our curated list of sellers
                </Text>
              </div>
              <div className="w-full sm:w-auto min-w-[300px]">
                <SearchBar />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {vendors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Icon as={ShoppingBagIcon} className="w-8 h-8 text-gray-400" />
                </div>
                <Heading size="md" className="text-gray-900 mb-2">
                  {query ? 'No matching vendors found' : 'No vendors available'}
                </Heading>
                <Text className="text-gray-500 max-w-md text-center">
                  {query ? `We couldn't find any vendors matching "${query}". Try adjusting your search terms.` : 'Check back later for new sellers.'}
                </Text>
              </div>
            ) : (
              <>
                {/* Vendors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {vendors.map((vendor: any) => (
                    <Link key={vendor.id} href={`/dashboard/products/vendor/${vendor.id}`} className="block group h-full">
                      <Card className="h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
                        {/* Vendor Cover/Logo Area */}
                        <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-blue-50 group-hover:from-indigo-100 group-hover:to-blue-100 transition-colors duration-500">
                          {vendor.storeLogo ? (
                            <Image
                              source={{ uri: vendor.storeLogo }}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              alt={vendor.storeName}
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-200">
                              <Icon as={ShoppingBagIcon} className="w-16 h-16 mb-2 opacity-50" />
                              <span className="text-xs font-medium uppercase tracking-wider opacity-60">No Logo</span>
                            </div>
                          )}

                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                          {/* Store Name Over Image for Impact */}
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h3 className="text-xl font-bold truncate drop-shadow-md">{vendor.storeName}</h3>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex flex-col flex-grow">
                          <div className="flex-grow">
                            {vendor.storeDescription ? (
                              <Text className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                                {vendor.storeDescription}
                              </Text>
                            ) : (
                              <Text className="text-sm text-gray-400 italic">
                                No description available
                              </Text>
                            )}
                          </div>

                          {/* Footer Action */}
                          <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between group/btn">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Visit Store</span>
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover/btn:bg-blue-600 transition-colors duration-300">
                              <span className="text-blue-600 group-hover/btn:text-white transition-colors duration-300">→</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center border-t border-gray-200 pt-8">
                  <div className="w-full max-w-md">
                    <Pagination
                      currentPage={pagination.page || currentPage}
                      totalPages={pagination.totalPages || 1}
                      searchQuery={query}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
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