'use client';

import { useVendorStore } from '@/store/vendorStore';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export function VendorStatusBadge() {
  const vendorProfile = useVendorStore((state) => state.vendorProfile);

  if (!vendorProfile) return null;

  const statusConfig = {
    active: {
      icon: CheckCircle,
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      label: 'Active',
    },
    pending: {
      icon: Clock,
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      label: 'Pending',
    },
    suspended: {
      icon: AlertCircle,
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      label: 'Suspended',
    },
  };

  const config = statusConfig[vendorProfile.status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bg} ${config.text} ${config.border}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs font-medium">{config.label}</span>
    </div>
  );
}
