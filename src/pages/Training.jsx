import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2, Save, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trainingAPI } from "../services/api";
import { trainingSchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import ReactJson from "react-json-view";
import { Copy } from "lucide-react";

const Training = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);

  const { data: trainingData = [], isLoading: isLoadingTraining } = useQuery({
    queryKey: ["training"],
    queryFn: async () => {
      const response = await trainingAPI.getAll();
      return response.data?.data || [];
    },
    onError: (error) => {
      console.error("Error fetching training data:", error);
      toast.error("Failed to load training data");
    },
  });

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    control: controlCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm({
    resolver: yupResolver(trainingSchema),
    defaultValues: {
      tags: [""],
    },
  });

  const {
    fields: fieldsCreate,
    append: appendCreate,
    remove: removeCreate,
  } = useFieldArray({
    control: controlCreate,
    name: "tags",
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    control: controlEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
  } = useForm({
    resolver: yupResolver(trainingSchema),
  });

  const {
    fields: fieldsEdit,
    append: appendEdit,
    remove: removeEdit,
  } = useFieldArray({
    control: controlEdit,
    name: "tags",
  });

  const createMutation = useMutation({
    mutationFn: trainingAPI.create,
    onSuccess: () => {
      toast.success("Training data created successfully!");
      setIsCreateModalOpen(false);
      resetCreate();
      queryClient.invalidateQueries(["training"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to create training data";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => trainingAPI.update(id, data),
    onSuccess: () => {
      toast.success("Training data updated successfully!");
      setIsEditModalOpen(false);
      setEditingTraining(null);
      resetEdit();
      queryClient.invalidateQueries(["training"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update training data";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: trainingAPI.delete,
    onSuccess: () => {
      toast.success("Training data deleted successfully!");
      queryClient.invalidateQueries(["training"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete training data";
      toast.error(message);
    },
  });

  const handleCreate = (data) => {
    createMutation.mutate(data);
  };

  const handleEdit = (data) => {
    updateMutation.mutate({ id: editingTraining.id, data });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this training data?")) {
      deleteMutation.mutate(id);
    }
  };

  const openEditModal = (training) => {
    setEditingTraining(training);
    resetEdit(training);
    setIsEditModalOpen(true);
  };

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(trainingData, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "training.json";
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
            importedData.forEach((item) => {
              createMutation.mutate(item);
            });
          } else {
            toast.error(
              "Invalid JSON format. Expected an array of training data."
            );
          }
        } catch (error) {
          toast.error("Error parsing JSON file.", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredTrainingData = trainingData.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ).reverse();

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text", err);
    }
  };

  if (isLoadingTraining) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-2 md:gap-0 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Training
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage training data for the AI model.
          </p>
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
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Data</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Training Data</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmitCreate(handleCreate)}
                className="space-y-4"
              >
                <Input {...registerCreate("category")} placeholder="Category" />
                {errorsCreate.category && (
                  <p className="text-red-500">
                    {errorsCreate.category.message}
                  </p>
                )}
                <Input {...registerCreate("title")} placeholder="Title" />
                {errorsCreate.title && (
                  <p className="text-red-500">{errorsCreate.title.message}</p>
                )}
                <Textarea
                  {...registerCreate("content")}
                  placeholder="Content"
                />
                {errorsCreate.content && (
                  <p className="text-red-500">{errorsCreate.content.message}</p>
                )}
                <div>
                  <Label>Tags</Label>
                  {fieldsCreate.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 mt-2"
                    >
                      <Input
                        {...registerCreate(`tags.${index}`)}
                        placeholder="Tag"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeCreate(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => appendCreate("")}
                  >
                    Add Tag
                  </Button>
                </div>

                <Button type="submit" disabled={createMutation.isLoading}>
                  {createMutation.isLoading ? "Creating..." : "Create"}
                </Button>
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
              placeholder="Search..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredTrainingData.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.category}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteMutation.isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(item.title)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ReactJson
                src={item}
                theme="solarized"
                onEdit={(edit) => {
                  updateMutation.mutate({
                    id: item.id,
                    data: edit.updated_src,
                  });
                }}
                onDelete={() => {
                  handleDelete(item.id);
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Training Data</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(handleEdit)} className="space-y-4">
            <Input {...registerEdit("category")} placeholder="Category" />
            {errorsEdit.category && (
              <p className="text-red-500">{errorsEdit.category.message}</p>
            )}
            <Input {...registerEdit("title")} placeholder="Title" />
            {errorsEdit.title && (
              <p className="text-red-500">{errorsEdit.title.message}</p>
            )}
            <Textarea {...registerEdit("content")} placeholder="Content" />
            {errorsEdit.content && (
              <p className="text-red-500">{errorsEdit.content.message}</p>
            )}
            <div>
              <Label>Tags</Label>
              {fieldsEdit.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mt-2">
                  <Input {...registerEdit(`tags.${index}`)} placeholder="Tag" />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeEdit(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => appendEdit("")}
              >
                Add Tag
              </Button>
            </div>
            <Button type="submit" disabled={updateMutation.isLoading}>
              {updateMutation.isLoading ? "Updating..." : "Update"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Training;
