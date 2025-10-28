import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2, FolderOpen, Save } from "lucide-react";
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
import { aboutAPI } from "../services/api";
import { aboutSchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const About = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAbout, setEditingAbout] = useState(null);

  // let isLoading = false

  const { data: aboutData = [], isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: async () => {
      const response = await aboutAPI.getAll();
      return response.data || [];
    },
    onError: (error) => {
      console.error("Error fetching about:", error);
      toast.error("Failed to load about");
    },
  });

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm({
    resolver: yupResolver(aboutSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
  } = useForm({
    resolver: yupResolver(aboutSchema),
  });

  const createMutation = useMutation({
    mutationFn: aboutAPI.create,
    onSuccess: () => {
      toast.success("About created successfully!");
      setIsCreateModalOpen(false);
      resetCreate();
      queryClient.invalidateQueries(["about"]);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to create about";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => aboutAPI.update(id, data),
    onSuccess: () => {
      toast.success("Category updated successfully!");
      setIsEditModalOpen(false);
      setEditingAbout(null);
      resetEdit();
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update category";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: aboutAPI.delete,
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries(["about"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete category";
      toast.error(message);
    },
  });

  const handleCreateAbout = (data) => {
    createMutation.mutate(data);
  };

  const handleEditAbout = (data) => {
    updateMutation.mutate({ id: editingAbout.id, data });
  };

  const handleDeleteAbout = (aboutId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this item? This will also delete all associated subcategories and items."
      )
    ) {
      return;
    }
    deleteMutation.mutate(aboutId);
  };

  const openEditModal = (about) => {
    setEditingAbout(about);
    resetEdit({
      title: about.title,
      description: about.description || "",
    });
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            About Section
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage content about for organizing materials
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add About</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New About</DialogTitle>
              <DialogDescription>
                Add a new about to organize content
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmitCreate(handleCreateAbout)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="create-title">Title</Label>
                <div className="relative">
                  <FolderOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="create-title"
                    placeholder="Enter title"
                    className="pl-10"
                    {...registerCreate("title")}
                  />
                </div>
                {errorsCreate.title && (
                  <p className="text-sm text-red-600">
                    {errorsCreate.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-description">Description</Label>
                <Textarea
                  id="create-description"
                  placeholder="Enter description"
                  rows={3}
                  {...registerCreate("description")}
                />
                {errorsCreate.description && (
                  <p className="text-sm text-red-600">
                    {errorsCreate.description.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="flex-1"
                >
                  {createMutation.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Create</span>
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={createMutation.isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>About Section </CardTitle>
          <CardDescription>
            Manage content about and their descriptions
          </CardDescription>
        </CardHeader>

        <CardContent>
          {aboutData.length > 0 ? (
            aboutData.map((item, index) => (
              <div
                key={index}
                className="max-w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Top Banner / Profile Section */}
                <div className="relative w-full h-40 sm:h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <img
                      src={
                        "https://dpgaire.github.io/image-server/projects/durga.png"
                      }
                      alt={item.title}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
                    />
                  </div>
                </div>

                {/* Main Content */}
                <div className="pt-20 pb-8 px-6 sm:px-10 text-center">
                  {/* Title + Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {item.title}
                      </h2>
                      <p className="text-sm text-left text-gray-500 dark:text-gray-400 mt-1">
                        Updated on {new Date().toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex justify-center sm:justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(item)}
                        className="hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAbout(item.id)}
                        className="hover:bg-red-50 dark:hover:bg-gray-700"
                        disabled={deleteMutation.isLoading}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-base text-left sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                    {item.description}
                  </p>

                  {/* Info Boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-sm">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Created
                      </p>
                      <p className="text-base font-semibold text-gray-800 dark:text-white">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl shadow-sm">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Status
                      </p>
                      <p className="text-base font-semibold text-green-600 dark:text-green-400">
                        Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No About information found.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit About</DialogTitle>
            <DialogDescription>Update about information</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmitEdit(handleEditAbout)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-name">Title</Label>
              <div className="relative">
                <FolderOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="edit-name"
                  placeholder="Enter title"
                  className="pl-10"
                  {...registerEdit("title")}
                />
              </div>
              {errorsEdit.name && (
                <p className="text-sm text-red-600">
                  {errorsEdit.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter  description"
                rows={3}
                {...registerEdit("description")}
              />
              {errorsEdit.description && (
                <p className="text-sm text-red-600">
                  {errorsEdit.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Button
                type="submit"
                disabled={updateMutation.isLoading}
                className="flex-1"
              >
                {updateMutation.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Update About</span>
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={updateMutation.isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default About;
