import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Trash2, User, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { chatUserAPI } from "../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { cn } from "@/lib/utils";

const ChatUser = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { data: usersData = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["chatUsers"],
    queryFn: async () => {
      const response = await chatUserAPI.getAll();
      return response.data.users || [];
    },
    onError: (error) => {
      console.error("Error fetching chat users:", error);
      toast.error("Failed to load chat users");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: chatUserAPI.delete,
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries(["chatUsers"]);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to delete user";
      toast.error(message);
    },
  });

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedUsers.map((id) => deleteMutation.mutateAsync(id))
      );
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error deleting selected users:", error);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const filteredUsers = useMemo(() => {
    return usersData
      ?.filter(
        (user) =>
          user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .reverse();
  }, [usersData, searchTerm]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoadingUsers) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Chat Users
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Manage and connect with{" "}
              <span className="font-semibold text-primary">
                {usersData.length}
              </span>{" "}
              active users
            </p>
          </div>

          {selectedUsers.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="lg" className="shadow-lg">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Delete Selected ({selectedUsers.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete {selectedUsers.length} user(s)?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action is permanent and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteSelected}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                className="pl-12 pr-4 py-6 text-lg rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchTerm("")}
                >
                  Clear
                </Button>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 text-sm text-gray-500">
              <div>
                <Badge variant="secondary" className="font-medium">
                  {filteredUsers.length} of {usersData.length} users
                </Badge>
                {selectedUsers.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Checkbox checked={true} className="h-4 w-4" />
                    {selectedUsers.length} selected
                  </span>
                )}
              </div>

              {filteredUsers.length > 0 && (
                <div className="flex items-center justify-center gap-3 py-4">
                  <Checkbox
                    id="select-all-footer"
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <label
                    htmlFor="select-all-footer"
                    className="text-sm font-medium cursor-pointer select-none text-gray-700 dark:text-gray-300"
                  >
                    Select all {filteredUsers.length} visible users
                  </label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Users Grid */}
        <div>
          {filteredUsers.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-16 text-center">
                <div className="mx-auto w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  {searchTerm ? "No users found" : "No users yet"}
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {searchTerm
                    ? `Try adjusting your search for "${searchTerm}"`
                    : "Users will appear here once added."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUsers.map((user) => {
                const isSelected = selectedUsers.includes(user.id);
                return (
                  <Card
                    key={user.id}
                    className={cn(
                      "relative overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1",
                      isSelected
                        ? "ring-2 ring-primary shadow-2xl scale-105"
                        : "shadow-md hover:shadow-lg"
                    )}
                  >
                    <div className="absolute top-3 left-3 z-10">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSelectUser(user.id)}
                        className="h-5 w-5 bg-white dark:bg-gray-800 shadow-md"
                      />
                    </div>

                    <CardContent className="p-6 pt-12 text-center">
                      <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-white dark:ring-gray-800 shadow-lg">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary to-purple-600 text-white">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>

                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                        {user.fullName}
                      </h3>
                      <div className="flex items-center justify-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[180px]">
                          {user.email}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Select All Footer */}
      </div>
    </div>
  );
};

export default ChatUser;
