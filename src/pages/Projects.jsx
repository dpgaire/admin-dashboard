import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Layers,
  FolderOpen,
  Save,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { subcategoriesAPI, categoriesAPI, projectAPI } from "../services/api";
import { subcategorySchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const Projects = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  const { data: projectsData = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await projectAPI.getAll();
      return response.data || [];
    },
    onError: (error) => {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to load subcategories");
    },
  });

  // const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
  //   queryKey: ["categories"],
  //   queryFn: async () => {
  //     const response = await categoriesAPI.getAll();
  //     return response.data || [];
  //   },
  //   onError: (error) => {
  //     console.error("Error fetching categories:", error);
  //     toast.error("Failed to load categories");
  //   },
  // });

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
    setValue: setValueCreate,
  } = useForm({
    resolver: yupResolver(subcategorySchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue: setValueEdit,
  } = useForm({
    resolver: yupResolver(subcategorySchema),
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
      const { categoryId, ...rest } = data;
      const transformedData = {
        ...rest,
        category_id: categoryId, // rename field
      };

      return subcategoriesAPI.create(transformedData);
    },
    onSuccess: () => {
      toast.success("Subcategory created successfully!");
      setIsCreateModalOpen(false);
      resetCreate();
      queryClient.invalidateQueries(["subcategories"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to create subcategory";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      const { categoryId, ...rest } = data;
      const transformedData = {
        ...rest,
        category_id: categoryId, // rename field
      };

      return subcategoriesAPI.update(id, transformedData);
    },
    onSuccess: () => {
      toast.success("Subcategory updated successfully!");
      setIsEditModalOpen(false);
      setEditingSubcategory(null);
      resetEdit();
      queryClient.invalidateQueries(["subcategories"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update subcategory";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: subcategoriesAPI.delete,
    onSuccess: () => {
      toast.success("Subcategory deleted successfully!");
      queryClient.invalidateQueries(["subcategories"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete subcategory";
      toast.error(message);
    },
  });

  const handleCreateSubcategory = (data) => {
    createMutation.mutate(data);
  };

  // const handleEditSubcategory = (data) => {
  //   updateMutation.mutate({ id: editingSubcategory._id, data });
  // };

  // const handleDeleteSubcategory = (subcategoryId) => {
  //   if (
  //     !window.confirm(
  //       "Are you sure you want to delete this subcategory? This will also delete all associated items."
  //     )
  //   ) {
  //     return;
  //   }
  //   deleteMutation.mutate(subcategoryId);
  // };

  // const openEditModal = (subcategory) => {
  //   setEditingSubcategory(subcategory);
  //   resetEdit({
  //     name: subcategory.name,
  //     description: subcategory.description || "",
  //     categoryId: subcategory.categoryId,
  //   });
  //   setIsEditModalOpen(true);
  // };

  // const getCategoryName = (categoryId) => {
  //   const category = categories.find((cat) => cat._id === categoryId);
  //   return category ? category.name : "Unknown Category";
  // };

  const filteredProjects = projectsData.filter(
    (project) =>
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (isLoadingProjects) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your projects
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Project</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to organize content
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmitCreate(handleCreateSubcategory)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="create-title">Title</Label>
                <div className="relative">
                  <Layers className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                <Label htmlFor="create-categoryId">Select Category</Label>
                <Select
                  onValueChange={(value) => setValueCreate("categoryId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))} */}
                  </SelectContent>
                </Select>
                {errorsCreate.categoryId && (
                  <p className="text-sm text-red-600">
                    {errorsCreate.categoryId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="create-description"
                  placeholder="Enter subcategory description"
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
                      <span>Create Subcategory</span>
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

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects by name, description, or parent category..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Subcategories List */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects ({projectsData.length})</CardTitle>
          <CardDescription>Manage projects</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "No subcategories found matching your search."
                  : "No subcategories found."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="flex flex-col border rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Image Section */}
                  {project.image && (
                    <div className="relative h-40 w-full">
                      <img
                        // src={project.image}
                        src={"/blog-fallback.png"}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                      {project.featured && (
                        <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md shadow-md">
                          🌟 Featured
                        </span>
                      )}
                      {project.status && (
                        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow-md">
                          ✅ Active
                        </span>
                      )}
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="flex flex-col p-5 flex-1">
                    {/* Title + Category */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {project.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="text-xs flex items-center"
                      >
                        <FolderOpen className="h-3 w-3 mr-1" />{" "}
                        {project.category}
                      </Badge>
                    </div>

                    {/* Short Description */}
                    {project.description && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {/* Long Description */}
                    {project.longDescription && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {project.longDescription}
                      </p>
                    )}

                    {/* Technologies */}
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.technologies.map((tech, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-4 mt-4 text-sm font-medium">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          🔗 Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 dark:text-gray-300 hover:underline"
                        >
                          💻 GitHub
                        </a>
                      )}
                    </div>

                    {/* Problem/Process/Solution */}
                    {(project.problem ||
                      project.process ||
                      project.solution) && (
                      <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-400">
                        {project.problem && (
                          <p>⚠️ Problem: {project.problem}</p>
                        )}
                        {project.process && (
                          <p>🔄 Process: {project.process}</p>
                        )}
                        {project.solution && (
                          <p>✅ Solution: {project.solution}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end p-3 border-t bg-gray-50 dark:bg-gray-800">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:text-indigo-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 transition-colors"
                      disabled={deleteMutation.isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Subcategory Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
            <DialogDescription>
              Update subcategory information
            </DialogDescription>
          </DialogHeader>
          <form
            // onSubmit={handleSubmitEdit(handleEditSubcategory)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-name">Subcategory Name</Label>
              <div className="relative">
                <Layers className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="edit-name"
                  placeholder="Enter subcategory name"
                  className="pl-10"
                  {...registerEdit("name")}
                />
              </div>
              {errorsEdit.name && (
                <p className="text-sm text-red-600">
                  {errorsEdit.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-categoryId">Parent Category</Label>
              <Select
                onValueChange={(value) => setValueEdit("categoryId", value)}
                defaultValue={editingSubcategory?.categoryId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  {/* {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
              {errorsEdit.categoryId && (
                <p className="text-sm text-red-600">
                  {errorsEdit.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter subcategory description"
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
                    <span>Update Subcategory</span>
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

export default Projects;
