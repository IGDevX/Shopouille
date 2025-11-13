import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

type PaginationProps = {
  currentPage: number;
  pageCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onPage: (page: number) => void;
};

export const PaginationControls: React.FC<PaginationProps> = ({
  currentPage,
  pageCount,
  onPrevious,
  onNext,
  onPage,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-2">
        {currentPage - 1 > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPage(currentPage - 1)}
          >
            {currentPage - 1}
          </Button>
        )}
        <span className="font-bold px-2">{currentPage}</span>
        {currentPage + 1 <= pageCount && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPage(currentPage + 1)}
          >
            {currentPage + 1}
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={currentPage === pageCount}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default PaginationControls;
