import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notesAPI } from "@/services/api";
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
  DialogFooter 
} from "@/components/ui/dialog";
import { Plus, Edit, Trash } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const Notes = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      try {
        const response = await notesAPI.getAll();
        return response.data;
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to load notes");
        return [];
      }
    },
  });

  const createNote = useMutation({
    mutationFn: notesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      toast.success("Note created successfully");
      setOpen(false);
      setEditingNote(null);
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const updateNote = useMutation({
    mutationFn: (data) => notesAPI.update(editingNote.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      toast.success("Note updated successfully");
      setOpen(false);
      setEditingNote(null);
    },
    onError: () => {
      toast.error("Failed to update note");
    },
  });

  const deleteNote = useMutation({
    mutationFn: notesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      toast.success("Note deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (editingNote) {
      updateNote.mutate(data);
    } else {
      createNote.mutate(data);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold ">Notes</h1>
          <p className="mt-2">Create and manage your notes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingNote(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingNote ? "Edit Note" : "Add New Note"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title">Title</label>
                <Input id="title" name="title" defaultValue={editingNote?.title || ""} required />
              </div>
              <div>
                <label htmlFor="description">Description</label>
                <Textarea id="description" name="content" defaultValue={editingNote?.content || ""} required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createNote.isLoading || updateNote.isLoading}>
                  {editingNote ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{note.title}</CardTitle>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => { setEditingNote(note); setOpen(true); }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteNote.mutate(note.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p>{note.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notes;