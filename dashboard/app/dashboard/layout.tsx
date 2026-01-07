import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Text } from '@/components/ui/text';
import Link from 'next/link';
import {
  Icon,
  MenuIcon,
  MessageCircleIcon,
  StarIcon,
  ThreeDotsIcon,
} from '@/components/ui/icon';
// import { HomeIcon } from 'lucide-react-native';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const token = cookies().get('token')?.value;

  if (!token) {
    return redirect('/login');
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Box className="flex-1 overflow-y-auto bg-gray-100 p-2 sm:p-3 pb-20 md:pb-3">{children}</Box>
      </div>

      <MobileNavbar />
    </div>
  );
}

function Header() {
  return (
    <HStack className="p-3 sm:p-4 border-b justify-between items-center flex-shrink-0">
      <Heading className="text-lg sm:text-xl">Dashboard</Heading>

      <Avatar size="sm">
        <AvatarFallbackText>VS</AvatarFallbackText>
      </Avatar>
    </HStack>
  );
}

function Sidebar() {
  return (
    <VStack className="w-48 lg:w-56 p-4 lg:p-5 border-r gap-2 bg-white hidden md:flex flex-shrink-0">
      <Link href="/dashboard" className="w-full">
        <Text className="hover:text-blue-600 transition-colors py-2 px-3 rounded hover:bg-blue-50">Dashboard</Text>
      </Link>

      <Link href="/dashboard/products" className="w-full">
        <Text className="hover:text-blue-600 transition-colors py-2 px-3 rounded hover:bg-blue-50">Products</Text>
      </Link>

      <Link href="/dashboard/orders" className="w-full">
        <Text className="hover:text-blue-600 transition-colors py-2 px-3 rounded hover:bg-blue-50">Orders</Text>
      </Link>

      <Link href="/dashboard/vendors" className="w-full">
        <Text className="hover:text-blue-600 transition-colors py-2 px-3 rounded hover:bg-blue-50">Vendors</Text>
      </Link>
    </VStack>
  );
}

function MobileNavbar() {
  return (
    <HStack className="fixed bottom-0 left-0 right-0 p-4 border-t gap-4 bg-white justify-around md:hidden shadow-lg z-50">
      <Link href="/dashboard" className="flex flex-col items-center gap-1">
        <Icon as={MenuIcon} className="w-6 h-6" />
        <span className="text-xs">Home</span>
      </Link>

      <Link href="/dashboard/products" className="flex flex-col items-center gap-1">
        <Icon as={StarIcon} className="w-6 h-6" />
        <span className="text-xs">Products</span>
      </Link>

      <Link href="/dashboard/orders" className="flex flex-col items-center gap-1">
        <Icon as={ThreeDotsIcon} className="w-6 h-6" />
        <span className="text-xs">Orders</span>
      </Link>
      
      <Link href="/dashboard/vendors" className="flex flex-col items-center gap-1">
        <Icon as={MessageCircleIcon} className="w-6 h-6" />
        <span className="text-xs">Vendors</span>
      </Link>
    </HStack>
  );
}
