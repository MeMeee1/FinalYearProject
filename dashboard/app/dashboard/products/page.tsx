import { listProducts, searchProducts } from '@/api/products';
import ProductListItem from './ProductListItem';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { AddIcon, Icon } from '@/components/ui/icon';
import SearchBar from './SearchBar';
import Pagination from './Pagination';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  try {
    const query = searchParams.q?.trim();
    const currentPage = Number(searchParams.page) || 1;

    const response = query
      ? await searchProducts(query, currentPage)
      : await listProducts(currentPage);

    const products = response.data ?? [];
    const pagination = response.pagination;

    return (
      <div className="w-full max-w-[1400px]">
        <div className="mb-6">
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          <Link
            href="/dashboard/products/create"
            className="block"
          >
            <Card className="w-full p-5 flex items-center justify-center min-h-[100px]">
              <Icon as={AddIcon} className="w-10 h-10 text-slate-400" />
            </Card>
          </Link>

          {products.length > 0 ? (
            products.map((product: typeof products[number]) => (
              <ProductListItem key={product.id} product={product} />
            ))
          ) : (
            <p className="text-slate-500">
              {query ? 'No matching products found' : 'No products available'}
            </p>
          )}
        </div>

        {pagination && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            searchQuery={query}
          />
        )}
      </div>
    );
  } catch (error: any) {
    console.error('Error loading products:', error);
    return <div>Error loading products</div>;
  }
}
