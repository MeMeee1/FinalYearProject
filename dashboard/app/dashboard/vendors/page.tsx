import { listActiveVendors, listPendingVendors, getPlatformStats, listSuspendingVendors } from '@/api/vendors';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import VendorListItem from './vendor-list-item';

export default async function VendorsPage({
    searchParams,
}: {
    searchParams: { q?: string; page?: string; status?: 'active' | 'pending' | 'suspended' };
}) {
    const currentPage = Math.max(1, Number(searchParams.page) || 1);
    const limit = 12;
    const status = (searchParams.status || 'active') as 'active' | 'pending' | 'suspended';
    const q = (searchParams.q || '').toLowerCase().trim();

    const [stats, list] = await Promise.all([
        getPlatformStats().catch(() => null),
        status === 'pending'
            ? listPendingVendors(currentPage, limit)
            : status === 'suspended'
            ? listSuspendingVendors(currentPage, limit)
            : listActiveVendors(currentPage, limit),
    ]);

    let vendors = list?.data ?? [];
    if (q) {
        vendors = vendors.filter((v: any) =>
            [v.storeName, v.businessEmail, v.businessPhone]
                .filter(Boolean)
                .some((s: string) => s.toLowerCase().includes(q))
        );
    }
    const pagination = list?.pagination
        ? { ...list.pagination }
        : {
                page: currentPage,
                total: vendors.length,
                totalPages: Math.max(1, Math.ceil(vendors.length / limit)),
                hasMore: vendors.length === limit,
            };

    return (
        <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 min-h-screen flex flex-col">
            {/* Header */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
                <div className="flex flex-col gap-3 sm:gap-4">
                    <Heading size="xl">Vendors</Heading>

                    {/* Quick stats */}
                    {stats && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            <Card className="p-4"><Text className="text-xs text-slate-500">Total Vendors</Text><Heading size="lg">{stats.totalVendors}</Heading></Card>
                            <Card className="p-4"><Text className="text-xs text-slate-500">Active Vendors</Text><Heading size="lg">{stats.activeVendors}</Heading></Card>
                            <Card className="p-4"><Text className="text-xs text-slate-500">Pending Vendors</Text><Heading size="lg">{stats.pendingVendors}</Heading></Card>
                            <Card className="p-4"><Text className="text-xs text-slate-500">Suspended Vendors</Text><Heading size="lg">{stats.suspendedVendors}</Heading></Card>
                            <Card className="p-4 hidden lg:block"><Text className="text-xs text-slate-500">Total Orders</Text><Heading size="lg">{stats.totalOrders}</Heading></Card>
                            <Card className="p-4 hidden lg:block"><Text className="text-xs text-slate-500">Platform Revenue</Text><Heading size="lg">${Number(stats.totalPlatformRevenue || 0).toFixed(2)}</Heading></Card>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard/vendors?status=active" className={`px-3 py-2 rounded-md text-sm ${status === 'active' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'}`}>Active</Link>
                        <Link href="/dashboard/vendors?status=pending" className={`px-3 py-2 rounded-md text-sm ${status === 'pending' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'}`}>Pending Approval</Link>
                        <Link href="/dashboard/vendors?status=suspended" className={`px-3 py-2 rounded-md text-sm ${status === 'suspended' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'}`}>Suspended Vendor</Link>
                    </div>

                    <SearchBar />
                </div>
            </div>

            {/* Content */}
            <div className="flex-grow">
                {vendors.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-slate-500 text-lg">
                            {status === 'pending' ? 'No pending vendors' : status === 'suspended' ? 'No suspended vendors' : 'No vendors available'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8">
                            {vendors.map((v: any) => (
                                <VendorListItem key={v.id} vendor={v} isPending={status === 'pending'} isSuspended={status === 'suspended'} />
                            ))}
                        </div>

                        <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-200">
                            <Pagination currentPage={pagination.page} totalPages={pagination.totalPages || 1} />
                        </div>
                    </>
                )}
            </div>

            <div className="h-4 sm:h-6 lg:h-8"></div>
        </div>
    );
}