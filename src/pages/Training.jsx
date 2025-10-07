import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { userQueryAPI } from "../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const Training = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
          Training
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
           Train your own personal data
          </p>
        </div>
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
          <CardTitle>All User Queries ({filteredQuery.length})</CardTitle>
          <CardDescription> View user query from portfollio</CardDescription>
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
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b last:border-0 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {/* Left - Query */}
                  <div className="flex-1">
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

export default Training;
