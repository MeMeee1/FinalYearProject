import { getMyProducts } from '@/api/products';
import { getVendorProfile } from '@/api/vendors';
import ProductsClient from './ProductsClient';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q?.trim();
  const currentPage = Math.max(1, Number(searchParams.page) || 1);

  // Fetch data on the server
  const [productsRes, vendorProfile] = await Promise.all([
    getMyProducts(currentPage, 12).catch(() => ({ data: [], pagination: null })),
    getVendorProfile().catch(() => null)
  ]);

  let products = productsRes?.data || [];

  // Basic server-side filtering if API doesn't support it directly yet (just to match previous behavior)
  if (query) {
    products = products.filter((p: any) =>
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase())
    );
  }

  const pagination = productsRes?.pagination || {
    page: currentPage,
    total: products.length,
    totalPages: Math.ceil(products.length / 12),
    hasMore: false
  };

  return (
    <ProductsClient
      initialProducts={products}
      initialPagination={pagination}
      vendorProfile={vendorProfile}
      searchParams={searchParams}
    />
  );
}