'use client';

import { useEffect, useState } from 'react';
import { useVendorProfile } from '@/hooks/useVendorProfile';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Coins,

  Package,
  Clock,
  ArrowUpRight,
  Store,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useVendorStore } from '@/store/vendorStore';
import { useRouter } from 'next/navigation';

interface DashboardClientProps {
  vendorStats: any;
  ordersData: any;
  vendorProfile?: any; // Optional initial profile from server
}

export function DashboardClient({ vendorStats, ordersData, vendorProfile }: DashboardClientProps) {
  const { vendorProfile: storeProfile, isLoading, error, refreshProfile, fetchProfile } = useVendorProfile();
  const setVendorStoreProfile = useVendorStore(state => state.setVendorProfile);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshProfile();
      // Force server component refresh to update sidebar/layout
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initialize profile on component mount if provided from server
  useEffect(() => {
    if (vendorProfile && !storeProfile) {
      setVendorStoreProfile(vendorProfile);
    }
  }, [vendorProfile, storeProfile, setVendorStoreProfile]);

  // Fetch only if we don't have a profile from server OR store
  useEffect(() => {
    if (!isInitialized && !vendorProfile && !storeProfile) {
      fetchProfile();
      setIsInitialized(true);
    }
  }, [isInitialized, fetchProfile, vendorProfile, storeProfile]);

  // Use effective profile
  const activeProfile = storeProfile || vendorProfile;

  if (!activeProfile && isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  const recentOrders = ordersData?.data ? ordersData.data.slice(0, 5) : [];
  const totalRevenue = vendorStats?.totalRevenue || 0;
  const avgOrderValue = vendorStats?.totalOrders ? totalRevenue / vendorStats.totalOrders : 0;
  const isPending = vendorProfile?.status === 'pending';
  const isSuspended = vendorProfile?.status === 'suspended';

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Banner Section */}
      {activeProfile?.storeBanner && (
        <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden mb-6 relative">
          <img
            src={activeProfile.storeBanner}
            alt="Store Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute bottom-6 left-6 flex items-end gap-6">
            {activeProfile.storeLogo && (
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                <img
                  src={activeProfile.storeLogo}
                  alt="Store Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="text-white pb-2">
              <Heading size="2xl" className="text-white mb-1 shadow-sm">
                {activeProfile.storeName}
              </Heading>
              {activeProfile.storeDescription && (
                <Text className="text-gray-100 line-clamp-1 text-sm opacity-90">
                  {activeProfile.storeDescription}
                </Text>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Heading size="2xl" className="mb-2 text-2xl">
              Welcome Back, {vendorProfile?.storeName || 'Vendor'}! 👋
            </Heading>
            <Text className="text-gray-600">
              Here's what's happening with your store today.
            </Text>
          </div>
          {(isPending || isSuspended) && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isRefreshing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
              title="Refresh status from database"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline text-sm">{isRefreshing ? 'Checking...' : 'Refresh Status'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Alerts */}
      {isPending && (
        <Card className="p-4 mb-6 bg-yellow-50 border border-yellow-200">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <Text className="font-semibold text-yellow-900 mb-1">Account Verification Required</Text>
              <Text className="text-sm text-yellow-700 mb-2">
                Your account is currently pending. Please visit your assigned verification point to get verified.
              </Text>


              {activeProfile?.fulfillmentPoint && (
                <VerificationPointInfo point={activeProfile.fulfillmentPoint} />
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <Text className="text-gray-500 text-sm font-medium mb-1">Total Revenue</Text>
              <Heading size="2xl" className="text-3xl font-bold text-gray-900">
                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Heading>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Coins className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="font-medium">+0%</span>
            <span className="text-gray-400 ml-1">from last month</span>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <Text className="text-gray-500 text-sm font-medium mb-1">Total Orders</Text>
              <Heading size="2xl" className="text-3xl font-bold text-gray-900">
                {vendorStats?.totalOrders || 0}
              </Heading>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>Last order: {recentOrders[0] ? new Date(recentOrders[0].createdAt).toLocaleDateString() : 'Never'}</span>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <Text className="text-gray-500 text-sm font-medium mb-1">Avg. Order Value</Text>
              <Heading size="2xl" className="text-3xl font-bold text-gray-900">
                ${avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Heading>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <Store className="w-4 h-4 mr-1" />
            <span>Store Performance</span>
          </div>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <Heading size="xl" className="text-xl">Recent Orders</Heading>
            <Link
              href="/dashboard/orders"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
            >
              View All <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <Card className="overflow-hidden border border-gray-100 shadow-sm">
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">#{order.id}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          ${Number(order.totalAmount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No orders yet</p>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions / Store Health */}
        <div>
          <Heading size="xl" className="text-xl mb-4">Quick Actions</Heading>
          <div className="space-y-4">
            <Link href="/dashboard/products/create">
              <Card className="p-4 hover:border-blue-400 transition-colors cursor-pointer group mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <Text className="font-semibold text-gray-900">Add New Product</Text>
                    <Text className="text-sm text-gray-500">Create a listing</Text>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 ml-auto transition-colors" />
                </div>
              </Card>
            </Link>

            <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Store className="w-6 h-6 text-blue-400" />
                <Heading size="lg" className="text-white">Store Health</Heading>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">Profile Status</span>
                  <span className={`font-medium ${activeProfile?.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {activeProfile?.status ? activeProfile.status.charAt(0).toUpperCase() + activeProfile.status.slice(1) : 'Unknown'}
                  </span>
                </div>
                {/* <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">Rating</span>
                  <div className="flex items-center text-yellow-400">
                    <span className="font-medium mr-1">4.8</span>
                    <span className="text-xs text-gray-500">(12 reviews)</span>
                  </div>
                </div> */}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerificationPointInfo({ point }: { point: any }) {
  if (!point) return null;

  return (
    <div className="mt-2 bg-white/50 p-3 rounded-md border border-yellow-200">
      <Text className="font-bold text-yellow-900 text-sm">Assigned Vet Office:</Text>
      <Text className="text-yellow-800 font-medium">{point.name}</Text>
      <Text className="text-sm text-yellow-700">{point.address}</Text>
      <Text className="text-sm text-yellow-700">{point.city}, {point.lga}</Text>
      {point.instructions && (
        <Text className="text-xs text-yellow-600 mt-1">Note: {point.instructions}</Text>
      )}
    </div>
  );
}
