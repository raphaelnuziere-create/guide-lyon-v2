'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPrevNext = true,
  maxVisiblePages = 7,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Calculate which pages to show
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    // Adjust if we're near the beginning or end
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }
    if (currentPage > totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }
    
    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  const baseButtonClass = "min-w-[40px] h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors";
  const activeButtonClass = "bg-blue-600 text-white";
  const inactiveButtonClass = "text-gray-700 hover:text-gray-900 hover:bg-gray-100";
  const disabledButtonClass = "text-gray-400 cursor-not-allowed";

  return (
    <nav className={`flex items-center justify-center gap-1 ${className}`} aria-label="Pagination">
      
      {/* Previous button */}
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`${baseButtonClass} ${
            currentPage <= 1 ? disabledButtonClass : inactiveButtonClass
          }`}
          aria-label="Page précédente"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline ml-1">Précédent</span>
        </button>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <div
                key={`ellipsis-${index}`}
                className="min-w-[40px] h-10 flex items-center justify-center"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </div>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`${baseButtonClass} ${
                isActive ? activeButtonClass : inactiveButtonClass
              }`}
              aria-label={`Page ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`${baseButtonClass} ${
            currentPage >= totalPages ? disabledButtonClass : inactiveButtonClass
          }`}
          aria-label="Page suivante"
        >
          <span className="hidden sm:inline mr-1">Suivant</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </nav>
  );
}