'use client';

import { useEffect, useState } from 'react';
import { useVendorProfile } from '@/hooks/useVendorProfile';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Package,
  Calendar,
  BarChart3,
  RefreshCw,
} from 'lucide-react';

import { useVendorStore } from '@/store/vendorStore';

interface AnalyticsClientProps {
  vendorStats: any;
  ordersData: any;
  vendorProfile?: any; // Optional initial profile from server
}

export function AnalyticsClient({ vendorStats, ordersData, vendorProfile }: AnalyticsClientProps) {
  const { vendorProfile: storeProfile, isLoading, error, refreshProfile, fetchProfile } = useVendorProfile();
  const setVendorStoreProfile = useVendorStore(state => state.setVendorProfile);
  const [isInitialized, setIsInitialized] = useState(false);

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

  const orders = ordersData?.data || [];

  if (!activeProfile && isLoading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <span className="ml-2">Loading vendor profile...</span>
        </div>
      </div>
    );
  }

  if (error && !activeProfile) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          <Text className="font-medium">{error}</Text>
          <button
            onClick={() => refreshProfile()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if vendor is active - use the actual status from the store
  const isActive = activeProfile?.status === 'active';

  if (!isActive) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          <Text className="text-sm font-medium">Account Pending Approval</Text>
        </div>

        {/* Show vendor profile details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Vendor Profile</h2>
            <button
              onClick={() => refreshProfile()}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
              title="Refresh from database"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          <div className="space-y-2">
            <p><strong>Store Name:</strong> {activeProfile?.storeName || 'Not set'}</p>
            <p><strong>Business Name:</strong> {activeProfile?.businessName || 'Not set'}</p>
            <p><strong>Email:</strong> {activeProfile?.businessEmail || 'Not set'}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`px-2 py-1 rounded text-sm ${activeProfile?.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : activeProfile?.status === 'suspended'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}
              >
                {activeProfile?.status || 'Unknown'}
              </span>
            </p>
            <p><strong>Vendor ID:</strong> {activeProfile?.id || 'N/A'}</p>
            <p><strong>User ID:</strong> {activeProfile?.userId || 'N/A'}</p>
          </div>
        </div>

        <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">Analytics and reports will be available once your vendor account is approved by an administrator.</p>
        </div>
      </div>
    );
  }

  // Active vendor - show full analytics
  // Calculate order trends
  const now = new Date();
  const thisMonth = orders.filter((o: any) => {
    const orderDate = new Date(o.createdAt);
    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
  });

  const lastMonth = orders.filter((o: any) => {
    const orderDate = new Date(o.createdAt);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return orderDate.getMonth() === lastMonthDate.getMonth() && orderDate.getFullYear() === lastMonthDate.getFullYear();
  });

  const monthGrowth = lastMonth.length > 0
    ? ((thisMonth.length - lastMonth.length) / lastMonth.length * 100).toFixed(1)
    : '0';

  // Calculate revenue by status
  const revenueByStatus = {
    delivered: orders.filter((o: any) => o.status === 'delivered').reduce((sum: number, o: any) => sum + Number(o.totalAmount || 0), 0),
    processing: orders.filter((o: any) => o.status === 'processing').reduce((sum: number, o: any) => sum + Number(o.totalAmount || 0), 0),
    pending: orders.filter((o: any) => o.status === 'pending').reduce((sum: number, o: any) => sum + Number(o.totalAmount || 0), 0),
  };

  const avgOrderValue = orders.length > 0
    ? orders.reduce((sum: number, o: any) => sum + Number(o.totalAmount || 0), 0) / orders.length
    : 0;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <Heading size="xl" className="mb-2 text-lg sm:text-xl">Store Analytics</Heading>
        <Text className="text-slate-600 text-sm sm:text-base">Your store performance and insights</Text>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <Heading size="lg" className="mb-1 text-lg sm:text-xl">
            ${vendorStats?.totalRevenue?.toFixed(2) || '0.00'}
          </Heading>
          <Text className="text-xs sm:text-sm text-slate-500">Total Revenue</Text>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <div
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${Number(monthGrowth) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
            >
              {Number(monthGrowth) >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{Math.abs(Number(monthGrowth))}%</span>
            </div>
          </div>
          <Heading size="lg" className="mb-1 text-lg sm:text-xl">
            {orders.length}
          </Heading>
          <Text className="text-xs sm:text-sm text-slate-500">Total Orders</Text>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <Heading size="lg" className="mb-1 text-lg sm:text-xl">
            {vendorStats?.totalProducts || 0}
          </Heading>
          <Text className="text-xs sm:text-sm text-slate-500">Products</Text>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <Heading size="lg" className="mb-1 text-lg sm:text-xl">
            ${avgOrderValue.toFixed(2)}
          </Heading>
          <Text className="text-xs sm:text-sm text-slate-500">Avg Order Value</Text>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Revenue Breakdown */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <Heading size="md" className="text-base sm:text-lg">Revenue by Status</Heading>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Text className="text-xs sm:text-sm text-slate-600">Delivered</Text>
                <Text className="text-xs sm:text-sm font-medium">${revenueByStatus.delivered.toFixed(2)}</Text>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(revenueByStatus.delivered / (revenueByStatus.delivered + revenueByStatus.processing + revenueByStatus.pending || 1)) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Text className="text-xs sm:text-sm text-slate-600">Processing</Text>
                <Text className="text-xs sm:text-sm font-medium">${revenueByStatus.processing.toFixed(2)}</Text>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(revenueByStatus.processing / (revenueByStatus.delivered + revenueByStatus.processing + revenueByStatus.pending || 1)) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Text className="text-xs sm:text-sm text-slate-600">Pending</Text>
                <Text className="text-xs sm:text-sm font-medium">${revenueByStatus.pending.toFixed(2)}</Text>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(revenueByStatus.pending / (revenueByStatus.delivered + revenueByStatus.processing + revenueByStatus.pending || 1)) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Monthly Comparison */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-purple-600" />
            <Heading size="md" className="text-base sm:text-lg">Monthly Comparison</Heading>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Text className="text-xs sm:text-sm text-slate-600">This Month</Text>
                <Text className="text-lg sm:text-xl font-bold text-blue-600">{thisMonth.length}</Text>
              </div>
              <Text className="text-xs text-slate-500">Orders received this month</Text>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <Text className="text-xs sm:text-sm text-slate-600">Last Month</Text>
                <Text className="text-lg sm:text-xl font-bold text-slate-600">{lastMonth.length}</Text>
              </div>
              <Text className="text-xs text-slate-500">Orders received last month</Text>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <Text className="text-xs sm:text-sm font-medium">Order Growth</Text>
                <div className={`flex items-center gap-1 font-bold ${Number(monthGrowth) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {Number(monthGrowth) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-base sm:text-lg">{Math.abs(Number(monthGrowth))}%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
