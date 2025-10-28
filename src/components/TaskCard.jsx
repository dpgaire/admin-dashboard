import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

const TaskCard = ({ task, onEdit, onDelete }) => {
  if (!task) return null;

  const formatDate = (date) => {
    try {
      if (!date) return null;
      return new Date(date).toLocaleDateString();
    } catch {
      return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold break-words">{task.title}</h4>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(task)} title="Edit">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} title="Delete">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">{task.description}</p>
        )}

        <div className="flex justify-between items-center mt-4">
          <Badge
            variant={
              task.priority === "High"
                ? "destructive"
                : task.priority === "Medium"
                ? "default"
                : "secondary"
            }
          >
            {task.priority || "No priority"}
          </Badge>

          {task.dueDate ? (
            <span className="text-xs text-gray-400">{formatDate(task.dueDate)}</span>
          ) : (
            <span className="text-xs text-gray-400">No due date</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
