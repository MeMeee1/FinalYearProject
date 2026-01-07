import { getVendorById, getVendorAnalytics } from '@/api/vendors';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import Link from 'next/link';

export default async function VendorDetailPage({ params }: { params: { id: string } }) {
  const vendorId = params.id;
  const [vendor, analytics] = await Promise.all([
    getVendorById(vendorId),
    getVendorAnalytics(vendorId).catch(() => null),
  ]);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-6 min-h-screen flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <Heading size="xl">{vendor.storeName}</Heading>
        <Link href="/dashboard/vendors" className="text-sm text-blue-600 underline">Back to vendors</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 lg:col-span-2">
          <Heading size="md" className="mb-3">Store Details</Heading>
          <div className="space-y-2 text-sm">
            <div><Text className="text-slate-500">Status:</Text> <span className={`ml-2 px-2 py-0.5 rounded ${vendor.status === 'active' ? 'bg-green-50 text-green-700' : vendor.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>{vendor.status}</span></div>
            {vendor.businessEmail && (<div><Text className="text-slate-500">Email:</Text> <span className="ml-2">{vendor.businessEmail}</span></div>)}
            {vendor.businessPhone && (<div><Text className="text-slate-500">Phone:</Text> <span className="ml-2">{vendor.businessPhone}</span></div>)}
            {vendor.businessAddress && (<div><Text className="text-slate-500">Address:</Text> <span className="ml-2">{vendor.businessAddress}</span></div>)}
            {vendor.storeDescription && (<div className="pt-2"><Text className="text-slate-500">Description:</Text><p className="mt-1 text-slate-700">{vendor.storeDescription}</p></div>)}
          </div>
        </Card>

        <Card className="p-4">
          <Heading size="md" className="mb-3">Created</Heading>
          <Text className="text-sm text-slate-700">{new Date(vendor.createdAt).toLocaleString()}</Text>
        </Card>
      </div>

      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="p-4"><Text className="text-xs text-slate-500">Products</Text><Heading size="lg">{analytics.totalProducts}</Heading></Card>
          <Card className="p-4"><Text className="text-xs text-slate-500">Orders</Text><Heading size="lg">{analytics.totalOrders}</Heading></Card>
          <Card className="p-4 lg:col-span-2"><Text className="text-xs text-slate-500">Revenue</Text><Heading size="lg">${Number(analytics.totalRevenue || 0).toFixed(2)}</Heading></Card>
          <Card className="p-4 lg:col-span-2"><Text className="text-xs text-slate-500">Joined</Text><Heading size="lg">{new Date(analytics.createdAt).toLocaleDateString()}</Heading></Card>
        </div>
      )}
    </div>
  );
}
