import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { codeLogAPI } from "@/services/api";
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
import { Plus, Edit, Trash, Copy, Upload } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { codeLogSchema } from "@/utils/validationSchemas";
import { Search } from "lucide-react";

const CodeLog = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: codeLogs, isLoading } = useQuery({
    queryKey: ["codeLogs"],
    queryFn: async () => {
      try {
        const response = await codeLogAPI.getAll();
        return response.data;
      } catch (error) {
        console.error("Error fetching code logs:", error);
        toast.error("Failed to load code logs");
        return [];
      }
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(codeLogSchema),
  });

  const createLog = useMutation({
    mutationFn: codeLogAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["codeLogs"]);
      toast.success("Code log created successfully");
      setOpen(false);
      setEditingLog(null);
      reset();
    },
    onError: () => {
      toast.error("Failed to create code log");
    },
  });

  const updateLog = useMutation({
    mutationFn: (data) => codeLogAPI.update(editingLog.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["codeLogs"]);
      toast.success("Code log updated successfully");
      setOpen(false);
      setEditingLog(null);
      reset();
    },
    onError: () => {
      toast.error("Failed to update code log");
    },
  });

  const deleteLog = useMutation({
    mutationFn: codeLogAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["codeLogs"]);
      toast.success("Code log deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete code log");
    },
  });

  const onSubmit = (data) => {
    if (editingLog) {
      updateLog.mutate(data);
    } else {
      createLog.mutate(data);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text", err);
    }
  };

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(codeLogs, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "codelogs.json";
    link.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (Array.isArray(importedData)) {
            importedData.forEach((log) => {
              createLog.mutate(log);
            });
          } else {
            toast.error("Invalid JSON format. Expected an array of code logs.");
          }
        } catch (error) {
          toast.error("Error parsing JSON file.", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredCodeLogs = codeLogs?.filter((code) =>
    code.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-2 md:gap-0 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Code Log</h1>
          <p className="mt-2">Manage your frequently used code snippets</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleExport}>
            <Upload className="mr-2 h-4 w-4" /> Export JSON
          </Button>
          <Button asChild>
            <label htmlFor="import-json">
              <Upload className="mr-2 h-4 w-4" /> Import JSON
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
                  setEditingLog(null);
                  reset();
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Code Log
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingLog ? "Edit Code Log" : "Add New Code Log"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="title">Title</label>
                  <Input
                    id="title"
                    {...register("title")}
                    defaultValue={editingLog?.title || ""}
                  />
                  {errors.title && (
                    <p className="text-red-500">{errors.title.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="code" className="block mb-1 font-medium">
                    Code
                  </label>
                  <Textarea
                    id="code"
                    {...register("code")}
                    defaultValue={editingLog?.code || ""}
                    rows={10}
                    className="w-full h-40 resize-none overflow-y-auto border rounded-md p-2"
                  />
                  {errors.code && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.code.message}
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createLog.isLoading || updateLog.isLoading}
                  >
                    {editingLog ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      {filteredCodeLogs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No data found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCodeLogs.map((log) => (
            <Card
              key={log.id}
              className="bg-gray-50 text-gray-900 dark:bg-[#1e1e1e] dark:text-gray-200 gap-0 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Header */}
              <CardHeader className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700  ">
                <CardTitle className="text-sm font-semibold truncate">
                  {log.title}
                </CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => {
                      setEditingLog(log);
                      reset(log);
                      setOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => deleteLog.mutate(log.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => handleCopy(log.code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Code Editor Area */}
              <CardContent className="max-h-60 overflow-y-auto bg-gray-50 dark:bg-[#1e1e1e] text-sm font-mono leading-6 p-0">
                <div className="flex">
                  {/* Line Numbers */}
                  <div className="bg-gray-100 dark:bg-[#252526] text-gray-400 dark:text-gray-500 text-right pr-3 pl-2 select-none border-r border-gray-200 dark:border-gray-700">
                    {log.code.split("\n").map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  {/* Code Content */}
                  <pre className="flex-1 text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words p-3 overflow-x-auto">
                    {log.code}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeLog;
