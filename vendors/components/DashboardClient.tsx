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
  MoreVertical,
  Activity,
  ChevronRight
} from 'lucide-react';
import { useVendorStore } from '@/store/vendorStore';
import { useRouter } from 'next/navigation';
import { SettingsIcon, Star } from 'lucide-react';
interface DashboardClientProps {
  vendorStats: any;
  ordersData: any;
  vendorProfile?: any;
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
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (vendorProfile && !storeProfile) {
      setVendorStoreProfile(vendorProfile);
    }
  }, [vendorProfile, storeProfile, setVendorStoreProfile]);

  useEffect(() => {
    if (!isInitialized && !vendorProfile && !storeProfile) {
      fetchProfile();
      setIsInitialized(true);
    }
  }, [isInitialized, fetchProfile, vendorProfile, storeProfile]);

  const activeProfile = storeProfile || vendorProfile;

  if (!activeProfile && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <Text className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Synchronizing Dashboard...</Text>
      </div>
    );
  }

  const recentOrders = ordersData?.data ? ordersData.data.slice(0, 5) : [];
  const totalRevenue = vendorStats?.totalRevenue || 0;
  const avgOrderValue = vendorStats?.totalOrders ? totalRevenue / vendorStats.totalOrders : 0;
  const isPending = activeProfile?.status === 'pending';
  const isSuspended = activeProfile?.status === 'suspended';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <Text className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Dashboard Overview</Text>
          </div>
          <Heading className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Welcome back, <span className="text-primary">{activeProfile?.storeName || 'Vendor'}</span>
          </Heading>
          <Text className="text-muted-foreground font-medium text-sm sm:text-base">
            Your business performance at a glance.
          </Text>
        </div>

        <div className="flex items-center gap-3">
          {(isPending || isSuspended) && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl font-bold text-sm transition-all active:scale-95 border border-border/50 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Syncing...' : 'Sync Status'}
            </button>
          )}
          <Link href="/dashboard/products/create" className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
            <Package className="w-4 h-4" />
            Create Listing
          </Link>
        </div>
      </div>

      {/* Status Alerts */}
      {isPending && (
        <div className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 mb-10 group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Clock className="w-24 h-24 text-yellow-500" />
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-4 relative z-10">
            <div className="p-3 bg-yellow-500 rounded-2xl shadow-lg shadow-yellow-500/20">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <Text className="text-lg font-black text-foreground mb-1">Account Awaiting Verification</Text>
              <Text className="text-sm text-muted-foreground font-medium max-w-2xl mb-4">
                Your profile is currently being reviewed. To expedite the process, please visit your assigned fulfillment center with your documents.
              </Text>
              {activeProfile?.fulfillmentPoint && (
                <div className="bg-card/50 backdrop-blur-sm p-5 rounded-2xl border border-border/50 inline-block">
                  <Text className="text-xs font-black text-primary uppercase tracking-wider mb-2">Visit Location:</Text>
                  <Text className="font-bold text-foreground mb-0.5">{activeProfile.fulfillmentPoint.name}</Text>
                  <Text className="text-xs text-muted-foreground font-medium">{activeProfile.fulfillmentPoint.address}, {activeProfile.fulfillmentPoint.lga}</Text>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          {
            label: 'Net Revenue',
            value: `₦${totalRevenue.toLocaleString()}`,
            icon: Coins,
            color: 'text-primary',
            trend: '+12.5%',
            bg: 'bg-primary/10'
          },
          {
            label: 'Total Orders',
            value: vendorStats?.totalOrders || 0,
            icon: ShoppingBag,
            color: 'text-blue-500',
            trend: '+5.2%',
            bg: 'bg-blue-500/10'
          },
          {
            label: 'Avg. Order',
            value: `₦${avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            icon: TrendingUp,
            color: 'text-purple-500',
            trend: '+2.1%',
            bg: 'bg-purple-500/10'
          }
        ].map((stat, i) => (
          <div key={i} className="bg-card p-8 rounded-[2rem] border border-border transition-all hover:shadow-xl hover:shadow-primary/5 group relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-2">
                <Text className="text-muted-foreground text-xs font-black uppercase tracking-widest opacity-60">{stat.label}</Text>
                <Heading className="text-3xl font-black text-foreground tracking-tight">{stat.value}</Heading>
              </div>
              <div className={`p-4 ${stat.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 relative z-10">
              <div className="px-2 py-0.5 bg-green-500/10 rounded-full flex items-center">
                <Text className="text-[10px] font-black text-green-500 uppercase">{stat.trend}</Text>
              </div>
              <Text className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Vs last month</Text>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              <Heading className="text-xl font-black text-foreground">Recent Transactions</Heading>
            </div>
            <Link href="/dashboard/orders" className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
              View History <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Order ID</th>
                      <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date</th>
                      <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                      <th className="px-8 py-6 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {recentOrders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-secondary/30 transition-colors group">
                        <td className="px-8 py-6">
                          <Text className="font-black text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">#{order.id}</Text>
                        </td>
                        <td className="px-8 py-6">
                          <Text className="text-xs font-bold text-muted-foreground">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full border ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            order.status === 'processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                              'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            }`}>
                            <Text className="text-[10px] font-black uppercase tracking-tighter">{order.status}</Text>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Text className="font-black text-foreground text-sm">₦{Number(order.totalAmount).toLocaleString()}</Text>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center mb-6">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-20" />
                </div>
                <Text className="text-lg font-black text-foreground mb-1">Queue is Empty</Text>
                <Text className="text-sm text-muted-foreground font-medium max-w-xs">Waiting for your first customers to place their orders.</Text>
              </div>
            )}
          </div>
        </div>

        {/* Side Actions */}
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              <Heading className="text-xl font-black text-foreground">Health Scan</Heading>
            </div>

            <div className="bg-gradient-to-br from-foreground to-foreground/80 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                <Store className="w-48 h-48 text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <Text className="text-sm font-black text-white uppercase tracking-widest">Store Vitality</Text>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <Text className="text-xs font-bold text-white/60 uppercase tracking-widest">Profile Status</Text>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${activeProfile?.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                      <Text className={`text-sm font-black capitalize ${activeProfile?.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {activeProfile?.status || 'Unknown'}
                      </Text>
                    </div>
                  </div>

                  {/* <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <Text className="text-xs font-bold text-white/60 uppercase tracking-widest">Products</Text>
                    <Text className="text-sm font-black text-white">128 Listings</Text>
                  </div> */}

                  {/* <div className="flex justify-between items-end">
                    <Text className="text-xs font-bold text-white/60 uppercase tracking-widest">Rating</Text>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <Text className="text-xs font-black text-white">4.9</Text>
                    </div>
                  </div> */}
                </div>

                <button className="w-full mt-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all active:translate-y-0">
                  Full Analytics Report
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/dashboard/settings" className="block p-2">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-secondary group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <SettingsIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1">
                  <Text className="text-sm font-black text-foreground group-hover:text-primary transition-colors">Business Settings</Text>
                  <Text className="text-xs text-muted-foreground font-medium">Update store details</Text>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
