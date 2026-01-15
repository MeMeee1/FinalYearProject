import { fetchProductById } from '@/api/products';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Badge, BadgeText } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Edit2, MapPin, Package, Tag } from 'lucide-react';
import { Icon } from '@/components/ui/icon';

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await fetchProductById(Number(id));

  if (!product) {
    return (
      <Box className="p-4">
        <Text>Product not found</Text>
        <Link href="/dashboard/products" className="text-blue-500 mt-2 block">
          Back to products
        </Link>
      </Box>
    );
  }

  // Format price
  const formattedPrice = typeof product.price === 'number'
    ? `$${product.price.toFixed(2)}`
    : product.price;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-6">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Icon as={ArrowLeft} className="w-4 h-4" />
          <Text className="font-medium">Back to Products</Text>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Image */}
        <div className="w-full lg:w-1/2">
          <Card className="p-2 border-gray-200 overflow-hidden bg-white rounded-xl shadow-sm">
            <div className="aspect-square relative bg-gray-50 rounded-lg overflow-hidden">
              {product.image ? (
                <Image
                  source={{ uri: product.image }}
                  className="w-full h-full object-cover"
                  alt={product.name}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Icon as={Package} className="w-20 h-20 mb-2 opacity-20" />
                  <Text className="text-gray-400">No image available</Text>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Details */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div>
            <div className="flex justify-between items-start mb-2">
              <Badge
                size="md"
                variant="solid"
                className={`${product.status === 'active' ? 'bg-green-100' : 'bg-gray-100'} mb-3 self-start`}
              >
                <BadgeText className={`${product.status === 'active' ? 'text-green-800' : 'text-gray-800'}`}>
                  {product.status?.toUpperCase() || 'UNKNOWN'}
                </BadgeText>
              </Badge>

              <Link href={`/dashboard/products/edit/${product.id}`}>
                <Button size="sm" variant="outline" className="border-gray-300">
                  <Icon as={Edit2} className="w-4 h-4 mr-2 text-gray-700" />
                  <ButtonText className="text-gray-700">Edit Product</ButtonText>
                </Button>
              </Link>
            </div>

            <Heading size="3xl" className="text-gray-900 mb-2 leading-tight">
              {product.name}
            </Heading>

            <Text className="text-3xl font-bold text-gray-900 mb-6 font-heading">
              {formattedPrice}
            </Text>
          </div>

          <Card className="p-5 bg-gray-50 border-gray-100 shadow-sm">
            <VStack space="md">
              <HStack className="justify-between border-b border-gray-200 pb-3">
                <HStack space="sm" className="items-center">
                  <Icon as={Package} className="w-4 h-4 text-gray-500" />
                  <Text className="text-gray-600 font-medium">Stock Status</Text>
                </HStack>
                <Text className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}
                </Text>
              </HStack>
              {product.sku && (
                <HStack className="justify-between border-b border-gray-200 pb-3">
                  <HStack space="sm" className="items-center">
                    <Icon as={Tag} className="w-4 h-4 text-gray-500" />
                    <Text className="text-gray-600 font-medium">SKU</Text>
                  </HStack>
                  <Text className="font-mono text-gray-800">{product.sku}</Text>
                </HStack>
              )}
              {(product.latitude && product.longitude) && (
                <HStack className="justify-between pt-1">
                  <HStack space="sm" className="items-center">
                    <Icon as={MapPin} className="w-4 h-4 text-gray-500" />
                    <Text className="text-gray-600 font-medium">Location</Text>
                  </HStack>
                  <div className="text-right">
                    <Text className="text-gray-800 text-sm">{product.productAddress || 'Coordinates:'}</Text>
                    <Text className="text-xs text-gray-500">{Number(product.latitude).toFixed(4)}, {Number(product.longitude).toFixed(4)}</Text>
                  </div>
                </HStack>
              )}
            </VStack>
          </Card>

          <div className="mt-2">
            <Heading size="md" className="mb-2 text-gray-900">Description</Heading>
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed bg-white p-4 rounded-lg border border-gray-100">
              {product.description || (
                <span className="italic text-gray-400">No description provided for this product.</span>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4 text-xs text-gray-400">
            <Text>Created: {new Date(product.createdAt).toLocaleDateString()}</Text>
            <Text>Last Updated: {new Date(product.updatedAt).toLocaleDateString()}</Text>
          </div>
        </div>
      </div>
    </div>
  );
}
