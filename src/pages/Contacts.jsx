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
import { contactAPI } from "../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const Contacts = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);

  const { data: contactData = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const response = await contactAPI.getAll();
      return response.data || [];
    },
    onError: (error) => {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: contactAPI.delete,
    onSuccess: () => {
      toast.success("Contact deleted successfully!");
      queryClient.invalidateQueries(["contacts"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete contact";
      toast.error(message);
    },
  });

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedContacts.map((id) => deleteMutation.mutateAsync(id))
      );
      setSelectedContacts([]);
    } catch (error) {
      console.error("Error deleting selected contacts:", error);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedContacts(filteredContacts.map((c) => c.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const filteredContacts = contactData.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View user feedback from portfollio
          </p>
        </div>
        {selectedContacts.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedContacts.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  selected contacts.
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
              placeholder="Search users by name or email..."
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
              <CardTitle>All User Feedback ({filteredContacts.length})</CardTitle>
              <CardDescription>
                View user feedback from portfollio
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                onCheckedChange={handleSelectAll}
                checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
              />
              <label htmlFor="select-all">Select All</label>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredContacts.length === 0 ? (
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
              {filteredContacts.map((user, index) => (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-5 border rounded-xl shadow-sm bg-white dark:bg-gray-900 hover:shadow-md transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      id={user.id}
                      className="mt-1.5"
                      onCheckedChange={() => handleSelectContact(user.id)}
                      checked={selectedContacts.includes(user.id)}
                    />
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {index + 1}. {user.name}
                        </h3>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200">
                          {user.subject || "General"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                      <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                        {user.message}
                      </p>
                    </div>
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

export default Contacts;
