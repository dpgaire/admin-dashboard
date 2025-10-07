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
import { blogAPI } from "../services/api";
import { blogSchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Switch } from "@/components/ui/switch";

const Blogs = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const { data: blogData = [], isLoading: isLoadingBlog } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const response = await blogAPI.getAll();
      return response.data || [];
    },
    onError: (error) => {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    },
  });

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    control: controlCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm({
    resolver: yupResolver(blogSchema),
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
    resolver: yupResolver(blogSchema),
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
    mutationFn: blogAPI.create,
    onSuccess: () => {
      toast.success("Blog created successfully!");
      setIsCreateModalOpen(false);
      resetCreate();
      queryClient.invalidateQueries(["blogs"]);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to create blog";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => blogAPI.update(id, data),
    onSuccess: () => {
      toast.success("Blog updated successfully!");
      setIsEditModalOpen(false);
      setEditingBlog(null);
      resetEdit();
      queryClient.invalidateQueries(["blogs"]);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to update blog";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blogAPI.delete,
    onSuccess: () => {
      toast.success("Blog deleted successfully!");
      queryClient.invalidateQueries(["blogs"]);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to delete blog";
      toast.error(message);
    },
  });

  const handleCreateBlog = (data) => {
    createMutation.mutate(data);
  };

  const handleEditBlog = (data) => {
    updateMutation.mutate({ id: editingBlog._id, data });
  };

  const handleDeleteBlog = (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }
    deleteMutation.mutate(blogId);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    resetEdit(blog);
    setIsEditModalOpen(true);
  };

  const filteredBlogs = blogData.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoadingBlog) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Blogs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your blogs
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Blog</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Blog</DialogTitle>
              <DialogDescription>Write a new blog post.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmitCreate(handleCreateBlog)}
              className="space-y-4 max-h-[80vh] overflow-y-auto p-4"
            >
              <Input {...registerCreate("title")} placeholder="Title" />
              <Textarea {...registerCreate("content")} placeholder="Content" />
              <Input {...registerCreate("author")} placeholder="Author" />
              <Input {...registerCreate("image")} placeholder="Image URL" />
              <Textarea {...registerCreate("excerpt")} placeholder="Excerpt" />
              <Input
                type="date"
                {...registerCreate("date")}
                placeholder="Date"
              />
              <Input
                type="number"
                {...registerCreate("likes")}
                placeholder="Likes"
              />
              <Controller
                name="featured"
                control={controlCreate}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured-create"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="featured-create">Featured</Label>
                  </div>
                )}
              />

              <div>
                <Label>Tags</Label>
                {fieldsCreate.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mt-2">
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
              placeholder="Search blogs..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Blogs ({blogData.length})</CardTitle>
          <CardDescription>Manage your blogs</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No blogs found.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="border rounded-lg overflow-hidden"
                >
                  <img
                    src={blog.image || "/blog-fallback.png"}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{blog.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {blog.content}
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(blog)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDeleteBlog(blog._id)}
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
            <DialogTitle>Edit Blog</DialogTitle>
            <DialogDescription>Update your blog post.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmitEdit(handleEditBlog)}
            className="space-y-4 max-h-[80vh] overflow-y-auto p-4"
          >
            <Input {...registerEdit("title")} placeholder="Title" />
            <Textarea {...registerEdit("content")} placeholder="Content" />
            <Input {...registerEdit("author")} placeholder="Author" />
            <Input {...registerEdit("image")} placeholder="Image URL" />
            <Textarea {...registerEdit("excerpt")} placeholder="Excerpt" />
            <Controller
              name="date"
              control={controlEdit}
              render={({ field }) => <Input {...field} placeholder="Date" />}
            />
            <Input
              type="number"
              {...registerEdit("likes")}
              placeholder="Likes"
            />
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

export default Blogs;
