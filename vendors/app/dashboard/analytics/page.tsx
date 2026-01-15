import { getVendorStats, getVendorProfile } from '@/api/vendors';
import { fetchVendorOrders } from '@/api/orders';
import { AnalyticsClient } from '@/components/AnalyticsClient';

export default async function AnalyticsPage() {
  const [vendorStats, ordersData, vendorProfile] = await Promise.all([
    getVendorStats().catch(() => null),
    fetchVendorOrders().catch(() => ({ data: [] })),
    getVendorProfile().catch(() => null),
  ]);

  return (
    <AnalyticsClient
      vendorStats={vendorStats}
      ordersData={ordersData}
      vendorProfile={vendorProfile}
    />
  );
}
