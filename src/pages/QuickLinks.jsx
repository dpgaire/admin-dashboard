import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quickLinksAPI } from "@/services/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Plus, Edit, Trash, Link as LinkIcon } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const QuickLinks = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  const { data: quickLinks, isLoading } = useQuery({
    queryKey: ["quickLinks"],
    queryFn: async () => {
      try {
        const response = await quickLinksAPI.getAll();
        return response.data;
      } catch (error) {
        console.error("Error fetching quick links:", error);
        toast.error("Failed to load quick links");
        return [];
      }
    },
  });

  const createQuickLink = useMutation({
    mutationFn: quickLinksAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["quickLinks"]);
      toast.success("Quick link created successfully");
      setOpen(false);
      setEditingLink(null);
    },
    onError: () => {
      toast.error("Failed to create quick link");
    },
  });

  const updateQuickLink = useMutation({
    mutationFn: (data) => quickLinksAPI.update(editingLink.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["quickLinks"]);
      toast.success("Quick link updated successfully");
      setOpen(false);
      setEditingLink(null);
    },
    onError: () => {
      toast.error("Failed to update quick link");
    },
  });

  const deleteQuickLink = useMutation({
    mutationFn: quickLinksAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["quickLinks"]);
      toast.success("Quick link deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete quick link");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (editingLink) {
      updateQuickLink.mutate(data);
    } else {
      createQuickLink.mutate(data);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold ">Quick Links</h1>
          <p className="mt-2">Create and manage your quick links</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingLink(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLink ? "Edit Link" : "Add New Link"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title">Title</label>
                <Input id="title" name="title" defaultValue={editingLink?.title || ""} required />
              </div>
              <div>
                <label htmlFor="link">Link</label>
                <Input id="link" name="link" defaultValue={editingLink?.link || ""} required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createQuickLink.isLoading || updateQuickLink.isLoading}>
                  {editingLink ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickLinks.map((link) => (
          <Card key={link.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{link.title}</CardTitle>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => { setEditingLink(link); setOpen(true); }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteQuickLink.mutate(link.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <a href={link.link} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
                <LinkIcon className="mr-2 h-4 w-4" />
                {link.link}
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
