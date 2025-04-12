import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
  page,
  totalPages,
  handlePrevious,
  handleNext,
  handlePage,
}) {
  const pageNumbers = useMemo(() => {
    const numbers = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
    } else {
      numbers.push(1);

      if (page === 1 || page === 2) {
        numbers.push(2, 3);
      } else if (page === totalPages || page === totalPages - 1) {
        numbers.push(totalPages - 2, totalPages - 1);
      } else {
        numbers.push(page - 1, page, page + 1);
      }

      if (!numbers.includes(totalPages)) {
        numbers.push(totalPages);
      }
    }

    return numbers.sort((a, b) => a - b);
  }, [page, totalPages]);

  const pageButtons = useMemo(() => {
    const items = [];

    for (let i = 0; i < pageNumbers.length; i++) {
      const pageNumber = pageNumbers[i];

      if (i > 0 && pageNumber - pageNumbers[i - 1] > 1) {
        items.push(
          <span key={`ellipsis-${i}`} className="px-2 text-gray-500">
            ...
          </span>
        );
      }

      items.push(
        <button
          key={pageNumber}
          onClick={() => handlePage(pageNumber)}
          className={`px-3 py-1 rounded ${
            page === pageNumber
              ? "bg-blue-500 text-white"
              : "text-gray-500 hover:text-gray-700"
          } cursor-pointer`}
          aria-label={`Page ${pageNumber}`}
          title={`Page ${pageNumber}`}
          aria-current={page === pageNumber ? "page" : undefined}
        >
          {pageNumber}
        </button>
      );
    }

    return items;
  }, [page, pageNumbers, handlePage]);

  return (
    <div className="flex items-center justify-between mt-4">
      <button
        onClick={handlePrevious}
        className={`flex items-center gap-1 px-3 py-1 rounded ${
          page === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-500 hover:text-gray-700 cursor-pointer"
        }`}
        disabled={page === 1}
        aria-label="Previous"
        title="Previous"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <div className="flex items-center space-x-1">{pageButtons}</div>

      <button
        onClick={handleNext}
        className={`flex items-center gap-1 px-3 py-1 rounded ${
          page === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-500 hover:text-gray-700 cursor-pointer"
        }`}
        disabled={page === totalPages}
        aria-label="Next"
        title="Next"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default Pagination;
