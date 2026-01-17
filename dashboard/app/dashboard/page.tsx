import { getPlatformStats } from '@/api/vendors';
import { fetchOrders } from '@/api/orders';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Store
} from 'lucide-react';
import GlobalCommissionForm from './GlobalCommissionForm';

export default async function DashboardPage() {
  const [stats, orders] = await Promise.all([
    getPlatformStats().catch(() => null),
    fetchOrders().catch(() => []),
  ]);

  // Calculate some metrics
  const recentOrders = Array.isArray(orders) ? orders.slice(0, 5) : [];
  const totalRevenue = stats?.totalPlatformRevenue || 0;
  const avgOrderValue = stats?.totalOrders ? (totalRevenue / stats.totalOrders) : 0;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
      {/* Welcome Section */}
      <div className="mb-4 sm:mb-6">
        <Heading size="2xl" className="mb-2 text-xl sm:text-2xl">Welcome Back! 👋</Heading>
        <Text className="text-slate-600 text-sm sm:text-base">Here's what's happening with your platform today.</Text>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Total Revenue */}
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm bg-white/20 px-2 py-1 rounded">
                <TrendingUp className="w-3 h-3" />
                <span>12%</span>
              </div>
            </div>
            <Heading size="xl" className="text-white mb-1 text-lg sm:text-xl">
              ${totalRevenue.toFixed(2)}
            </Heading>
            <Text className="text-blue-100 text-xs sm:text-sm">Platform Revenue</Text>
          </Card>

          {/* Total Orders */}
          <Card className="p-5 bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
                <TrendingUp className="w-3 h-3" />
                <span>8%</span>
              </div>
            </div>
            <Heading size="xl" className="text-white mb-1">
              {stats.totalOrders.toLocaleString()}
            </Heading>
            <Text className="text-green-100 text-sm">Total Orders</Text>
          </Card>

          {/* Total Vendors */}
          <Card className="p-5 bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Store className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
                <span className="text-xs">{stats.activeVendors}/{stats.totalVendors}</span>
              </div>
            </div>
            <Heading size="xl" className="text-white mb-1">
              {stats.totalVendors}
            </Heading>
            <Text className="text-purple-100 text-sm">Total Vendors</Text>
          </Card>

          {/* Avg Order Value */}
          <Card className="p-5 bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
                <TrendingUp className="w-3 h-3" />
                <span>5%</span>
              </div>
            </div>
            <Heading size="xl" className="text-white mb-1">
              ${avgOrderValue.toFixed(2)}
            </Heading>
            <Text className="text-orange-100 text-sm">Avg Order Value</Text>
          </Card>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Orders - Takes 2 columns */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Heading size="lg" className="mb-1">Recent Orders</Heading>
              <Text className="text-sm text-slate-500">Latest transactions from your platform</Text>
            </div>
            <Link href="/dashboard/orders" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <Text>No orders yet</Text>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Text className="font-medium text-sm">Order #{order.id}</Text>
                          <span className={`text-xs px-2 py-0.5 rounded ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                            {order.status}
                          </span>
                        </div>
                        <Text className="text-xs text-slate-500 truncate">
                          {new Date(order.createdAt).toLocaleString()}
                        </Text>
                      </div>
                    </div>
                    <div className="text-right">
                      <Text className="font-semibold text-sm">${Number(order.totalAmount || 0).toFixed(2)}</Text>
                      <Text className="text-xs text-slate-500">Total</Text>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions - Takes 1 column */}
        <Card className="p-5">
          <Heading size="lg" className="mb-4">Quick Actions</Heading>

          <div className="space-y-3">
            <Link href="/dashboard/vendors?status=pending">
              <div className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  {stats && (
                    <span className="text-xl font-bold text-yellow-700">
                      {stats.pendingVendors}
                    </span>
                  )}
                </div>
                <Text className="text-sm font-medium text-yellow-800">Pending Vendors</Text>
                <Text className="text-xs text-yellow-600 mt-1">Review applications</Text>
              </div>
            </Link>

            <Link href="/dashboard/products">
              <div className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <ArrowUpRight className="w-4 h-4 text-blue-600" />
                </div>
                <Text className="text-sm font-medium text-blue-800">Manage Products</Text>
                <Text className="text-xs text-blue-600 mt-1">Browse by vendor</Text>
              </div>
            </Link>

            <Link href="/dashboard/vendors">
              <div className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  {stats && (
                    <span className="text-xl font-bold text-purple-700">
                      {stats.activeVendors}
                    </span>
                  )}
                </div>
                <Text className="text-sm font-medium text-purple-800">Active Vendors</Text>
                <Text className="text-xs text-purple-600 mt-1">View all vendors</Text>
              </div>
            </Link>

            <Link href="/dashboard/orders">
              <div className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <ShoppingBag className="w-5 h-5 text-green-600" />
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                </div>
                <Text className="text-sm font-medium text-green-800">View Orders</Text>
                <Text className="text-xs text-green-600 mt-1">All transactions</Text>
              </div>
            </Link>
          </div>
        </Card>
      </div>

      {/* Vendor Status Overview */}
      {stats && (
        <Card className="p-5 mb-8">
          <Heading size="lg" className="mb-4">Vendor Overview</Heading>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <Text className="text-sm font-medium text-green-700">Active</Text>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <Heading size="xl" className="text-green-800 mb-1">{stats.activeVendors}</Heading>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.activeVendors / stats.totalVendors) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <Text className="text-sm font-medium text-yellow-700">Pending</Text>
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <Heading size="xl" className="text-yellow-800 mb-1">{stats.pendingVendors}</Heading>
              <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.pendingVendors / stats.totalVendors) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <Text className="text-sm font-medium text-red-700">Suspended</Text>
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              </div>
              <Heading size="xl" className="text-red-800 mb-1">{stats.suspendedVendors || 0}</Heading>
              <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all"
                  style={{ width: `${((stats.suspendedVendors || 0) / stats.totalVendors) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Global Settings */}
      <GlobalCommissionForm />
    </div>
  );
}
