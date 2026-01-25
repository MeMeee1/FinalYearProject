'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useVendorStore } from '@/store/vendorStore';
import { getVendorProfile as fetchVendorProfile } from '@/api/vendors';

/**
 * Custom hook to manage vendor profile with caching and state management
 * Handles automatic fetching, caching, and updates
 */
export function useVendorProfile() {
  const {
    vendorProfile,
    isLoading,
    error,
    setVendorProfile,
    setLoading,
    setError,
    updateProfile,
    clearProfile,
    isCached,
    setLastFetch,
  } = useVendorStore();

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  /**
   * Fetch vendor profile with caching logic
   */
  const fetchProfile = useCallback(async (forceFresh = false) => {
    // Return cached data if available and not forcing fresh fetch
    if (!forceFresh && isCached() && vendorProfile) {
      console.log('[useVendorProfile] Using cached vendor profile');
      return vendorProfile;
    }

    if (isLoading) {
      console.log('[useVendorProfile] Already loading, skipping duplicate fetch');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('[useVendorProfile] Fetching vendor profile from API...');
      const profile = await fetchVendorProfile();

      if (!isMounted.current) return;

      console.log('[useVendorProfile] Profile fetched with status:', profile.status);
      setVendorProfile(profile);
      setLastFetch(Date.now());

      return profile;
    } catch (err) {
      if (!isMounted.current) return;

      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch vendor profile';
      console.error('[useVendorProfile] Error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [isCached, vendorProfile, isLoading, setLoading, setError, setVendorProfile, setLastFetch]);

  /**
   * Refresh profile from database (force fresh fetch)
   */
  const refreshProfile = useCallback(async () => {
    console.log('[useVendorProfile] Refreshing vendor profile...');
    return fetchProfile(true);
  }, [fetchProfile]);

  /**
   * Update profile locally (optimistic update)
   */
  const updateProfileLocal = useCallback((updates: Partial<Exclude<typeof vendorProfile, null>>) => {
    updateProfile(updates);
  }, [updateProfile]);

  return {  
    vendorProfile,
    isLoading,
    error,
    fetchProfile,
    refreshProfile,
    updateProfile: updateProfileLocal,
    clearProfile,
  };
}
