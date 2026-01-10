import { fetchOrders } from '@/api/orders';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import Link from 'next/link';
import { Package, Calendar, DollarSign, TrendingUp } from 'lucide-react';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const orders = await fetchOrders();
  const statusFilter = searchParams.status || 'all';

  // Filter orders by status
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter((o: any) => o.status === statusFilter);

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o: any) => o.status === 'pending').length,
    processing: orders.filter((o: any) => o.status === 'processing').length,
    delivered: orders.filter((o: any) => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum: number, o: any) => sum + Number(o.totalAmount || 0), 0),
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <Heading size="xl" className="mb-2 text-lg sm:text-xl">Orders Management</Heading>
        <Text className="text-slate-600 text-sm sm:text-base">Track and manage all platform orders</Text>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-blue-600" />
            <Text className="text-xs text-slate-500">Total Orders</Text>
          </div>
          <Heading size="xl" className="text-lg sm:text-xl">{stats.total}</Heading>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-yellow-600" />
            <Text className="text-xs text-slate-500">Pending</Text>
          </div>
          <Heading size="xl" className="text-lg sm:text-xl">{stats.pending}</Heading>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <Text className="text-xs text-slate-500">Processing</Text>
          </div>
          <Heading size="xl" className="text-lg sm:text-xl">{stats.processing}</Heading>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <Text className="text-xs text-slate-500">Revenue</Text>
          </div>
          <Heading size="xl" className="text-sm sm:text-lg">${stats.totalRevenue.toFixed(2)}</Heading>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <Link href="/dashboard/orders">
          <span className={`px-3 py-2 rounded-md text-sm whitespace-nowrap ${
            statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'
          }`}>All ({stats.total})</span>
        </Link>
        <Link href="/dashboard/orders?status=pending">
          <span className={`px-3 py-2 rounded-md text-sm whitespace-nowrap ${
            statusFilter === 'pending' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'
          }`}>Pending ({stats.pending})</span>
        </Link>
        <Link href="/dashboard/orders?status=processing">
          <span className={`px-3 py-2 rounded-md text-sm whitespace-nowrap ${
            statusFilter === 'processing' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'
          }`}>Processing ({stats.processing})</span>
        </Link>
        <Link href="/dashboard/orders?status=delivered">
          <span className={`px-3 py-2 rounded-md text-sm whitespace-nowrap ${
            statusFilter === 'delivered' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'
          }`}>Delivered ({stats.delivered})</span>
        </Link>
      </div>

      {/* Orders List */}
      <Card className="overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10">
            <Package className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <Text className="text-slate-500">No orders found</Text>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-slate-600">Order ID</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-slate-600">Date</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-slate-600 hidden sm:table-cell">Customer</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-slate-600">Amount</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-slate-50">
                    <td className="p-3 sm:p-4 text-xs sm:text-sm font-medium">#{order.id}</td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm text-slate-600 hidden sm:table-cell">
                      User #{order.userId}
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm font-medium">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="p-3 sm:p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4">
                      <Link 
                        href={`/dashboard/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
