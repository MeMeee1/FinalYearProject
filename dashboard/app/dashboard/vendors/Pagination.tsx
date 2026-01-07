'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages < 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/dashboard/vendors?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3) end = 4;
      else if (currentPage >= totalPages - 2) start = totalPages - 3;
      if (start > 2) pages.push('ellipsis-start');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('ellipsis-end');
      pages.push(totalPages);
    }
    return pages;
  };

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  const pageNumbers = getPageNumbers();

  return (
    <div className="w-full py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          <span className="font-medium">Page {currentPage}</span>
          <span className="mx-1">of</span>
          <span className="font-medium">{totalPages}</span>
        </div>
        <div className="flex items-center justify-center gap-1 sm:gap-2 order-1 sm:order-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onPress={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 min-w-[80px] sm:min-w-[90px]"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>
          <div className="flex items-center justify-center flex-wrap gap-1 mx-2">
            {pageNumbers.map((page, idx) => {
              if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-500 flex items-center" aria-hidden="true">
                    <MoreHorizontal className="w-4 h-4" />
                  </span>
                );
              }
              const pageNum = page as number;
              const isActive = pageNum === currentPage;
              return (
                <Button
                  key={pageNum}
                  variant={isActive ? 'solid' : 'outline'}
                  size="sm"
                  onPress={() => handlePageChange(pageNum)}
                  className={`min-w-[36px] h-9 text-sm ${isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-gray-50'} ${isMobile && pageNum > 5 ? 'hidden sm:inline-flex' : ''}`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onPress={() => handlePageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 min-w-[80px] sm:min-w-[90px]"
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
