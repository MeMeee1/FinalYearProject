import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Text } from '@/components/ui/text';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { LayoutGrid, ShoppingBag, TrendingUp, Settings as SettingsIcon, Star, Bell, LogOut, Scale } from 'lucide-react';
import { VendorProfileSync } from '@/components/VendorProfileSync';
import { VendorRealTimeSync } from '@/components/VendorRealTimeSync';
import { ThemeToggle } from '@/components/ThemeToggle';
import LogoutButton from './LogoutButton';

// Force dynamic rendering - this layout uses cookies for authentication
export const dynamic = 'force-dynamic';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

async function getVendorProfileServer() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return null;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${API_URL}/vendors/profile/me`, {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('[LAYOUT] Error fetching vendor profile:', error);
    return null;
  }
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const token = cookies().get('token')?.value;

  if (!token) {
    return redirect('/login');
  }

  const vendorProfile = await getVendorProfileServer();
  const isActive = vendorProfile?.status === 'active';

  return (
    <>
      <VendorProfileSync initialProfile={vendorProfile} />
      <VendorRealTimeSync />
      <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground">
        {/* Header */}
        <Header vendorProfile={vendorProfile} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar isActive={isActive} />
          <Box className="flex-1 overflow-y-auto bg-background/50 p-2 sm:p-6 pb-20 md:pb-6">{children}</Box>
        </div>

        <MobileNavbar isActive={isActive} />
      </div>
    </>
  );
}

function Header({ vendorProfile }: { vendorProfile: any }) {
  return (
    <header className="h-20 px-4 sm:px-8 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
          <Icon as={ShoppingBag} className="text-primary-foreground w-6 h-6 -rotate-3" />
        </div>
        <div className="flex flex-col">
          <Heading className="text-xl font-bold tracking-tight text-foreground leading-none mb-1">Vendor Hub</Heading>
          <Text className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Premium Dashboard</Text>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-2xl border border-border/50">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live System</Text>
        </div>

        <div className="flex items-center gap-2 px-1 border-x border-border/50 hidden sm:flex">
          <button className="p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 pl-2">
          <div className="hidden md:flex flex-col items-end">
            <Text className="text-sm font-bold text-foreground leading-none mb-1">{vendorProfile?.storeName || 'Vendor'}</Text>
            <Text className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Verified Merchant</Text>
          </div>
          <Link href="/dashboard/settings" className="transition-all hover:scale-105 active:scale-95">
            <Avatar className="w-11 h-11 bg-primary/10 border-2 border-primary/20 p-0.5 rounded-2xl">
              <AvatarFallbackText className="text-primary font-bold">{vendorProfile?.storeName?.[0] || 'V'}</AvatarFallbackText>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Sidebar({ isActive }: { isActive: boolean }) {
  const allMenuItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutGrid, alwaysShow: true },
    { href: '/dashboard/products', label: 'Products', icon: ShoppingBag, alwaysShow: false },
    { href: '/dashboard/orders', label: 'Order Hub', icon: ShoppingBag, alwaysShow: false },
    { href: '/dashboard/analytics', label: 'Analytics', icon: TrendingUp, alwaysShow: false },
    { href: '/dashboard/rules', label: 'Guidelines', icon: Scale, alwaysShow: true },
    { href: '/dashboard/settings', label: 'Account', icon: SettingsIcon, alwaysShow: true },
  ];

  const menuItems = allMenuItems.filter(item => item.alwaysShow || isActive);

  return (
    <aside className="w-72 p-6 border-r border-border bg-card hidden md:flex flex-col flex-shrink-0">
      <div className="space-y-8">
        <div>
          <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-4 mb-6 opacity-50">Main Navigation</Text>
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} className="block group">
                <HStack className="hover:bg-primary/10 hover:translate-x-1 transition-all py-3.5 px-4 rounded-2xl items-center gap-4 relative overflow-hidden group-active:scale-95">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary absolute -left-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Icon
                    as={item.icon}
                    className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                  />
                  <Text className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors tracking-tight">
                    {item.label}
                  </Text>
                </HStack>
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-8 border-t border-border/30">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-5 rounded-3xl border border-primary/20">
            <Text className="block text-xs font-black text-primary uppercase tracking-wider mb-2">
              Vendor Support
            </Text>

            <Text className="block text-[11px] text-muted-foreground font-medium mb-4 leading-relaxed">
              Need help managing your store or products?
            </Text>

            <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
              Contact Center
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 space-y-4">
        <LogoutButton variant="sidebar" />
        <Text className="text-[10px] text-muted-foreground/50 font-medium text-center tracking-tight">
          Final Year Project v1.0
        </Text>
      </div>
    </aside>
  );
}

function MobileNavbar({ isActive }: { isActive: boolean }) {
  const mobileItems = [
    { href: '/dashboard', label: 'Home', icon: LayoutGrid, alwaysShow: true },
    { href: '/dashboard/products', label: 'Items', icon: ShoppingBag, alwaysShow: false },
    { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag, alwaysShow: false },
    { href: '/dashboard/settings', label: 'More', icon: SettingsIcon, alwaysShow: true },
  ];

  const menuItems = mobileItems.filter(item => item.alwaysShow || isActive);

  return (
    <nav className="fixed bottom-0 left-0 right-0 p-4 border-t border-border bg-card/90 backdrop-blur-xl flex justify-around md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50 rounded-t-[2.5rem]">
      {menuItems.map((item) => (
        <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1.5 py-1 px-4 rounded-2xl active:bg-secondary transition-all">
          <Icon as={item.icon} className="w-5 h-5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
