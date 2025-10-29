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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Plus, Edit, Trash, Copy, Upload } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const Notes = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deleteNoteId, setDeleteNoteId] = useState(null);

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

  const confirmDeleteNote = () => {
    if (!deleteNoteId) return;
    deleteNote.mutate(deleteNoteId, {
      onSettled: () => setDeleteNoteId(null),
    });
  };

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

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(notes, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "notes.json";
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
            importedData.forEach((note) => {
              createNote.mutate(note);
            });
          } else {
            toast.error("Invalid JSON format. Expected an array of notes.");
          }
        } catch (error) {
          toast.error("Error parsing JSON file.", error);
        }
      };
      reader.readAsText(file);
    }
  };

  // ✅ Copy handler
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text", err);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-2 md:gap-0 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="mt-2">Create and manage your notes</p>
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
          <AlertDialog
            open={!!deleteNoteId}
            onOpenChange={() => setDeleteNoteId(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {" "}
                  Delete note "{notes.find((n) => n.id === deleteNoteId)?.title}
                  "?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The note will be permanently
                  deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteNoteId(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDeleteNote}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingNote(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingNote ? "Edit Note" : "Add New Note"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title">Title</label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingNote?.title || ""}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description">Description</label>
                  <Textarea
                    id="description"
                    name="content"
                    defaultValue={editingNote?.content || ""}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createNote.isLoading || updateNote.isLoading}
                  >
                    {editingNote ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{note.title}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingNote(note);
                    setOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteNoteId(note.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(note.content)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <p className="pr-8">{note.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notes;
