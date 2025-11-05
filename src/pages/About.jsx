import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Briefcase,
  BarChart,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Target,
  Lightbulb,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { aboutAPI } from "../services/api";
import { aboutSchema } from "../utils/validationSchemas";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Minimize } from "lucide-react";
import { Maximize } from "lucide-react";

const emptyAbout = {
  title: "",
  tagline: "",
  description: "",
  philosophy: "",
  tags: [],
  areasOfExpertise: [],
  stats: [],
  contactDetails: {
    email: "",
    phone: "",
    location: "",
    profileImage: "",
    cv: "",
  },
};

const About = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { data: aboutData, isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: async () => {
      const response = await aboutAPI.getAll();
      return response.data && response.data.length > 0
        ? response.data[0]
        : null;
    },
    onError: (error) => {
      console.error("Error fetching about:", error);
      toast.error("Failed to load about information");
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(aboutSchema),
    defaultValues: aboutData || emptyAbout,
  });

  useEffect(() => {
    reset(aboutData || emptyAbout);
  }, [aboutData, reset]);

  const {
    fields: tagsFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({ control, name: "tags" });

  const {
    fields: expertiseFields,
    append: appendExpertise,
    remove: removeExpertise,
  } = useFieldArray({ control, name: "areasOfExpertise" });

  const {
    fields: statsFields,
    append: appendStat,
    remove: removeStat,
  } = useFieldArray({ control, name: "stats" });

  const createMutation = useMutation({
    mutationFn: aboutAPI.create,
    onSuccess: () => {
      toast.success("About information created successfully!");
      setIsModalOpen(false);
      queryClient.invalidateQueries(["about"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to create about information";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => aboutAPI.update(aboutData.id, data),
    onSuccess: () => {
      toast.success("About information updated successfully!");
      setIsModalOpen(false);
      queryClient.invalidateQueries(["about"]);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update about information";
      toast.error(message);
    },
  });

  const handleSaveAbout = (data) => {
    if (aboutData) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const toggleFullScreen = () => {
    const iframe = document.getElementById(`pdf-iframe`);
    if (iframe) {
      if (!isFullScreen) {
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) {
          /* Firefox */
          iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) {
          /* Chrome, Safari and Opera */
          iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
          /* IE/Edge */
          iframe.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          /* Firefox */
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          /* Chrome, Safari and Opera */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          /* IE/Edge */
          document.msExitFullscreen();
        }
      }
      setIsFullScreen(!isFullScreen);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const renderForm = () => (
    <ScrollArea className="h-[75vh] w-full pr-4">
      <form onSubmit={handleSubmit(handleSaveAbout)}>
        {/* Basic Information */}
        <Card className="border-2 rounded-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div>
              <Label htmlFor="title" className="text-sm font-semibold">
                Title
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., John Doe – Senior Full Stack Developer"
                className="mt-1"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="tagline" className="text-sm font-semibold">
                Tagline
              </Label>
              <Input
                id="tagline"
                {...register("tagline")}
                placeholder="e.g., Building the future, one line at a time"
                className="mt-1"
              />
              {errors.tagline && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.tagline.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Tell us about your journey..."
                rows={4}
                className="mt-1 resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="philosophy" className="text-sm font-semibold">
                Philosophy
              </Label>
              <Textarea
                id="philosophy"
                {...register("philosophy")}
                placeholder="Your core beliefs and approach..."
                rows={3}
                className="mt-1 resize-none"
              />
              {errors.philosophy && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.philosophy.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="border-2 rounded-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Badge className="h-5 w-5 p-0 flex items-center justify-center">
                T
              </Badge>
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {tagsFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`tags.${index}`)}
                  placeholder="e.g., React, TypeScript"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeTag(index)}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendTag("")}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Tag
            </Button>
            {errors.tags && (
              <p className="text-red-500 text-xs">{errors.tags.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Areas of Expertise */}
        <Card className="border-2 rounded-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Areas of Expertise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {expertiseFields.map((field, index) => (
              <Card key={field.id} className="p-4 border">
                <div className="space-y-3">
                  <Input
                    {...register(`areasOfExpertise.${index}.title`)}
                    placeholder="Area Title (e.g., Frontend Development)"
                  />
                  <Textarea
                    {...register(`areasOfExpertise.${index}.description`)}
                    placeholder="Describe your expertise..."
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeExpertise(index)}
                    className="w-fit"
                  >
                    Remove Area
                  </Button>
                </div>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendExpertise({ title: "", description: "" })}
              className="fit"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Expertise
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="border-2 rounded-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              Key Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {statsFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border space-y-3 bg-gray-50 dark:bg-gray-800"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Title</Label>
                    <Input
                      {...register(`stats.${index}.title`)}
                      placeholder="e.g., Projects Completed"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Count</Label>
                    <Input
                      {...register(`stats.${index}.count`)}
                      placeholder="e.g., 50+"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeStat(index)}
                  className="w-fit"
                >
                  Remove Stat
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendStat({ title: "", count: "" })}
              className="w-fit"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Stat
            </Button>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card className="border-2 rounded-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("contactDetails.email")}
                placeholder="you@example.com"
                className="mt-1"
              />
              {errors.contactDetails?.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contactDetails.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register("contactDetails.phone")}
                placeholder="+1 (555) 000-0000"
                className="mt-1"
              />
              {errors.contactDetails?.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contactDetails.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register("contactDetails.location")}
                placeholder="San Francisco, CA"
                className="mt-1"
              />
              {errors.contactDetails?.location && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contactDetails.location.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="profileImage">Profile Image URL</Label>
              <Input
                id="profileImage"
                {...register("contactDetails.profileImage")}
                placeholder="https://example.com/avatar.jpg"
                className="mt-1"
              />
              {errors.contactDetails?.profileImage && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contactDetails.profileImage.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="cv">Latest CV</Label>
              <Input
                id="cv"
                {...register("contactDetails.cv")}
                placeholder="https://durga_cv.pdf"
                className="mt-1"
              />
              {errors.contactDetails?.cv && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contactDetails.cv.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 pb-4 sticky bottom-0 bg-white dark:bg-gray-900 border-t -mx-6 px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            size="lg"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="min-w-32"
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </ScrollArea>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              About Section
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your professional profile and expertise
            </p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                onClick={() => reset(aboutData || emptyAbout)}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                {aboutData ? (
                  <>
                    <Edit className="h-5 w-5 mr-2" />
                    Edit Profile
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Create Profile
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent  className={`sm:max-w-4xl ${
                              isFullScreen ? "w-screen h-screen max-w-none" : ""
                            }`}>
              {renderForm()}
            </DialogContent>
          </Dialog>
        </div>

        {/* Profile Display */}
        {aboutData ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Profile Card */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                {/* Hero Section */}
                <div className="relative h-48 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                    <Avatar className="h-32 w-32 ring-8 ring-white dark:ring-gray-900 shadow-2xl">
                      <AvatarImage
                        src={aboutData.contactDetails?.profileImage}
                        alt={aboutData.title}
                      />

                      <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {aboutData.title?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {aboutData.contactDetails?.cv && (
                      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="relative mt-2 px-5 py-2 font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer"
                            >
                              <FileText className="h-4 w-4 mr-2" /> View CV
                            </Button>
                          </DialogTrigger>

                          <DialogContent
                            className={`sm:max-w-4xl ${
                              isFullScreen ? "w-screen h-screen max-w-none" : ""
                            }`}
                          >
                            <DialogHeader className="flex flex-row justify-between items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleFullScreen}
                              >
                                {isFullScreen ? (
                                  <Minimize className="h-4 w-4" />
                                ) : (
                                  <Maximize className="h-4 w-4" />
                                )}
                              </Button>
                            </DialogHeader>
                            <div
                              className={`h-[80vh] ${
                                isFullScreen ? "h-[calc(100vh-80px)]" : ""
                              }`}
                            >
                              <iframe
                                id="pdf-iframe"
                                src={aboutData.contactDetails.cv}
                                className="w-full h-full"
                                title="CV"
                              ></iframe>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <CardContent className="pt-20 pb-8 space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {aboutData.title}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                      {aboutData.tagline}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-3">
                      {aboutData.tags?.map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="font-medium"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      About
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {aboutData.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                      Philosophy
                    </h3>
                    <blockquote className="italic text-lg text-gray-600 dark:text-gray-400 border-l-4 border-blue-500 pl-4">
                      "{aboutData.philosophy}"
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Expertise */}
              {aboutData.areasOfExpertise?.length > 0 && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {aboutData.areasOfExpertise.map((area) => (
                      <div
                        key={area.title}
                        className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {area.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {area.description}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              {aboutData.stats?.length > 0 && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {aboutData.stats.map((stat) => (
                        <div
                          key={stat.title}
                          className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stat.count}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {stat.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact */}
              <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                <h3 className="text-xl font-semibold mb-2">Contact Me</h3>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                  <Mail />{" "}
                  <a href={`mailto:${aboutData.contactDetails?.email}`}>
                    {aboutData.contactDetails?.email}
                  </a>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mt-2">
                  <Phone /> <span>{aboutData.contactDetails?.phone}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mt-2">
                  <MapPin /> <span>{aboutData.contactDetails?.location}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Card className="border-dashed border-2">
            <CardContent className="p-16 text-center">
              <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                No Profile Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Click the button above to create your professional profile.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default About;
