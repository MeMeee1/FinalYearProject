'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
}

export default function Pagination({ currentPage, totalPages, searchQuery }: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    params.set('page', page.toString());
    return `/dashboard/products?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Show max 5 page numbers
    
    if (totalPages <= showPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Link href={buildUrl(Math.max(1, currentPage - 1))}>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
      </Link>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link key={pageNum} href={buildUrl(pageNum)}>
              <Button
                variant={isActive ? 'solid' : 'outline'}
                size="sm"
                className={`min-w-[40px] ${
                  isActive ? 'bg-blue-600 text-white' : ''
                }`}
              >
                {pageNum}
              </Button>
            </Link>
          );
        })}
      </div>

      <Link href={buildUrl(Math.min(totalPages, currentPage + 1))}>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}
