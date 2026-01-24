import { getPlatformStats, listActiveVendors } from '@/api/vendors';
import { fetchOrders } from '@/api/orders';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Calendar,
  BarChart3
} from 'lucide-react';

export default async function AnalyticsPage() {
  const [stats, ordersResponse, vendorsResponse] = await Promise.all([
    getPlatformStats().catch(() => null),
    fetchOrders().catch(() => []),
    listActiveVendors(1, 100).catch(() => ({ data: [] })),
  ]);

  const orders = Array.isArray(ordersResponse) ? ordersResponse : (ordersResponse as any)?.data || [];
  const vendors = vendorsResponse?.data || [];

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

  // Top vendors by order count (mock - would need real vendor data)
  const avgOrderValue = orders.length > 0
    ? orders.reduce((sum: number, o: any) => sum + Number(o.totalAmount || 0), 0) / orders.length
    : 0;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <Heading size="xl" className="mb-2 text-lg sm:text-xl">Analytics & Reports</Heading>
        <Text className="text-slate-600 text-sm sm:text-base">Platform performance and insights</Text>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              <TrendingUp className="w-3 h-3" />
              <span>12%</span>
            </div>
          </div>
          <Heading size="lg" className="mb-1 text-lg sm:text-xl">
            ${stats?.totalPlatformRevenue?.toFixed(2) || '0.00'}
          </Heading>
          <Text className="text-xs sm:text-sm text-slate-500">Total Revenue</Text>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${Number(monthGrowth) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
              {Number(monthGrowth) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(Number(monthGrowth))}%</span>
            </div>
          </div>
          <Heading size="lg" className="mb-1 text-lg sm:text-xl">{orders.length}</Heading>
          <Text className="text-xs sm:text-sm text-slate-500">Total Orders</Text>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-xs text-slate-500">
              {stats?.activeVendors}/{stats?.totalVendors}
            </div>
          </div>
          <Heading size="lg" className="mb-1 text-lg sm:text-xl">{stats?.totalVendors || 0}</Heading>
          <Text className="text-xs sm:text-sm text-slate-500">Vendors</Text>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              <TrendingUp className="w-3 h-3" />
              <span>5%</span>
            </div>
          </div>
          <Heading size="lg" className="mb-1 text-lg sm:text-xl">${avgOrderValue.toFixed(2)}</Heading>
          <Text className="text-xs sm:text-sm text-slate-500">Avg Order Value</Text>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">


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

            {/* <div className="border-t pt-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <Text className="text-xs sm:text-sm font-medium">Growth</Text>
                <div className={`flex items-center gap-1 font-bold ${Number(monthGrowth) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {Number(monthGrowth) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-base sm:text-lg">{Math.abs(Number(monthGrowth))}%</span>
                </div>
              </div>
            </div> */}
          </div>
        </Card>
      </div>

      {/* Vendor Performance */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Heading size="md" className="mb-1 text-base sm:text-lg">Vendor Overview</Heading>
            <Text className="text-xs sm:text-sm text-slate-500">Platform vendor statistics</Text>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
            <Text className="text-xs sm:text-sm font-medium text-green-700 mb-1">Active</Text>
            <Heading size="xl" className="text-green-800 text-lg sm:text-xl">{stats?.activeVendors || 0}</Heading>
          </div>
          <div className="p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <Text className="text-xs sm:text-sm font-medium text-yellow-700 mb-1">Pending</Text>
            <Heading size="xl" className="text-yellow-800 text-lg sm:text-xl">{stats?.pendingVendors || 0}</Heading>
          </div>
          <div className="p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
            <Text className="text-xs sm:text-sm font-medium text-red-700 mb-1">Suspended</Text>
            <Heading size="xl" className="text-red-800 text-lg sm:text-xl">{stats?.suspendedVendors || 0}</Heading>
          </div>
          <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Text className="text-xs sm:text-sm font-medium text-blue-700 mb-1">Total</Text>
            <Heading size="xl" className="text-blue-800 text-lg sm:text-xl">{stats?.totalVendors || 0}</Heading>
          </div>
        </div>
      </Card>
    </div>
  );
}
