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
import { LayoutGrid, ShoppingBag, TrendingUp, Settings as SettingsIcon, Star } from 'lucide-react';
import { VendorProfileSync } from '@/components/VendorProfileSync';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

async function getVendorProfileServer() {
  try {
    const token = cookies().get('token')?.value;
    console.log('[LAYOUT] Token exists:', !!token);
    if (!token) return null;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    console.log('[LAYOUT] Fetching vendor profile from:', `${API_URL}/vendors/profile/me`);

    const res = await fetch(`${API_URL}/vendors/profile/me`, {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

    console.log('[LAYOUT] Response status:', res.status);

    if (!res.ok) {
      console.log('[LAYOUT] Response not OK, returning null');
      return null;
    }

    const profile = await res.json();
    console.log('[LAYOUT] Vendor profile FULL:', JSON.stringify(profile, null, 2));
    console.log('[LAYOUT] Vendor STATUS:', profile.status, 'Type:', typeof profile.status);

    return profile;
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

  console.log('[LAYOUT] Vendor profile result:', vendorProfile);
  console.log('[LAYOUT] Is Active:', isActive, '(status:', vendorProfile?.status, ')');

  return (
    <>
      <VendorProfileSync initialProfile={vendorProfile} />
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar isActive={isActive} />
          <Box className="flex-1 overflow-y-auto bg-gray-50 p-2 sm:p-4 pb-20 md:pb-4">{children}</Box>
        </div>

        <MobileNavbar isActive={isActive} />
      </div>
    </>
  );
}

function Header() {
  return (
    <HStack className="p-4 sm:p-5 border-b border-gray-200 justify-between items-center flex-shrink-0 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">V</span>
        </div>
        <Heading className="text-lg sm:text-xl font-bold text-gray-900">Vendor Hub</Heading>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <Text className="text-sm font-medium text-gray-900">Vendor Store</Text>
          <Text className="text-xs text-gray-500">Manage your business</Text>
        </div>
        <Link href="/dashboard/settings" className="hover:opacity-80 transition-opacity">
          <Avatar className="w-10 h-10 bg-blue-100 border-2 border-blue-200">
            <AvatarFallbackText className="text-blue-700 font-semibold">VH</AvatarFallbackText>
          </Avatar>
        </Link>
      </div>
    </HStack>
  );
}

function Sidebar({ isActive }: { isActive: boolean }) {
  const allMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid, alwaysShow: true },
    { href: '/dashboard/products', label: 'Products', icon: ShoppingBag, alwaysShow: false },
    { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag, alwaysShow: false },
    { href: '/dashboard/reviews', label: 'Reviews', icon: Star, alwaysShow: false },
    { href: '/dashboard/analytics', label: 'Analytics', icon: TrendingUp, alwaysShow: false },
  ];

  const menuItems = allMenuItems.filter(item => item.alwaysShow || isActive);

  return (
    <VStack className="w-56 p-5 border-r border-gray-200 gap-1 bg-white hidden md:flex flex-shrink-0">
      <div className="mb-4">
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Menu</Text>
      </div>

      {menuItems.map((item) => (
        <Link key={item.href} href={item.href} className="w-full">
          <Text className="hover:text-blue-600 hover:bg-blue-50 transition-colors py-3 px-3 rounded-lg font-medium text-gray-700">
            {item.label}
          </Text>
        </Link>
      ))}


    </VStack>
  );
}

function MobileNavbar({ isActive }: { isActive: boolean }) {
  return (
    <HStack className="fixed bottom-0 left-0 right-0 p-3 border-t border-gray-200 gap-2 bg-white justify-around md:hidden shadow-xl z-50">
      <Link href="/dashboard" className="flex flex-col items-center gap-1 flex-1">
        <Icon as={LayoutGrid} className="w-5 h-5 text-gray-600" />
        <span className="text-xs text-gray-600 font-medium">Home</span>
      </Link>

      {isActive && (
        <>
          <Link href="/dashboard/products" className="flex flex-col items-center gap-1 flex-1">
            <Icon as={ShoppingBag} className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">Products</span>
          </Link>

          <Link href="/dashboard/orders" className="flex flex-col items-center gap-1 flex-1">
            <Icon as={ShoppingBag} className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">Orders</span>
          </Link>

          <Link href="/dashboard/reviews" className="flex flex-col items-center gap-1 flex-1">
            <Icon as={Star} className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">Reviews</span>
          </Link>

          <Link href="/dashboard/analytics" className="flex flex-col items-center gap-1 flex-1">
            <Icon as={TrendingUp} className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600 font-medium">Analytics</span>
          </Link>
        </>
      )}
    </HStack>
  );
}
