import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectAPI } from "../services/api";
import { projectSchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Switch } from "@/components/ui/switch";

const categoryOptions = [
  { value: "ai", label: "AI/ML" },
  { value: "tools", label: "Tools" },
  { value: "productivity", label: "Productivity" },
  { value: "graphics", label: "Graphics" },
  { value: "web", label: "Web Development" },
  { value: "mobile", label: "Mobile Development" },
];

const Projects = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const { data: projectsData = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await projectAPI.getAll();
      return response.data || [];
    },
    onError: (error) => {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    },
  });

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    control: controlCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      technologies: [""],
    },
  });

  const {
    fields: fieldsCreate,
    append: appendCreate,
    remove: removeCreate,
  } = useFieldArray({
    control: controlCreate,
    name: "technologies",
  });

    const {
    fields: fieldsCreateScreenshots,
    append: appendCreateScreenshots,
    remove: removeCreateScreenshots,
  } = useFieldArray({
    control: controlCreate,
    name: "screenshots",
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    control: controlEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
  } = useForm({
    resolver: yupResolver(projectSchema),
  });

  const {
    fields: fieldsEdit,
    append: appendEdit,
    remove: removeEdit,
  } = useFieldArray({
    control: controlEdit,
    name: "technologies",
  });


    const {
    fields: fieldsEditScreenshots,
    append: appendEditScreenshots,
    remove: removeEditScreenshots,
  } = useFieldArray({
    control: controlEdit,
    name: "screenshots",
  });

  const createMutation = useMutation({
    mutationFn: projectAPI.create,
    onSuccess: () => {
      toast.success("Project created successfully!");
      setIsCreateModalOpen(false);
      resetCreate();
      queryClient.invalidateQueries(["projects"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to create project";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => projectAPI.update(id, data),
    onSuccess: () => {
      toast.success("Project updated successfully!");
      setIsEditModalOpen(false);
      setEditingProject(null);
      resetEdit();
      queryClient.invalidateQueries(["projects"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update project";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: projectAPI.delete,
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries(["projects"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete project";
      toast.error(message);
    },
  });

  const handleCreateProject = (data) => {
    createMutation.mutate(data);
  };

  const handleEditProject = (data) => {
    updateMutation.mutate({ id: editingProject.id, data });
  };

  const handleDeleteProject = (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }
    deleteMutation.mutate(projectId);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    resetEdit(project);
    setIsEditModalOpen(true);
  };

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
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to your portfolio.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmitCreate(handleCreateProject)}
              className="space-y-4 max-h-[80vh] overflow-y-auto p-4"
            >
              <Input {...registerCreate("title")} placeholder="Title" />
              <Textarea
                {...registerCreate("description")}
                placeholder="Description"
              />
              <Textarea
                {...registerCreate("longDescription")}
                placeholder="Long Description"
              />
                            <Controller
                name="category"
                control={controlCreate}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Input {...registerCreate("liveUrl")} placeholder="Live URL" />
              <Input
                {...registerCreate("githubUrl")}
                placeholder="GitHub URL"
              />
              <Input {...registerCreate("image")} placeholder="Image URL" />
              <Textarea {...registerCreate("problem")} placeholder="Problem" />
              <Textarea {...registerCreate("process")} placeholder="Process" />
              <Textarea
                {...registerCreate("solution")}
                placeholder="Solution"
              />

              <Controller
                name="featured"
                control={controlCreate}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                )}
              />

              <Controller
                name="status"
                control={controlCreate}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="status">Active</Label>
                  </div>
                )}
              />
              <div>
                <Label>Screenshots</Label>
                {fieldsCreateScreenshots.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mt-2">
                    <Input
                      {...registerCreate(`screenshots.${index}`)}
                      placeholder="Screenshots"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeCreateScreenshots(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={() => appendCreateScreenshots("")}
                >
                  Add Screeshots
                </Button>
              </div>
              <div>
                <Label>Technologies</Label>
                {fieldsCreate.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mt-2">
                    <Input
                      {...registerCreate(`technologies.${index}`)}
                      placeholder="Technology"
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
                  Add Technology
                </Button>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isLoading}>
                  {createMutation.isLoading ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Projects ({projectsData.length})</CardTitle>
          <CardDescription>Manage your projects</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No projects found.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <img
                    src={project.image || "/blog-fallback.png"}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {project.category}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDeleteProject(project.id)}
                        disabled={deleteMutation.isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project information.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4 max-h-[80vh] overflow-y-auto p-4"
            onSubmit={handleSubmitEdit(handleEditProject)}
          >
            <Input {...registerEdit("title")} placeholder="Title" />
            <Textarea
              {...registerEdit("description")}
              placeholder="Description"
            />
            <Textarea
              {...registerEdit("longDescription")}
              placeholder="Long Description"
            />
                        <Controller
              name="category"
              control={controlEdit}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Input {...registerEdit("liveUrl")} placeholder="Live URL" />
            <Input {...registerEdit("githubUrl")} placeholder="GitHub URL" />
            <Input {...registerEdit("image")} placeholder="Image URL" />
            <Textarea {...registerEdit("problem")} placeholder="Problem" />
            <Textarea {...registerEdit("process")} placeholder="Process" />
            <Textarea {...registerEdit("solution")} placeholder="Solution" />

            <Controller
              name="featured"
              control={controlEdit}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured-edit"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="featured-edit">Featured</Label>
                </div>
              )}
            />

            <Controller
              name="status"
              control={controlEdit}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status-edit"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="status-edit">Active</Label>
                </div>
              )}
            />
            <div>
                <Label>Screenshots</Label>
                {fieldsEditScreenshots.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mt-2">
                    <Input
                      {...registerEdit(`screenshots.${index}`)}
                      placeholder="Screenshots"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeEditScreenshots(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={() => appendEditScreenshots("")}
                >
                  Add Screeshots
                </Button>
              </div>
            <div>
              <Label>Technologies</Label>
              {fieldsEdit.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 mt-2">
                  <Input
                    {...registerEdit(`technologies.${index}`)}
                    placeholder="Technology"
                  />
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
                Add Technology
              </Button>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isLoading}>
                {updateMutation.isLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
