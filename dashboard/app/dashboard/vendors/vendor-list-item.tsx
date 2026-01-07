"use client";

import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTransition, useState } from 'react';
import { approveVendor, rejectVendor, suspendVendor } from '../../../api/vendors';

export default function VendorListItem({ vendor, isPending, isSuspended }: { vendor: any; isPending?: boolean; isSuspended?: boolean }) {
  const [isPendingTx, startTransition] = useTransition();
  const [reason, setReason] = useState('');

  const onApprove = () => startTransition(async () => { await approveVendor(vendor.id); });
  const onReject = () => startTransition(async () => { await rejectVendor(vendor.id, reason || 'Not a fit'); });
  const onSuspend = () => startTransition(async () => { await suspendVendor(vendor.id, reason || 'Policy violation'); });

  return (
    <Card className="w-full h-full p-4 rounded-lg flex flex-col border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
          {vendor.storeLogo ? (
            <Image source={{ uri: vendor.storeLogo }} className="w-full h-full object-cover" alt={vendor.storeName} />
          ) : (
            <Text className="text-xs text-gray-400">No Logo</Text>
          )}
        </div>
        <div className="flex-1">
          <Heading size="md" className="mb-0.5">{vendor.storeName}</Heading>
          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded ${vendor.status === 'active' ? 'bg-green-50 text-green-700' : vendor.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>{vendor.status}</span>
            {vendor.businessEmail && <span className="text-slate-500">{vendor.businessEmail}</span>}
          </div>
        </div>
      </div>

      {vendor.storeDescription && (
        <Text className="text-sm text-slate-600 mt-3 line-clamp-2">{vendor.storeDescription}</Text>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Link href={`/dashboard/vendors/${vendor.id}`} className="flex-1">
          <Button className="w-full" variant="outline">View</Button>
        </Link>
        {isPending ? (
          <>
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" variant="outline" onPress={onApprove} isDisabled={isPendingTx}>Approve</Button>
            <Button className="flex-1" variant="outline" onPress={onReject} isDisabled={isPendingTx}>Reject</Button>
          </>
        ) : isSuspended ? (
          <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" variant="outline" onPress={onApprove} isDisabled={isPendingTx}>Reactivate</Button>
        ) : (
          <Button className="flex-1" variant="outline" onPress={onSuspend} isDisabled={isPendingTx}>Suspend</Button>
        )}
      </div>

      {(isPending || vendor.status === 'active') && (
        <input
          className="mt-3 w-full border rounded px-3 py-2 text-sm"
          placeholder={isPending ? 'Optional rejection reason' : 'Optional suspension reason'}
          value={reason}
          onChange={(e) => setReason((e.target as any).value)}
        />
      )}
    </Card>
  );
}
