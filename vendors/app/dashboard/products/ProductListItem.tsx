// ProductListItem.tsx - Updated version
import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { ShoppingBagIcon } from 'lucide-react';
import { Icon } from '@/components/ui/icon';

interface Product {
  id: string | number;
  name: string;
  image: string;
  price: string | number;
  stock: number;
  vendor?: {
    storeName: string;
  };
}

export default function ProductListItem({ product }: { product: Product }) {
  // Format price
  const formattedPrice = typeof product.price === 'number'
    ? `$${product.price.toFixed(2)}`
    : product.price;

  return (
    <Link href={`/dashboard/products/${product.id}`} className="block h-full">
      <Card className="w-full h-full p-4 rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-200">
        {/* Image container with fixed aspect ratio */}
        <div className="relative pt-[75%] mb-4 overflow-hidden rounded-md bg-gray-100">
          <Image
            source={{
              uri: (() => {
                const placeholder = '/placeholder-image.jpg';
                if (!product.image) return placeholder;
                try {
                  const parsed = JSON.parse(product.image);
                  if (Array.isArray(parsed)) {
                    return parsed.length > 0 ? parsed[0] : placeholder;
                  }
                  return typeof parsed === 'string' ? parsed : product.image;
                } catch {
                  return product.image;
                }
              })()
            }}
            className="absolute top-0 left-0 w-full h-full object-cover"
            alt={product.name}
            resizeMode="cover"

          />
        </div>

        {/* Content section */}
        <div className="flex-grow flex flex-col">
          <Text className="text-sm font-medium mb-2 text-gray-800 line-clamp-2 min-h-[40px]">
            {product.name}
          </Text>

          <Heading size="md" className="mb-2 text-gray-900">
            {formattedPrice}
          </Heading>

          <div className="mt-auto">
            <div className="flex justify-between items-center mb-2">
              <Text className="text-xs font-medium text-gray-600">
                Stock: {product.stock}
              </Text>
              <Text className={`text-xs font-medium px-2 py-1 rounded ${product.stock > 0
                ? 'text-green-700 bg-green-50'
                : 'text-red-700 bg-red-50'
                }`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </Text>
            </div>

            {/* Vendor info */}
            {product.vendor?.storeName && (
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Icon as={ShoppingBagIcon} className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <Text className="text-xs text-gray-500 truncate">
                    {product.vendor.storeName}
                  </Text>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}