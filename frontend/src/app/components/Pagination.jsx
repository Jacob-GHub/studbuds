// components/Pagination.jsx
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  darkMode = false,
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    // Fewer visible pages on mobile — controlled by caller's viewport, but
    // we shrink maxVisible to 3 so the row never overflows on small screens.
    const maxVisible = 3;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end   = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2)              end   = Math.min(totalPages - 1, 3);
      else if (currentPage >= totalPages - 1) start = Math.max(2, totalPages - 2);

      if (start > 2)              pages.push('ellipsis-start');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1)   pages.push('ellipsis-end');

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const btnBase = `transition-all disabled:opacity-40 disabled:cursor-not-allowed`;
  const btnBorder = darkMode
    ? 'border-2 border-gray-700 hover:border-indigo-500 hover:bg-gray-800 text-gray-400'
    : 'border-2 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 text-gray-600';

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 sm:p-3 rounded-xl ${btnBase} ${btnBorder}`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1 sm:gap-2">
        {pageNumbers.map((page) => {
          if (typeof page === 'string') {
            return (
              <span
                key={page}
                className={`px-1 text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
              >
                ···
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`min-w-[36px] sm:min-w-[48px] h-9 sm:h-12 px-2 sm:px-4 rounded-xl font-medium text-sm sm:text-base ${btnBase} ${
                currentPage === page
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : btnBorder
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 sm:p-3 rounded-xl ${btnBase} ${btnBorder}`}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
      </button>
    </div>
  );
}