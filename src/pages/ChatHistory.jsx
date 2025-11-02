import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { chatHistoryAPI } from "../services/api";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import ReactJson from 'react-json-view';

const ChatHistory = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: chatHistories = [], isLoading: isLoadingHistories } = useQuery({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      const response = await chatHistoryAPI.getAll();
      return response.data?.chatHistories || [];
    },
    onError: (error) => {
      console.error("Error fetching chat histories:", error);
      toast.error("Failed to load chat histories");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ userId, chatId }) => chatHistoryAPI.delete(userId, chatId),
    onSuccess: () => {
      toast.success("Chat history deleted successfully!");
      queryClient.invalidateQueries(["chatHistory"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete chat history";
      toast.error(message);
    },
  });

  const handleDelete = (userId, chatId) => {
    if (window.confirm("Are you sure you want to delete this chat history?")) {
      deleteMutation.mutate({ userId, chatId });
    }
  };

  const filteredChatHistories = chatHistories.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoadingHistories) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Chat History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and view user chat histories.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredChatHistories.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.fullName}</CardDescription>
                  <CardDescription className="text-gray-400">{item.email}</CardDescription>

                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.userId, item.id)} disabled={deleteMutation.isLoading}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ReactJson 
                src={item.messages} 
                theme="solarized"
                displayDataTypes={false}
                enableClipboard={false}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
