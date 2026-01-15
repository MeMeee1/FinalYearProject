import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface VendorProfile {
  id: number;
  userId: number;
  storeName: string;
  storeDescription?: string;
  storeLogo?: string;
  storeBanner?: string;
  businessName?: string;
  businessAddress?: string;
  businessEmail?: string;
  businessPhone?: string;
  status: 'pending' | 'active' | 'suspended';
  platformCommissionRate?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface VendorStore {
  vendorProfile: VendorProfile | null;
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
  setVendorProfile: (profile: VendorProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateProfile: (updates: Partial<VendorProfile>) => void;
  clearProfile: () => void;
  setLastFetch: (timestamp: number) => void;
  isCached: () => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useVendorStore = create<VendorStore>()(
  devtools(
    persist(
      (set, get) => ({
        vendorProfile: null,
        isLoading: false,
        error: null,
        lastFetch: null,

        setVendorProfile: (profile) => set({ vendorProfile: profile, error: null }),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        updateProfile: (updates) => {
          set((state) => ({
            vendorProfile: state.vendorProfile
              ? { ...state.vendorProfile, ...updates }
              : null,
          }));
        },

        clearProfile: () =>
          set({
            vendorProfile: null,
            error: null,
            lastFetch: null,
          }),

        setLastFetch: (timestamp) => set({ lastFetch: timestamp }),

        isCached: () => {
          const state = get();
          if (!state.lastFetch) return false;
          return Date.now() - state.lastFetch < CACHE_DURATION;
        },
      }),
      {
        name: 'vendor-storage', // persist to localStorage
        partialize: (state) => ({
          vendorProfile: state.vendorProfile,
          lastFetch: state.lastFetch,
        }),
      }
    ),
    { name: 'VendorStore' }
  )
);
