import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, User, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { userQueryAPI } from "../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const Queries = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQueries, setSelectedQueries] = useState([]);

  const { data: userQueryData = [], isLoading } = useQuery({
    queryKey: ["userQuery"],
    queryFn: async () => {
      const response = await userQueryAPI.getAll();
      return response?.data?.queries || [];
    },
    onError: (error) => {
      console.error("Error fetching query:", error);
      toast.error("Failed to load query");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userQueryAPI.delete,
    onSuccess: () => {
      toast.success("Query deleted successfully!");
      queryClient.invalidateQueries(["userQuery"]);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to delete query";
      toast.error(message);
    },
  });

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedQueries.map((id) => deleteMutation.mutateAsync(id)));
      setSelectedQueries([]);
    } catch (error) {
      console.error("Error deleting selected queries:", error);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedQueries(filteredQuery.map((q) => q.id));
    } else {
      setSelectedQueries([]);
    }
  };

  const handleSelectQuery = (id) => {
    setSelectedQueries((prev) =>
      prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
    );
  };

  const filteredQuery = userQueryData
    ?.filter((user) =>
      user.query?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Query
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View user query from portfollio
          </p>
        </div>
        {selectedQueries.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedQueries.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  selected queries.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSelected}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search user query by name or email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All User Queries ({filteredQuery.length})</CardTitle>
              <CardDescription> View user query from portfollio</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                onCheckedChange={handleSelectAll}
                checked={selectedQueries.length === filteredQuery.length && filteredQuery.length > 0}
              />
              <label htmlFor="select-all">
                {filteredQuery.length > 0 &&
        selectedQueries.length === filteredQuery.length
          ? "Deselect All"
          : "Select All"}
                </label>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredQuery.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "No users found matching your search."
                  : "No users found."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuery.map((user, index) => (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b last:border-0 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center flex-1">
                    <Checkbox
                      id={user.id}
                      className="mr-4"
                      onCheckedChange={() => handleSelectQuery(user.id)}
                      checked={selectedQueries.includes(user.id)}
                    />
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {index + 1}. {user.query}
                    </p>
                  </div>

                  {/* Right - Timestamp */}
                  <div className="mt-2 sm:mt-0 sm:ml-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(user.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Queries;
