import { fetchOrder } from '@/api/orders';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import dayjs from 'dayjs';
import { Heading } from '@/components/ui/heading';
import {
  Select,
  SelectIcon,
  SelectInput,
  SelectTrigger,
} from '@/components/ui/select';
import StatusSelector from './StatusSelector';
import { Box } from '@/components/ui/box';

export default async function OrderPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await fetchOrder(Number(params.id));
  console.log(order);
  return (
    <Card>
      <Box className="p-4 border-b border-gray-200 gap-4">
        <Text className="font-bold">Order #{order?.id}</Text>
        <Text>{dayjs(order?.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
        <Box className="w-48">
          <StatusSelector status={order?.status} id={order?.id} />
        </Box>
      </Box>

      <Heading className="mt-5 text-gray-500">Items</Heading>
      {order?.items.map((orderItem: any) => (
        <HStack key={orderItem.id} className="p-4 0 gap-4">
          <Text>{orderItem.productId}</Text>
          <Text>
            {orderItem.quantity} x ${orderItem.price}
          </Text>
        </HStack>
      ))}

      {order?.fulfillmentPoint && (
        <Box className="mt-6">
          <Heading className="text-gray-500 mb-2">Fulfillment Point (Drop-off)</Heading>
          <Card className="p-4">
            <Text className="font-bold text-lg">{order.fulfillmentPoint.name}</Text>
            <Text className="text-gray-600 mb-4">{order.fulfillmentPoint.address}, {order.fulfillmentPoint.city}</Text>

            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                width="100%"
                height="100%"
                title="map"
                scrolling="no"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(order.fulfillmentPoint.address + ', ' + order.fulfillmentPoint.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              />
            </div>
          </Card>
        </Box>
      )}
    </Card>
  );
}
