import { fetchVendorOrders } from '@/api/orders';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import Link from 'next/link';
import { Package, Calendar, DollarSign, TrendingUp, Search, Filter, ArrowRight } from 'lucide-react';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const ordersData = await fetchVendorOrders();
  const orders = ordersData?.data || [];
  const statusFilter = searchParams.status || 'all';

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((o: any) => o.status === statusFilter);

  const stats = {
    total: orders.length,
    pending: orders.filter((o: any) => o.status === 'pending').length,
    processing: orders.filter((o: any) => o.status === 'processing').length,
    delivered: orders.filter((o: any) => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum: number, o: any) => sum + Number(o.totalAmount || 0), 0),
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <Text className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Operations</Text>
          </div>
          <Heading className="text-3xl font-black tracking-tight text-foreground">Order Hub</Heading>
          <Text className="text-muted-foreground font-medium">Manage and fulfill your customer orders.</Text>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Find an order ID..."
              className="pl-11 pr-4 py-3 bg-secondary/50 border border-border/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Volume', value: stats.total, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Pending', value: stats.pending, icon: Calendar, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Fulfilling', value: stats.processing, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Net Sales', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
        ].map((item, i) => (
          <div key={i} className="bg-card p-6 rounded-[2rem] border border-border hover:shadow-lg transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 ${item.bg} rounded-xl group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{item.label}</Text>
            </div>
            <Heading className="text-2xl font-black text-foreground tracking-tight">{item.value}</Heading>
          </div>
        ))}
      </div>

      {/* Filter Tabs & Content */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-secondary/30 p-2 rounded-[2rem] border border-border/50">
          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            {[
              { id: 'all', label: 'All Orders', count: stats.total },
              { id: 'pending', label: 'Pending', count: stats.pending },
              { id: 'processing', label: 'Processing', count: stats.processing },
              { id: 'delivered', label: 'Delivered', count: stats.delivered },
            ].map((tab) => (
              <Link key={tab.id} href={tab.id === 'all' ? '/dashboard/orders' : `/dashboard/orders?status=${tab.id}`} className="flex-shrink-0">
                <div className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${statusFilter === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}>
                  {tab.label} <span className="ml-1 opacity-50">[{tab.count}]</span>
                </div>
              </Link>
            ))}
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-card border border-border rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
            <Filter className="w-3.5 h-3.5" /> More Filters
          </button>
        </div>

        <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
          {filteredOrders.length === 0 ? (
            <div className="py-24 flex flex-col items-center text-center px-6">
              <div className="w-20 h-20 bg-secondary rounded-[2.5rem] flex items-center justify-center mb-6">
                <Package className="w-10 h-10 text-muted-foreground opacity-20" />
              </div>
              <Text className="text-lg font-black text-foreground mb-1">No Orders Found</Text>
              <Text className="text-sm text-muted-foreground font-medium max-w-xs">We couldn't find any orders matching your current criteria.</Text>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Order Identifier</th>
                    <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Received On</th>
                    <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fulfillment</th>
                    <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Order Value</th>
                    <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-secondary/20 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <Text className="font-black text-foreground text-sm group-hover:text-primary transition-colors">#{order.id}</Text>
                          <Text className="text-[10px] text-muted-foreground uppercase font-medium tracking-tighter">Customer ID: {order.userId}</Text>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Text className="text-xs font-bold text-muted-foreground">{new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}</Text>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full border ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                              'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          }`}>
                          <Text className="text-[10px] font-black uppercase tracking-tighter">{order.status}</Text>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Text className="font-black text-foreground text-sm">₦{Number(order.totalAmount || 0).toLocaleString()}</Text>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 shadow-sm"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
