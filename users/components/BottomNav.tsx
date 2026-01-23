'use client';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { HomeIcon, SearchIcon, ShoppingBagIcon, PackageIcon, UserIcon } from 'lucide-react-native';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const NAV_ITEMS = [
    { label: 'Feed', icon: HomeIcon, href: '/' },
    { label: 'Market', icon: SearchIcon, href: '/products' },
    { label: 'Manifest', icon: ShoppingBagIcon, href: '/cart' },
    { label: 'Records', icon: PackageIcon, href: '/orders' },
    { label: 'Node', icon: ProfileLink() ? '/profile' : '/profile' } // Profile href
];

function ProfileLink() {
    return '/profile';
}

export function BottomNav() {
    const pathname = usePathname();
    const { itemCount } = useCart();

    // Hide BottomNav on certain pages where it might interfere with actions
    const hideOnPaths = ['/checkout', '/payment', '/product/'];
    if (hideOnPaths.some(path => pathname.startsWith(path))) {
        return null;
    }

    // Also hide on auth pages
    if (pathname.includes('/login') || pathname.includes('/signup')) {
        return null;
    }

    const items = [
        { label: 'Home', icon: HomeIcon, href: '/' },
        { label: 'Explore', icon: SearchIcon, href: '/products' },
        { label: 'Cart', icon: ShoppingBagIcon, href: '/cart' },
        { label: 'Orders', icon: PackageIcon, href: '/orders' },
        { label: 'Profile', icon: UserIcon, href: '/profile' }
    ];

    return (
        <Box className="fixed bottom-4 left-6 right-6 z-[300]">
            <Box className="bg-background/20 backdrop-blur-3xl border border-border/40 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                <HStack className="justify-around items-center px-4 py-3">
                    {items.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link href={item.href} key={item.label} passHref legacyBehavior>
                                <Box className="items-center py-2 px-4 cursor-pointer group transition-all">
                                    <Box className={`mb-1 p-2 rounded-2xl transition-all relative ${isActive ? 'bg-primary shadow-lg shadow-primary/20 scale-110' : 'group-hover:bg-secondary/40'}`}>
                                        <Icon size={20} color={isActive ? "black" : "hsl(var(--muted-foreground))"} />

                                        {item.label === 'Cart' && itemCount > 0 && (
                                            <Box className="absolute -top-1 -right-1 bg-primary w-5 h-5 rounded-full items-center justify-center border-2 border-background shadow-lg">
                                                <Text className="text-[9px] font-black text-black leading-none">
                                                    {itemCount > 99 ? '99+' : itemCount}
                                                </Text>
                                            </Box>
                                        )}
                                    </Box>
                                    <Text className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-muted-foreground/60'}`}>
                                        {item.label}
                                    </Text>
                                    {isActive && (
                                        <Box className="w-1 h-1 bg-primary rounded-full mt-1" />
                                    )}
                                </Box>
                            </Link>
                        );
                    })}
                </HStack>
            </Box>
        </Box>
    );
}
