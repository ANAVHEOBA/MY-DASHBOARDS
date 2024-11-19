import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UserPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

export const UserPagination: React.FC<UserPaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage = 10,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    let pages = [];
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Calculate visible page range
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      // Adjust start if we're near the end
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

      // Add ellipsis if needed
      if (start > 1) pages.unshift(-1);
      if (end < totalPages) pages.push(-1);
    }
    return pages;
  };

  return (
    <div className="mt-6 flex justify-center">
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        {/* Previous Page Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((pageNum, index) => (
          pageNum === -1 ? (
            <span
              key={`ellipsis-${index}`}
              className="relative inline-flex items-center px-4 py-2 border text-sm font-medium text-gray-700 bg-white"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                currentPage === pageNum
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          )
        ))}

        {/* Next Page Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
};