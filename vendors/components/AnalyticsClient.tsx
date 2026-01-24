'use client';

import { useEffect, useState } from 'react';
import { useVendorProfile } from '@/hooks/useVendorProfile';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Package,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { useVendorStore } from '@/store/vendorStore';

interface AnalyticsClientProps {
  vendorStats: any;
  ordersData: any;
  vendorProfile?: any;
}

export function AnalyticsClient({ vendorStats, ordersData, vendorProfile }: AnalyticsClientProps) {
  const { vendorProfile: storeProfile, isLoading, error, refreshProfile, fetchProfile } = useVendorProfile();
  const setVendorStoreProfile = useVendorStore(state => state.setVendorProfile);
  const [isInitialized, setIsInitialized] = useState(false);

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
  const orders = ordersData?.data || [];

  if (!activeProfile && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <Text className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Compiling Analytics...</Text>
      </div>
    );
  }

  const isActive = activeProfile?.status === 'active';

  if (!isActive) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-card border border-border rounded-[2.5rem] p-10 text-center space-y-6 shadow-xl shadow-primary/5">
          <div className="w-24 h-24 bg-secondary rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-12 h-12 text-muted-foreground opacity-20" />
          </div>
          <Heading className="text-2xl font-black text-foreground">Analytics Unavailable</Heading>
          <Text className="text-muted-foreground font-medium max-w-md mx-auto">
            Deep insights and performance reports will be activated once your vendor account is officially approved.
          </Text>
          <div className="pt-6">
            <button onClick={() => refreshProfile()} className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-black text-sm shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              Refresh Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  const now = new Date();
  const thisMonth = orders.filter((o: any) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const lastMonth = orders.filter((o: any) => {
    const d = new Date(o.createdAt);
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getMonth() === last.getMonth() && d.getFullYear() === last.getFullYear();
  });

  const monthGrowth = lastMonth.length > 0
    ? ((thisMonth.length - lastMonth.length) / lastMonth.length * 100).toFixed(1)
    : '0';


  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <Text className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Insights</Text>
          </div>
          <Heading className="text-3xl font-black tracking-tight text-foreground">Market Logic</Heading>
          <Text className="text-muted-foreground font-medium">Deep dive into your store's commercial performance.</Text>
        </div>

        <div className="flex bg-secondary/50 p-1.5 rounded-2xl border border-border/50">
          <button className="px-6 py-2 bg-card text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">Real-time</button>
          <button className="px-6 py-2 text-muted-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-foreground">Last 30 Days</button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Gross Sales', value: `₦${Number(vendorStats?.totalGrossRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Net Earnings', value: `₦${Number(vendorStats?.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Order Volume', value: orders.length, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: monthGrowth },
        ].map((item, i) => (
          <div key={i} className="bg-card p-8 rounded-[2rem] border border-border group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 ${item.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              {item.trend && (
                <div className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${Number(item.trend) >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {Number(item.trend) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <Text className="text-[10px] font-black">{Math.abs(Number(item.trend))}%</Text>
                </div>
              )}
            </div>
            <Heading className="text-2xl font-black text-foreground tracking-tight mb-1">{item.value}</Heading>
            <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{item.label}</Text>
          </div>
        ))}
      </div>

    </div>
  );
}
