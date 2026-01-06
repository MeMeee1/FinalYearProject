import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { ShoppingBagIcon } from 'lucide-react'; // Only keeping ShoppingBagIcon as it's used

import { Icon } from '@/components/ui/icon';

interface Product {
  id: string;
  name: string;
  image: string;
  price: string | number;
  stock: number;
  vendor?: {
    storeName: string;
  };
}

export default function ProductListItem({ product }: { product: Product }) {
  return (
    <Link href={`/dashboard/products/${product.id}`} className="block">
      <Card className="w-full h-full p-5 rounded-lg hover:shadow-lg transition-shadow flex flex-col">
        <Image
          source={{
            uri: product.image,
          }} 
          className="mb-4 h-[180px] w-full rounded-md object-cover"
          alt={`${product.name} image`}
          resizeMode="cover"
        />
        <Text className="text-sm font-normal mb-2 text-typography-700 line-clamp-2">
          {product.name}
        </Text>
        <Heading size="md" className="mb-2">
          {product.price}
        </Heading>
        <Text className="text-sm font-normal text-typography-500 mb-4">
          {product.stock} in stock
        </Text>
        
        {/* Vendor info at the bottom */}
        {product.vendor && (
          <div className="mt-auto border-t pt-4">
            <Text className="flex items-center gap-2 text-sm font-normal text-typography-500 truncate">
              <Icon as={ShoppingBagIcon} className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{product.vendor.storeName}</span>
            </Text>
          </div>
        )}
      </Card>
    </Link>
  );
}