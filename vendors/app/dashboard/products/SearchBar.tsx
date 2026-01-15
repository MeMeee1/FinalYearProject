'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { SearchIcon } from '@/components/ui/icon';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // Debounce search to avoid too many updates
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set('q', query.trim());
      }
      // Always reset to page 1 when searching
      params.set('page', '1');
      
      const newUrl = query.trim() 
        ? `/dashboard/products?${params.toString()}`
        : '/dashboard/products';
      
      router.push(newUrl);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query, router]);

  function handleChange(e: any) {
    const value = e.nativeEvent?.text || e.target?.value || '';
    setQuery(value);
  }

  return (
    <Input className="w-full bg-white">
      <InputSlot className="pl-2">
        <InputIcon as={SearchIcon} />
      </InputSlot>
      <InputField
        placeholder="Search vendors..."
        value={query}
        onChange={handleChange}
      />
    </Input>
  );
}