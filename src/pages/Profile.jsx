import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  User,
  Mail,
  Shield,
  Save,
  Lock,
  Eye,
  EyeOff,
  Link,
  Copy,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useAuth } from "../context/AuthContext";
import { userUpdateSchema } from "../utils/validationSchemas";
import { usersAPI } from "../services/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

const Profile = () => {
  const queryClient = useQueryClient();
  const { user: authUser, setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    data: user = authUser,
    isLoading: isLoadingUser,
  } = useQuery({
    queryKey: ["user", authUser?.id],
    queryFn: async () => {
      const res = await usersAPI.getById(authUser.id);
      return res.data;
    },
    enabled: !!authUser?.id,
    staleTime: 5 * 60 * 1000,
  });

  const updateMutation = useMutation({
  mutationFn: (payload) => usersAPI.updateProfile(user.id, payload),
  onMutate: async (payload) => {
    await queryClient.cancelQueries({ queryKey: ["user", user.id] });

    const previous = queryClient.getQueryData(["user", user.id]);

    queryClient.setQueryData(["user", user.id], old => ({
      ...old,
      ...payload,
      image: payload.image || old.image,
    }));

    return { previous };
  },
  onError: (err, payload, context) => {
    queryClient.setQueryData(["user", user.id], context?.previous);
    toast.error("Update failed");
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});
const regenMutation = useMutation({
  mutationFn: (data) => usersAPI.updateProfile(user.id, data),

  onMutate: async () => {
    await queryClient.cancelQueries({ queryKey: ["user", authUser?.id] });

    const previous = queryClient.getQueryData(["user", authUser?.id]);
    queryClient.setQueryData(["user", authUser?.id], {
      ...previous,
      apiKey: "Regenerating...",
    });

    return { previous };
  },

  onError: (err, _variables, context) => {
    if (context?.previous) {
      queryClient.setQueryData(["user", authUser?.id], context.previous);
    }
    toast.error(err.response?.data?.message ?? "Failed to regenerate API key");
  },

  onSuccess: (res) => {
    // 👇 handle response safely
    const newApiKey = res?.data?.apiKey || res?.apiKey;
    if (!newApiKey) {
      toast.error("API key not found in server response");
      return;
    }

    const updated = { ...user, apiKey: newApiKey };

    // ✅ Update both React Query cache and AuthContext
    queryClient.setQueryData(["user", authUser?.id], updated);
    setUser(updated);

    toast.success("API key regenerated!");
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["user", authUser?.id] });
  },
});



  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(userUpdateSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "User",
      image: user?.image ?? "",
    },
  });

useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName ?? "",
        email: user.email ?? "",
        role: user.role ?? "admin",
        image: user.image ?? "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      image: data.image || null,
    };
    updateMutation.mutate(payload);
  };

  const regenSubmit = (data) => {
      const payload = {
      fullName: data.fullName,
      email: data.email,
      regenerateApiKey:true,
      role: data.role,
      image: data.image || null,
    };
    regenMutation.mutate(payload);
  };


  const handleCancel = () => {
    reset({
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "admin",
      image: user?.image ?? "",
    });
    setIsEditing(false);
  };

  const maskApiKey = (key) => {
    if (!key) return "N/A";
    if (key.length <= 8) return "****";
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  const copyApiKey = async () => {
    if (!user?.apiKey) {
      toast.error("No API key available");
      return;
    }
    try {
      await navigator.clipboard.writeText(user.apiKey);
       setCopied(true);
      toast.success("API key copied!");
       setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (isLoadingUser) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {user?.image ? (
                <img
                  src={user?.image}
                  alt={user?.fullName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-blue-500 text-white text-2xl">
                    {user?.fullName?.charAt(0)?.toUpperCase() ?? "A"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <CardTitle className="text-xl">{user?.fullName}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Shield className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm capitalize">{user?.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <User className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-green-600">Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your account details and preferences
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        disabled={!isEditing}
                        {...register("fullName")}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-red-600">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        disabled={!isEditing}
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* ---- Image URL & Password (only when editing) ---- */}
                {isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <div className="relative">
                        <Link className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="image"
                          type="url"
                          placeholder="https://example.com/avatar.jpg"
                          className="pl-10"
                          {...register("image")}
                          onChange={(e) => {
                            setValue("image", e.target.value);
                          }}
                        />
                      </div>
                      {errors.image && (
                        <p className="text-sm text-red-600">
                          {errors.image.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">New Password (Optional)</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Leave blank to keep current"
                          className="pl-10 pr-10"
                          autoComplete="new-password"
                          {...register("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-600">
                          {errors.password.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Leave blank if you don't want to change your password
                      </p>
                    </div>
                  </div>
                )}

                {/* ---- Submit / Cancel ---- */}
                {isEditing && (
                  <div className="flex items-center space-x-4 pt-4">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="flex items-center space-x-2"
                    >
                      {updateMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>
                        {updateMutation.isPending ? "Saving…" : "Save Changes"}
                      </span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={updateMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>API Key</CardTitle>
              <CardDescription>
                Manage your API key for programmatic access
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">Your API Key</p>
                      <p className="text-sm font-mono">
                        {maskApiKey(user?.apiKey)}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyApiKey}
                      className="flex items-center space-x-1"
                    >
                      <Copy className="h-4 w-4" />
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </Button>

                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regenSubmit(user)}
                        disabled={regenMutation.isPending}
                        className="flex items-center space-x-1"
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${
                            regenMutation.isPending ? "animate-spin" : ""
                          }`}
                        />
                        <span>Regenerate</span>
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <strong>Warning:</strong> Regenerating your API key will
                  invalidate the current one. Update any applications using it
                  immediately.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;