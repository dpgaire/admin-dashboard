import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import LibraryDetailModal from "./LibraryDetailModal";

const LibraryCard = ({ libraryItem, onEdit, onDelete }) => {
  return (
    <div className="group w-full md:w-64 h-80 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Book Cover - Full Card as Book */}
      <div className="relative flex-1 flex flex-col p-2  bg-gray-50 dark:bg-gray-800">
        {/* Three Vertical Lines in Center (like book spine texture or chapter markers) */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <div className="flex gap-2">
            <div className="w-px h-24 my-auto bg-gray-300 dark:bg-gray-600"></div>
            <div className="w-px h-32 bg-gray-300 dark:bg-gray-600"></div>
            <div className="w-px h-24 my-auto bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>
        {/* Title - Bold, centered, book-like */}
        <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-gray-100 text-center leading-tight line-clamp-3 mb-3 z-10">
          {libraryItem.title}
        </h3>
      </div>

      {/* Book Spine Bottom Edge */}
      <div className="bg-gray-50 dark:bg-gray-800 flex justify-end">
         <p className="text-sm text-gray-600 dark:text-gray-400 text-center italic line-clamp-2 z-10">
          {libraryItem.author}
        </p>
      </div>
      <div className="h-1 bg-gray-300 dark:bg-gray-700"></div>
      {/* Action Footer - Thin, clean, aligned */}
      <div className="px-3 py-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <LibraryDetailModal libraryItem={libraryItem} />
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onEdit}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LibraryCard;