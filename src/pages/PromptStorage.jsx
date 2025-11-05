import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promptStorageAPI } from "@/services/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash, Copy, Upload, Search } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { promptStorageSchema } from "@/utils/validationSchemas";

const PromptStorage = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: prompts, isLoading: isLoadings } = useQuery({
    queryKey: ["prompts"],
    queryFn: async () => {
      try {
        const response = await promptStorageAPI.getAll();
        return response.data;
      } catch (error) {
        console.error("Error fetching prompts:", error);
        toast.error("Failed to load prompts");
        return [];
      }
    },
  });

  console.log('prompts',prompts)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(promptStorageSchema),
  });

  const createPrompt = useMutation({
    mutationFn: promptStorageAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["prompts"]);
      toast.success("Prompt created successfully");
      setOpen(false);
      setEditingPrompt(null);
      reset();
    },
    onError: () => {
      toast.error("Failed to create prompt");
    },
  });

  const updatePrompt = useMutation({
    mutationFn: (data) => promptStorageAPI.update(editingPrompt.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["prompts"]);
      toast.success("Prompt updated successfully");
      setOpen(false);
      setEditingPrompt(null);
      reset();
    },
    onError: () => {
      toast.error("Failed to update prompt");
    },
  });

  const deletePrompt = useMutation({
    mutationFn: promptStorageAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["prompts"]);
      toast.success("Prompt deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete prompt");
    },
  });

  const onSubmit = (data) => {
    if (editingPrompt) {
      updatePrompt.mutate(data);
    } else {
      createPrompt.mutate(data);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy",err);
    }
  };

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(prompts, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "prompts.json";
    link.click();
    toast.success("Exported prompts.json");
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          importedData.forEach((prompt) => {
            createPrompt.mutate(prompt);
          });
          toast.success(`Imported ${importedData.length} prompts`);
        } else {
          toast.error("Invalid format: Expected array of prompts");
        }
      } catch (error) {
        toast.error("Failed to parse JSON file",error);
      }
    };
    reader.readAsText(file);
  };

  const filteredPrompts = prompts?.filter((prompt) =>
    prompt.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.ai_category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoadings) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Prompt Storage
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Organize, edit, and reuse your AI prompts efficiently
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Upload className="mr-2 h-4 w-4" /> Export
            </Button>

            <Button variant="outline" asChild className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <label htmlFor="import-json" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4 rotate-180" /> Import
                <input
                  type="file"
                  id="import-json"
                  className="hidden"
                  accept=".json"
                  onChange={handleImport}
                />
              </label>
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingPrompt(null);
                    reset();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Prompt
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingPrompt ? "Edit Prompt" : "Create New Prompt"}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <Input
                      id="title"
                      {...register("title")}
                      defaultValue={editingPrompt?.title || ""}
                      placeholder="e.g., Blog Post Generator"
                      className="w-full"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      AI Category
                    </label>
                    <Input
                      id="ai_category"
                      {...register("ai_category")}
                      defaultValue={editingPrompt?.ai_category || ""}
                      placeholder="e.g., ChatGPT, Claude, Gemini"
                      className="w-full"
                    />
                    {errors.ai_category && (
                      <p className="mt-1 text-sm text-red-500">{errors.ai_category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Prompt
                    </label>
                    <Textarea
                      id="prompt"
                      {...register("prompt")}
                      defaultValue={editingPrompt?.prompt || ""}
                      rows={8}
                      placeholder="Write your detailed prompt here..."
                      className="w-full font-mono text-sm resize-none"
                    />
                    {errors.prompt && (
                      <p className="mt-1 text-sm text-red-500">{errors.prompt.message}</p>
                    )}
                  </div>

                  <DialogFooter className="flex gap-2 sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      className="border-gray-300 dark:border-gray-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createPrompt.isPending || updatePrompt.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {createPrompt.isPending || updatePrompt.isPending ? (
                        <>
                          Saving...
                        </>
                      ) : (
                        <>{editingPrompt ? "Update" : "Create"}</>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title or category..."
                className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Prompt Grid */}
        {filteredPrompts.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                No prompts found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {searchTerm ? "Try adjusting your search" : "Create your first prompt to get started"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="group relative overflow-hidden transition-all duration-200 hover:shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                {/* Header */}
                <CardHeader className="pb-3 pt-4 px-4   border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold text-gray-900 dark:text-white truncate">
                        {prompt.title}
                      </CardTitle>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                        {prompt.ai_category}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-gray-600"
                        onClick={() => {
                          setEditingPrompt(prompt);
                          reset(prompt);
                          setOpen(true);
                        }}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                        onClick={() => deletePrompt.mutate(prompt.id)}
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400"
                        onClick={() => handleCopy(prompt.prompt)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Prompt Content with Line Numbers */}
                <CardContent className="p-0 max-h-64 overflow-hidden">
                  <div className="flex font-mono text-xs leading-relaxed">
                    {/* Line Numbers */}
                    <div className="bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-right py-3 px-2 select-none border-r border-gray-200 dark:border-gray-700 min-w-[2.5rem]">
                      {prompt.prompt.split("\n").map((_, i) => (
                        <div key={i} className="leading-5">
                          {i + 1}
                        </div>
                      ))}
                    </div>

                    {/* Prompt Text */}
                    <pre className="flex-1 p-3 text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words overflow-x-auto">
                      {prompt.prompt}
                    </pre>
                  </div>
                </CardContent>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptStorage;