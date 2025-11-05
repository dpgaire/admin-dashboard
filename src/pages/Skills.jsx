import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Layers,
  Save,
  X,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { skillsAPI } from "../services/api";
import { skillSchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const Skills = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const { data: skillsData = [], isLoading: isLoadingSkills } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const response = await skillsAPI.getAll();
      return response.data || [];
    },
    onError: (error) => {
      console.error("Error fetching skills:", error);
      toast.error("Failed to load skills");
    },
  });

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    control: controlCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm({
    resolver: yupResolver(skillSchema),
    defaultValues: {
      skills: [{ name: "", percentage: "" }],
    },
  });

  const {
    fields: fieldsCreate,
    append: appendCreate,
    remove: removeCreate,
  } = useFieldArray({
    control: controlCreate,
    name: "skills",
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    control: controlEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
  } = useForm({
    resolver: yupResolver(skillSchema),
  });

  const {
    fields: fieldsEdit,
    append: appendEdit,
    remove: removeEdit,
  } = useFieldArray({
    control: controlEdit,
    name: "skills",
  });

  const createMutation = useMutation({
    mutationFn: skillsAPI.create,
    onSuccess: () => {
      toast.success("Skill created successfully!");
      setIsCreateModalOpen(false);
      resetCreate();
      queryClient.invalidateQueries(["skills"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to create skill";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => skillsAPI.update(id, data),
    onSuccess: () => {
      toast.success("Skill updated successfully!");
      setIsEditModalOpen(false);
      setEditingSkill(null);
      resetEdit();
      queryClient.invalidateQueries(["skills"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update skill";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: skillsAPI.delete,
    onSuccess: () => {
      toast.success("Skill deleted successfully!");
      queryClient.invalidateQueries(["skills"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to delete skill";
      toast.error(message);
    },
  });

  const handleCreateSkill = (data) => {
    createMutation.mutate(data);
  };

  const handleEditSkill = (data) => {
    updateMutation.mutate({ id: editingSkill.id, data });
  };

  const handleDeleteSkill = (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }
    deleteMutation.mutate(skillId);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    resetEdit(skill);
    setIsEditModalOpen(true);
  };

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(skillsData, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "skills.json";
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
            importedData.forEach((skill) => {
              createMutation.mutate(skill);
            });
          } else {
            toast.error("Invalid JSON format. Expected an array of skills.");
          }
        } catch (error) {
          toast.error("Error parsing JSON file.",error);
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredSkills = skillsData.filter((skill) =>
    skill.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ).reverse();

  if (isLoadingSkills) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
           <div className="flex flex-col md:flex-row items-start gap-2 md:gap-0 md:items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Skills
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your skills
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
              <span>Add Skill</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Skill</DialogTitle>
              <DialogDescription>
                Add a new skill category and individual skills.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmitCreate(handleCreateSkill)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="create-title">Title</Label>
                <Input
                  id="create-title"
                  placeholder="e.g., Frontend"
                  {...registerCreate("title")}
                />
                {errorsCreate.title && (
                  <p className="text-sm text-red-600">
                    {errorsCreate.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-icon">Icon (Optional)</Label>
                <Input
                  id="create-icon"
                  placeholder="e.g., <Code />"
                  {...registerCreate("icon")}
                />
                {errorsCreate.icon && (
                  <p className="text-sm text-red-600">
                    {errorsCreate.icon.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label>Skills</Label>
                {fieldsCreate.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Skill name (e.g., React)"
                        {...registerCreate(`skills.${index}.name`)}
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        placeholder="%"
                        {...registerCreate(`skills.${index}.percentage`)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCreate(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendCreate({ name: "", percentage: "" })}
                >
                  Add Skill
                </Button>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1"
                >
                  {createMutation.isPending ? "Creating..." : "Create Skill"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
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
              placeholder="Search by title..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Skills ({skillsData.length})</CardTitle>
          <CardDescription>Manage your skills</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSkills.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No skills found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{skill.icon}{' '}{skill.title}</h3>
                    <div className="text-sm text-gray-500">
                      {skill.skills.map((s) => s.name).join(", ")}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(skill)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={deleteMutation.isPending}
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>
              Update the skill category and individual skills.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmitEdit(handleEditSkill)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                placeholder="e.g., Frontend"
                {...registerEdit("title")}
              />
              {errorsEdit.title && (
                <p className="text-sm text-red-600">
                  {errorsEdit.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-icon">Icon (Optional)</Label>
              <Input
                id="edit-icon"
                placeholder="e.g., <Code />"
                {...registerEdit("icon")}
              />
              {errorsEdit.icon && (
                <p className="text-sm text-red-600">
                  {errorsEdit.icon.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <Label>Skills</Label>
              {fieldsEdit.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Skill name (e.g., React)"
                      {...registerEdit(`skills.${index}.name`)}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      placeholder="%"
                      {...registerEdit(`skills.${index}.percentage`)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEdit(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendEdit({ name: "", percentage: "" })}
              >
                Add Skill
              </Button>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1"
              >
                {updateMutation.isPending ? "Updating..." : "Update Skill"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={updateMutation.isPending}
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

export default Skills;