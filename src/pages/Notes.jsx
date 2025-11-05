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
import { Search } from "lucide-react";

const Notes = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredNotes = notes?.filter(  
    (note) =>
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ).reverse();

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
                    className="w-full h-40 resize-none overflow-y-auto border rounded-md p-2"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createNote.isPending || updateNote.isPending}
                  >
                    {editingNote ? "Update" : "Create"}
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
              placeholder="Search projects..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="
        relative max-h-[400px] overflow-y-scroll rounded-xl border border-gray-200 dark:border-gray-700
        bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800
        shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        before:absolute before:inset-0
        before:bg-[repeating-linear-gradient(white,white_24px,#e5e7eb_25px)]
        dark:before:bg-[repeating-linear-gradient(#1f2937,#1f2937_24px,#374151_25px)]
        before:opacity-60 before:-z-0
      "
            >
              {/* Red margin line (dark mode adjusted) */}
              <div className="absolute top-0 left-0 h-full w-[6px] bg-gradient-to-b from-green-300 via-blue-300 to-green-300 dark:from-green-600 dark:via-blue-700 dark:to-green-600 z-10" />

              {/* Card Header (title + buttons) */}
              <CardHeader className="relative flex flex-row items-center justify-between bg-transparent z-20 px-5 pt-2">
                <CardTitle className="font-handwriting text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-wide">
                  {note.title}
                </CardTitle>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingNote(note);
                      setOpen(true);
                    }}
                    className="hover:bg-rose-100 dark:hover:bg-green-900/40 text-green-500 dark:text-green-400"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteNoteId(note.id)}
                    className="hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 dark:text-red-400"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(note.content)}
                    className="hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-500 dark:text-blue-400"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Content */}
              <CardContent className="relative px-6 pb-6 pt-2 z-20">
                <p className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-200 font-medium">
                  {note.content}
                </p>
              </CardContent>

              {/* Bottom paper shadow */}
              <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-gray-200 dark:from-gray-700 to-transparent opacity-70"></div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
