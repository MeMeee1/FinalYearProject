import { getVendorStats, getVendorProfile } from '@/api/vendors';
import { fetchVendorOrders } from '@/api/orders';
import { DashboardClient } from '@/components/DashboardClient';

// Force dynamic rendering - this page fetches authenticated data
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [vendorStats, ordersData, vendorProfile] = await Promise.all([
    getVendorStats().catch(() => null),
    fetchVendorOrders().catch(() => ({ data: [] })),
    getVendorProfile().catch(() => null),
  ]);

  return (
    <DashboardClient
      vendorStats={vendorStats}
      ordersData={ordersData}
      vendorProfile={vendorProfile}
    />
  );
}
