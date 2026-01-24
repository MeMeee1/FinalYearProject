import { fetchOrder } from '@/api/orders';
import { Card } from '@/components/ui/card';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import dayjs from 'dayjs';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Package, Calendar, User, MapPin, DollarSign, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import StatusSelector from './StatusSelector';
import { SimulateDropOffButton } from '@/components/SimulateDropOffButton';

export default async function OrderPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await fetchOrder(Number(params.id));

  if (!order) {
    return (
      <Box className="flex-1 items-center justify-center p-20">
        <Heading>Order not found</Heading>
      </Box>
    );
  }

  return (
    <Box className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Navigation */}
      <HStack className="items-center justify-between">
        <VStack space="xs">
          <Link href="/dashboard/orders" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group mb-2">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <Text className="text-[10px] font-black uppercase tracking-widest">Back to Hub</Text>
          </Link>
          <HStack space="md" className="items-center">
            <Box className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </Box>
            <VStack>
              <Heading className="text-3xl font-black tracking-tight text-foreground leading-none">Order #{order.id}</Heading>
              <Text className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Transaction Manifest</Text>
            </VStack>
          </HStack>
        </VStack>

        <Box className="hidden sm:block">
          <SimulateDropOffButton orderId={order.id} deliveryStatus={order.deliveryStatus} />
        </Box>
      </HStack>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <VStack space="lg" className="lg:col-span-2">
          {/* Items Section */}
          <Card className="p-8 rounded-[2.5rem] border border-border shadow-sm bg-card overflow-hidden relative">
            <Box className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
            <Heading className="text-xl font-black mb-8 tracking-tight flex items-center gap-3">
              <Package className="w-5 h-5 text-primary" /> Procurement Items
            </Heading>

            <VStack space="md" className="divide-y divide-border/40">
              {order.items.map((item: any) => (
                <HStack key={item.id} className="py-6 justify-between items-center group">
                  <HStack space="md" className="items-center">
                    <Box className="w-14 h-14 bg-secondary/50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </Box>
                    <VStack>
                      <Text className="font-black text-foreground text-sm tracking-tight">Product #{item.productId}</Text>
                      <Text className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-1">
                        SKU Identifier: {item.sku || 'N/A'}
                      </Text>
                    </VStack>
                  </HStack>
                  <VStack className="items-end">
                    <Text className="text-sm font-black text-foreground">₦{Number(item.price).toLocaleString()}</Text>
                    <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Qty: {item.quantity}</Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>

            <Box className="mt-8 pt-8 border-t border-border/40">
              <HStack className="justify-between items-end">
                <VStack>
                  <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Gross Settlement Amount</Text>
                  <Text className="text-3xl font-black text-primary tracking-tighter">₦{Number(order.totalAmount).toLocaleString()}</Text>
                </VStack>
                <Box className="bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
                  <Text className="text-primary font-black text-[10px] uppercase tracking-widest text-center">Settled via Escrow</Text>
                </Box>
              </HStack>
            </Box>
          </Card>
        </VStack>

        {/* Sidebar Info */}
        <VStack space="lg">
          {/* Status Card */}
          <Card className="p-8 rounded-[2.5rem] border border-border shadow-sm bg-card">
            <Heading className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 px-1 opacity-60">Status Management</Heading>
            <StatusSelector status={order.status} id={order.id} />

            <Box className="mt-6 pt-6 border-t border-border/40">
              <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Handover Action</Text>
              <SimulateDropOffButton orderId={order.id} deliveryStatus={order.deliveryStatus} />
            </Box>
          </Card>

          {/* Logistics Card */}
          <Card className="p-8 rounded-[2.5rem] border border-border shadow-sm bg-card">
            <Heading className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 px-1 opacity-60">Collection Logistics</Heading>

            <VStack space="xl">
              <HStack space="md" className="items-center">
                <Box className="p-2.5 bg-secondary/50 rounded-xl">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </Box>
                <VStack>
                  <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 leading-none">Timestamp</Text>
                  <Text className="text-xs font-black text-foreground">{dayjs(order.createdAt).format('MMM D, YYYY · HH:mm')}</Text>
                </VStack>
              </HStack>

              <HStack space="md" className="items-center">
                <Box className="p-2.5 bg-secondary/50 rounded-xl">
                  <User className="w-4 h-4 text-muted-foreground" />
                </Box>
                <VStack>
                  <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 leading-none">Customer ID</Text>
                  <Text className="text-xs font-black text-foreground">UID-{order.userId}</Text>
                </VStack>
              </HStack>

              <HStack space="md" className="items-start">
                <Box className="p-2.5 bg-secondary/50 rounded-xl">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </Box>
                <VStack className="flex-1">
                  <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 leading-none">Fulfillment Terminal</Text>
                  {order.fulfillmentPoint ? (
                    <VStack space="xs">
                      <Text className="text-xs font-black text-foreground leading-tight">{order.fulfillmentPoint.name}</Text>
                      <Text className="text-[10px] text-muted-foreground font-medium">{order.fulfillmentPoint.address}, {order.fulfillmentPoint.city}</Text>
                    </VStack>
                  ) : (
                    <Text className="text-xs font-bold text-orange-500">Terminal Not Assigned</Text>
                  )}
                </VStack>
              </HStack>
            </VStack>
          </Card>
        </VStack>
      </div>
    </Box>
  );
}
