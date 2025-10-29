import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tasksAPI } from "../services/api";
import { taskSchema } from "../utils/validationSchemas";
import TaskCard from "@/components/TaskCard";

const Tasks = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { register, handleSubmit, control, reset, setValue } = useForm({
    resolver: yupResolver(taskSchema),
  });

  const { data: tasksData = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await tasksAPI.getAll();
      return response.data || [];
    },
    onError: (error) => {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    },
  });

  useEffect(() => {
    if (editingTask) {
      setValue("title", editingTask.title);
      setValue("description", editingTask.description);
      setValue("priority", editingTask.priority);
      setValue("status", editingTask.status);
      setValue(
        "dueDate",
        editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split("T")[0]
          : ""
      );
    }
  }, [editingTask, setValue]);

  const createTaskMutation = useMutation({
    mutationFn: tasksAPI.create,
    onSuccess: () => {
      toast.success("Task created successfully!");
      setIsCreateModalOpen(false);
      reset();
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create task");
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => tasksAPI.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries(["tasks"]);
      const previousTasks = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (old) =>
        old.map((task) => (task.id === id ? { ...task, ...data } : task))
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
      toast.error(err.response?.data?.message || "Failed to update task");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: tasksAPI.delete,
    onSuccess: () => {
      toast.success("Task deleted successfully!");
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });

  const handleCreateTask = (data) => {
    createTaskMutation.mutate(data);
    console.log("loading state", createTaskMutation.isLoading);

    setEditingTask(null);
  };

  const handleEditTask = (data) => {
    updateTaskMutation.mutate({ id: editingTask.id, data });
    setIsEditModalOpen(false);
  };

  const handleDeleteTask = (id) => {
    setDeleteTaskId(id); // open confirmation modal
  };

  const confirmDeleteTask = () => {
    if (!deleteTaskId) return;
    deleteTaskMutation.mutate(deleteTaskId, {
      onSuccess: () => {
        setDeleteTaskId(null);
      },
      onSettled: () => {
        setDeleteTaskId(null);
      },
    });
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  console.log("loading state", createTaskMutation.isLoading);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // find original task by id (preserve original id type)
    const task = tasksData.find((t) => String(t.id) === String(draggableId));
    if (!task) return;

    const updatedTask = { ...task, status: destination.droppableId };
    // use real task.id (not draggableId string) for API
    updateTaskMutation.mutate({ id: task.id, data: updatedTask });
  };

  const filteredTasks = tasksData.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = {
    todo: filteredTasks.filter((task) => task.status === "todo"),
    "in-progress": filteredTasks.filter(
      (task) => task.status === "in-progress"
    ),
    completed: filteredTasks.filter((task) => task.status === "completed"),
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start gap-2 md:gap-0 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your tasks with drag-and-drop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new task</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmit(handleCreateTask)}
                className="space-y-4"
              >
                <Input {...register("title")} placeholder="Task title" />
                <Textarea
                  {...register("description")}
                  placeholder="Description"
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To-Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input {...register("dueDate")} type="date" />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createTaskMutation.isLoading}>
                    {createTaskMutation.isLoading ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="w-full">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <AlertDialog
        open={!!deleteTaskId}
        onOpenChange={() => setDeleteTaskId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              task and remove its data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTaskId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTask}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([columnId, tasks]) => (
            <Card key={columnId}>
              <CardHeader>
                <CardTitle className="capitalize">
                  {columnId.replace("-", " ")}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={
                        "min-h-[200px] p-2 rounded-md transition-colors " +
                        (snapshot.isDraggingOver
                          ? "border-2 border-dashed border-slate-300 bg-blue-900/50"
                          : "border border-transparent")
                      }
                    >
                      {tasks.length === 0 && (
                        <div className="py-8 text-center text-sm text-gray-400">
                          Drop tasks here
                        </div>
                      )}

                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={String(task.id)}
                          index={index}
                        >
                          {(providedDraggable, snapshotDraggable) => (
                            <div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              {...providedDraggable.dragHandleProps}
                              className={
                                "mb-3" +
                                (snapshotDraggable.isDragging
                                  ? "opacity-95 shadow-lg"
                                  : "")
                              }
                            >
                              <TaskCard
                                task={task}
                                onEdit={openEditModal}
                                onDelete={handleDeleteTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ))}
        </div>
      </DragDropContext>

      {/* Edit Task Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEditTask)} className="space-y-4">
            <Input {...register("title")} placeholder="Task title" />
            <Textarea {...register("description")} placeholder="Description" />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To-Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Input {...register("dueDate")} type="date" />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
