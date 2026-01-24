import type { Metadata } from 'next';
import StyledJsxRegistry from './registry';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { BottomNav } from '@/components/BottomNav';
import { CartProvider } from '@/context/CartContext';
import { UserRealTimeSync } from '@/components/UserRealTimeSync';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopLocal',
  description: 'Your local marketplace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <StyledJsxRegistry>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <GluestackUIProvider mode="dark">
              <CartProvider>
                <UserRealTimeSync />
                {children}
                <BottomNav />
              </CartProvider>
            </GluestackUIProvider>
          </ThemeProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
