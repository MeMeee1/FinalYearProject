'use client';

import { useEffect } from 'react';
import { useVendorStore, VendorProfile } from '@/store/vendorStore';

interface VendorProfileSyncProps {
  initialProfile: VendorProfile | null;
}

export function VendorProfileSync({ initialProfile }: VendorProfileSyncProps) {
  const setVendorProfile = useVendorStore((state) => state.setVendorProfile);
  const setLastFetch = useVendorStore((state) => state.setLastFetch);

  useEffect(() => {
    if (initialProfile) {
      console.log('[VendorProfileSync] Syncing profile to store:', initialProfile);
      setVendorProfile(initialProfile);
      setLastFetch(Date.now());
    }
  }, [initialProfile, setVendorProfile, setLastFetch]);

  return null;
}
