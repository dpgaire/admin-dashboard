import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import LibraryDetailModal from "./LibraryDetailModal";

const LibraryCard = ({ libraryItem, onEdit, onDelete }) => {
  return (
    <div className="border rounded-lg overflow-hidden book-cover">
      <img
        src={libraryItem.coverImage || "/blog-fallback.png"}
        alt={libraryItem.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4 bg-white dark:bg-gray-800">
        <h3 className="font-bold text-lg truncate">{libraryItem.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {libraryItem.author}
        </p>
        <div className="flex justify-between items-center mt-4">
          <LibraryDetailModal libraryItem={libraryItem} />
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryCard;
