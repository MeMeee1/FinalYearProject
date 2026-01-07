'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { SearchIcon } from '@/components/ui/icon';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const status = searchParams.get('status') || 'active';

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      params.set('page', '1');
      params.set('status', status);
      router.push(`/dashboard/vendors?${params.toString()}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, status, router]);

  function handleChange(e: any) {
    const value = e.nativeEvent?.text || e.target?.value || '';
    setQuery(value);
  }

  return (
    <Input className="w-full bg-white">
      <InputSlot className="pl-2">
        <InputIcon as={SearchIcon} />
      </InputSlot>
      <InputField placeholder="Search vendors..." value={query} onChange={handleChange} />
    </Input>
  );
}
