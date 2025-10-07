import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trainingAPI } from "../services/api";
import { trainingSchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";

const Training = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(trainingSchema),
  });

  const createMutation = useMutation({
    mutationFn: trainingAPI.create,
    onSuccess: () => {
      toast.success("Training data submitted successfully!");
      reset();
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to submit training data";
      toast.error(message);
    },
  });

  const handleTrain = (data) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Training
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Train your own personal data
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Train New Data</CardTitle>
          <CardDescription>Enter text to train the model.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleTrain)} className="space-y-4">
            <Textarea
              {...register("text")}
              placeholder="Enter training text..."
              rows={5}
            />
            {errors.text && (
              <p className="text-sm text-red-600">{errors.text.message}</p>
            )}
            <Button type="submit" disabled={createMutation.isLoading}>
              {createMutation.isLoading ? "Training..." : "Train"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Training;