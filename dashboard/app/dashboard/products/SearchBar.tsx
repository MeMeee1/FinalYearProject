'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { SearchIcon } from '@/components/ui/icon';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();


  function handleChange(e: any) {
    const value = e.nativeEvent?.text || e.target?.value || '';
    setQuery(value);

    // Push query to URL (this is the "pass")
    router.push(`/dashboard/products?q=${encodeURIComponent(value)}`);
  }

  return (
    <Input className="w-full bg-white">
      <InputSlot className="pl-2">
        <InputIcon as={SearchIcon} />
      </InputSlot>
      <InputField
        placeholder="Search products..."
        value={query}
        onChange={handleChange}
      />
    </Input>
  );
}
