import { getVendorStats, getVendorProfile } from '@/api/vendors';
import { fetchVendorOrders } from '@/api/orders';
import { AnalyticsClient } from '@/components/AnalyticsClient';

// Force dynamic rendering - this page fetches authenticated data
export const dynamic = 'force-dynamic';

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
