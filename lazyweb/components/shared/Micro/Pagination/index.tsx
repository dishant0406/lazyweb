import cn from "classnames";
import { ArrowLeft, ArrowRight, MoreHorizontal } from "lucide-react";
import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  maxVisiblePages?: number;
  startPage?: number;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  maxVisiblePages = 5,
  startPage = 0,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const leftSide = Math.floor(maxVisiblePages / 2);
    const rightSide = maxVisiblePages - leftSide;

    // Convert currentPage to display value
    const displayCurrentPage = currentPage - startPage + 1;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (displayCurrentPage <= leftSide) {
      for (let i = 1; i <= maxVisiblePages - 1; i++) {
        pageNumbers.push(i);
      }

      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    } else if (displayCurrentPage > totalPages - rightSide) {
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (let i = totalPages - maxVisiblePages + 2; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (
        let i = displayCurrentPage - leftSide + 2;
        i <= displayCurrentPage + rightSide - 2;
        i++
      ) {
        pageNumbers.push(i);
      }

      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  const buttonClasses = cn(
    "px-3 py-2 rounded-md text-sm font-medium",
    "focus:outline-none ",
    " shadow-custom",
    "transition-colors duration-200",
    "bg-background hover:bg-accent text-foreground",
    "border border-border"
  );

  const activeButtonClasses = cn(
    buttonClasses,
    "bg-primary text-primary-foreground hover:bg-primary/90"
  );

  const disabledButtonClasses = cn(
    buttonClasses,
    "opacity-50 cursor-not-allowed"
  );

  return (
    <nav
      className={cn("flex items-center justify-center space-x-2", className)}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === startPage}
        className={
          currentPage === startPage ? disabledButtonClasses : buttonClasses
        }
        aria-label="Previous page"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      {pageNumbers.map((number, index) => (
        <React.Fragment key={index}>
          {number === "..." ? (
            <span className="px-3 py-2">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </span>
          ) : (
            <button
              onClick={() => onPageChange(startPage + (number as number) - 1)}
              className={
                currentPage - startPage + 1 === number
                  ? activeButtonClasses
                  : buttonClasses
              }
              aria-label={`Page ${number}`}
              aria-current={
                currentPage - startPage + 1 === number ? "page" : undefined
              }
            >
              {number}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === startPage + totalPages - 1}
        className={
          currentPage === startPage + totalPages - 1
            ? disabledButtonClasses
            : buttonClasses
        }
        aria-label="Next page"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </nav>
  );
};

export default Pagination;
