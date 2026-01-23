'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-4 py-3 border-0 bg-transparent text-slate-900 placeholder-slate-400 focus:ring-0 sm:text-sm font-medium"
        placeholder="Search through your product catalog..."
        value={query}
        onChange={handleChange}
      />
    </div>
  );
}