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
              <Text className="font-semibold text-yellow-900 mb-1">Account Pending Approval</Text>
              <Text className="text-sm text-yellow-700">
                Your vendor account is under review. Full access will be granted once approved.
              </Text>
            </div>
          </div>
        </Card>
      )}

      {isSuspended && (
        <Card className="p-4 mb-6 bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <Text className="font-semibold text-red-900 mb-1">Account Suspended</Text>
              <Text className="text-sm text-red-700">Contact support for assistance.</Text>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      {vendorStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={<DollarSign className="w-6 h-6" />}
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Orders"
            value={vendorStats.totalOrders.toLocaleString()}
            icon={<ShoppingBag className="w-6 h-6" />}
            gradient="from-green-500 to-green-600"
          />
          <StatCard
            title="Total Products"
            value={vendorStats.totalProducts}
            icon={<Package className="w-6 h-6" />}
            gradient="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Avg Order Value"
            value={`$${avgOrderValue.toFixed(2)}`}
            icon={<Store className="w-6 h-6" />}
            gradient="from-orange-500 to-orange-600"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Heading size="lg">Recent Orders</Heading>
              <Link href="/dashboard/orders" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                View All <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Text className="font-medium">Order #{order.id}</Text>
                      <Text className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Text>
                    </div>
                    <div className="text-right">
                      <Text className="font-semibold">${order.totalAmount?.toFixed(2)}</Text>
                      <Text className="text-xs text-gray-500 capitalize">{order.status}</Text>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Text className="text-gray-500 text-center py-8">No orders yet</Text>
            )}
          </Card>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <Card className="p-6">
            <Heading size="md" className="mb-4">
              Quick Actions
            </Heading>
            <div className="space-y-3">
              <Link
                href="/dashboard/products"
                className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 font-medium text-sm"
              >
                Manage Products
              </Link>
              <Link
                href="/dashboard/settings"
                className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 font-medium text-sm"
              >
                Edit Profile
              </Link>
              <Link
                href="/dashboard/analytics"
                className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 font-medium text-sm"
              >
                View Analytics
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <Card className={`p-6 bg-gradient-to-br ${gradient} text-white`}>
      <div className="flex items-start justify-between mb-2">
        {icon}
        <TrendingUp className="w-5 h-5 opacity-50" />
      </div>
      <Heading size="lg" className="text-white mb-1">
        {value}
      </Heading>
      <Text className="text-white opacity-90 text-sm">{title}</Text>
    </Card>
  );
}
