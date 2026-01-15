import { getVendorStats, getVendorProfile } from '@/api/vendors';
import { fetchVendorOrders } from '@/api/orders';
import { DashboardClient } from '@/components/DashboardClient';

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
