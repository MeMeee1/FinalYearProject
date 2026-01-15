// Pagination.tsx - Fixed with Flexbox and better responsiveness
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
}

export default function Pagination({ currentPage, totalPages, searchQuery }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Show pagination even with 1 page (shows page 1 of 1)
  if (totalPages < 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    
    router.push(`/dashboard/products?${params.toString()}`);
  };

  // Generate page numbers based on screen size
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate window around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at edges
      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('ellipsis-start');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Handle window resize for responsive behavior
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  const pageNumbers = getPageNumbers();

  return (
    <div className="w-full py-4">
      {/* Main pagination controls - FLEXBOX LAYOUT */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Page info */}
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          <span className="font-medium">Page {currentPage}</span>
          <span className="mx-1">of</span>
          <span className="font-medium">{totalPages}</span>
          {searchQuery && (
            <span className="ml-2 text-gray-500 hidden sm:inline">
              • Searching: "{searchQuery}"
            </span>
          )}
        </div>
        
        {/* Navigation buttons - FLEXBOX CENTERED */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 order-1 sm:order-2 w-full sm:w-auto">
          {/* Previous button */}
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

          {/* Page numbers - FLEX WRAP for mobile */}
          <div className="flex items-center justify-center flex-wrap gap-1 mx-2">
            {pageNumbers.map((page, idx) => {
              if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                return (
                  <span 
                    key={`ellipsis-${idx}`} 
                    className="px-2 text-gray-500 flex items-center"
                    aria-hidden="true"
                  >
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
                  className={`min-w-[36px] h-9 text-sm ${
                    isActive 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'hover:bg-gray-50'
                  } ${isMobile && pageNum > 5 ? 'hidden sm:inline-flex' : ''}`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          {/* Next button */}
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
        
        {/* Mobile search info */}
        {searchQuery && (
          <div className="text-xs text-gray-500 text-center sm:hidden order-3 w-full">
            Searching: "{searchQuery}"
          </div>
        )}
      </div>
      
      {/* Quick jump buttons for large screens */}
      {totalPages > 10 && (
        <div className="hidden lg:flex items-center justify-center gap-2 mt-4">
          <span className="text-sm text-gray-600 mr-2">Jump to:</span>
          {[1, Math.floor(totalPages/2), totalPages].map((page) => (
            page !== currentPage && (
              <Button
                key={`jump-${page}`}
            
                size="sm"
                onPress={() => handlePageChange(page)}
                className="text-xs px-2"
              >
                {page === 1 ? 'First' : page === totalPages ? 'Last' : `Page ${page}`}
              </Button>
            )
          ))}
        </div>
      )}
    </div>
  );
}