import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsAPI } from "../services/api";
import toast from "react-hot-toast";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Home,
  Palette,
  Share2,
  Shield,
  Bot,
  Settings as IconSettings,
  Globe,
  Type,
  Image,
  Edit3,
  Layout,
  Search,
  Key,
  Users,
  Bell,
  BarChart3,
  Database,
  Mail,
  FileText,
  Timer,
  Plug,
  HardDrive,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

const settingsSchema = z.object({
  // General
  siteTitle: z.string().min(1, "Site title is required"),
  siteUrl: z.string().url("Invalid URL").or(z.literal("")),
  siteDescription: z.string(),
  footerText: z.string(),
  defaultTimezone: z.string().default("UTC"),

  // Appearance
  themeColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  primaryFont: z.string().default("Inter"),
  faviconUrl: z.string().url().or(z.literal("")),
  enableAnimations: z.boolean(),

  // Social
  linkedinUrl: z.string().url().or(z.literal("")),
  githubUrl: z.string().url().or(z.literal("")),
  twitterUrl: z.string().url().or(z.literal("")),
  instagramUrl: z.string().url().or(z.literal("")),
  youtubeUrl: z.string().url().or(z.literal("")),

  // SEO
  metaKeywords: z.string(),
  googleAnalyticsId: z.string(),
  googleVerification: z.string(),
  robotsTxt: z.string(),
  enableSitemap: z.boolean(),

  // Security
  allowRegistration: z.boolean(),
  sessionTimeout: z.number().int().min(300).max(86400),
  enable2FA: z.boolean(),
  corsOrigins: z.string(),
  jwtSecret: z.string().min(16).or(z.literal("")),

  // Notifications
  enableEmails: z.boolean(),
  enableToasts: z.boolean(),
  toastPosition: z.enum([
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
  ]),
  notificationEmail: z.string().email().or(z.literal("")),

  // API Keys
  qdrantApiKey: z.string(),
  openAiApiKey: z.string(),
  stripeApiKey: z.string(),

  // Integrations
  googleDriveApiKey: z.string(),
  slackWebhook: z.string().url().or(z.literal("")),

  // AI Chatbot
  aiModel: z.enum(["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"]),
  aiTemperature: z.number().min(0).max(2),
  maxTokens: z.number().int().min(1).max(4000),
  enableChatHistory: z.boolean(),

  // Content Management
  defaultCategory: z.string(),
  maxBlogImageSize: z.number().int().min(1).max(50),
  autoGenerateExcerpt: z.boolean(),
  defaultTags: z.string(),

  // Productivity
  pomodoroWorkTime: z.number().int().min(1).max(120),
  pomodoroBreakTime: z.number().int().min(1).max(60),
  okrReviewPeriod: z.enum(["weekly", "monthly", "quarterly"]),
  enableQuotes: z.boolean(),

  // Editors
  markdownTheme: z.string(),
  jsonFormatterIndent: z.number().int().min(1).max(8),
  enableFullScreenEditors: z.boolean(),

  // User Management
  defaultUserRole: z.enum(["user", "admin", "viewer"]),
  requireEmailVerification: z.boolean(),

  // UI/UX
  enableDarkMode: z.boolean(),
  defaultTheme: z.enum(["light", "dark", "system"]),
  itemsPerPage: z.number().int().min(5).max(100),

  // Analytics
  enableLogging: z.boolean(),
  logLevel: z.enum(["debug", "info", "warn", "error"]),

  // Backup
  backupSchedule: z.enum(["daily", "weekly", "monthly", "never"]),
  exportFormat: z.enum(["json", "csv"]),

  // Email
  emailProvider: z.string(),
  smtpHost: z.string(),
  smtpPort: z.string(),
  smtpUser: z.string(),
  smtpPass: z.string(),

  // Advanced
  maintenanceMode: z.boolean(),
  maintenanceModeMessage: z.string(),
  cacheEnabled: z.boolean(),
  compressionEnabled: z.boolean(),
});

const fallbackSettings = {
  siteTitle: "AI Portfolio Dashboard",
  siteUrl: "https://yourportfolio.com",
  siteDescription:
    "A modern, responsive React admin dashboard for managing the content of a personal portfolio.",
  footerText: "© 2025 AI Portfolio",
  defaultTimezone: "UTC",

  themeColor: "#3b82f6",
  primaryFont: "Inter",
  faviconUrl: "/favicon.ico",
  enableAnimations: true,

  linkedinUrl: "https://linkedin.com",
  githubUrl: "https://github.com",
  twitterUrl: "",
  instagramUrl: "",
  youtubeUrl: "",

  metaKeywords: "portfolio, AI, developer, React, Tailwind",
  googleAnalyticsId: "",
  googleVerification: "",
  robotsTxt: "User-agent: *\nDisallow: /admin",
  enableSitemap: true,

  allowRegistration: false,
  sessionTimeout: 3600,
  enable2FA: false,
  corsOrigins: "http://localhost:3000,http://localhost:5173",
  jwtSecret: "",

  enableEmails: true,
  enableToasts: true,
  toastPosition: "top-right",
  notificationEmail: "",

  qdrantApiKey: "",
  openAiApiKey: "",
  stripeApiKey: "",

  googleDriveApiKey: "",
  slackWebhook: "",

  aiModel: "gpt-3.5-turbo",
  aiTemperature: 0.7,
  maxTokens: 1000,
  enableChatHistory: true,

  defaultCategory: "uncategorized",
  maxBlogImageSize: 5,
  autoGenerateExcerpt: true,
  defaultTags: "",

  pomodoroWorkTime: 25,
  pomodoroBreakTime: 5,
  okrReviewPeriod: "monthly",
  enableQuotes: true,

  markdownTheme: "default",
  jsonFormatterIndent: 2,
  enableFullScreenEditors: true,

  defaultUserRole: "user",
  requireEmailVerification: true,

  enableDarkMode: true,
  defaultTheme: "light",
  itemsPerPage: 10,

  enableLogging: true,
  logLevel: "info",

  backupSchedule: "weekly",
  exportFormat: "json",

  emailProvider: "smtp",
  smtpHost: "",
  smtpPort: "",
  smtpUser: "",
  smtpPass: "",

  maintenanceMode: false,
  maintenanceModeMessage:
    "The site is currently under maintenance. Please check back later.",
  cacheEnabled: true,
  compressionEnabled: true,
};

const Settings = () => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [color, setColor] = useState(fallbackSettings.themeColor);
  const [activeTab, setActiveTab] = useState("general.site");

  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: fallbackSettings,
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      try {
        const response = await settingsAPI.getAll();
        return { ...fallbackSettings, ...response.data };
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("Failed to load settings. Using fallback values.");
        return fallbackSettings;
      }
    },
  });

  const updateSettings = useMutation({
    mutationFn: settingsAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries(["settings"]);
      toast.success("Settings saved successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save settings");
    },
    onMutate: () => setIsSubmitting(true),
    onSettled: () => setIsSubmitting(false),
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
      setColor(settings.themeColor || "#3b82f6");
    }
  }, [settings, form]);

  const onSubmit = (data) => {
    data.themeColor = color;
    updateSettings.mutate(data);
  };

  const handleBackupNow = async () => {
    try {
      await settingsAPI.backup();
      toast.success("Backup created successfully!");
    } catch {
      toast.error("Backup failed");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const categories = [
    {
      value: "general",
      label: "General",
      icon: Home,
      children: [
        { value: "general.site", label: "Site Info", icon: Globe },
        { value: "general.footer", label: "Footer & Timezone", icon: Type },
      ],
    },
    {
      value: "design",
      label: "Design",
      icon: Palette,
      children: [
        { value: "design.appearance", label: "Appearance", icon: Image },
        { value: "design.editors", label: "Editors", icon: Edit3 },
        { value: "design.ui", label: "UI/UX", icon: Layout },
      ],
    },
    {
      value: "social",
      label: "Social & SEO",
      icon: Share2,
      children: [
        { value: "social.links", label: "Social Links", icon: Share2 },
        { value: "social.seo", label: "SEO Settings", icon: Search },
      ],
    },
    {
      value: "security",
      label: "Security",
      icon: Shield,
      children: [
        { value: "security.auth", label: "Authentication", icon: Key },
        { value: "security.users", label: "User Roles", icon: Users },
        { value: "security.api", label: "API Keys", icon: Key },
      ],
    },
    {
      value: "ai",
      label: "AI & Tools",
      icon: Bot,
      children: [
        { value: "ai.chat", label: "AI Chatbot", icon: Bot },
        { value: "ai.content", label: "Content", icon: FileText },
        { value: "ai.productivity", label: "Productivity", icon: Timer },
        { value: "ai.integrations", label: "Integrations", icon: Plug },
      ],
    },
    {
      value: "advanced",
      label: "Advanced",
      icon: IconSettings,
      children: [
        { value: "advanced.notifications", label: "Notifications", icon: Bell },
        { value: "advanced.analytics", label: "Analytics", icon: BarChart3 },
        { value: "advanced.backup", label: "Backup", icon: Database },
        { value: "advanced.email", label: "Email", icon: Mail },
        { value: "advanced.system", label: "System", icon: HardDrive },
      ],
    },
  ];

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isSubmitting} className="space-y-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 p-2 bg-muted rounded-lg h-auto">
                  {categories.map((cat) => (
                    <Popover key={cat.value}>
                      <PopoverTrigger asChild>
                        <TabsTrigger
                          value={cat.children[0].value}
                          className="cursor-pointer  hover:scale-105 border-x-2 border-y-0 transition-all ease-in-out flex flex-col sm:flex-row items-center gap-2 py-3 px-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                        >
                          <cat.icon className="w-4 h-4 " />
                          <span className="hidden sm:inline">{cat.label}</span>
                          <span className="sm:hidden">
                            {cat.label.slice(0, 3)}
                          </span>
                        </TabsTrigger>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-0" align="start">
                        <Command>
                          <CommandGroup>
                            {cat.children.map((child) => (
                              <CommandItem
                                key={child.value}
                                onSelect={() => setActiveTab(child.value)}
                                className="cursor-pointe flex items-center gap-2"
                              >
                                <child.icon className="w-4 h-4" />
                                <span>{child.label}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  ))}
                </TabsList>
                <TabsContent value="general.site" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>Site Title</Label>
                    <Input {...form.register("siteTitle")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Site URL</Label>
                    <Input
                      {...form.register("siteUrl")}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea {...form.register("siteDescription")} rows={3} />
                  </div>
                </TabsContent>

                <TabsContent value="general.footer" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>Footer Text</Label>
                    <Input {...form.register("footerText")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Timezone</Label>
                    <Input
                      {...form.register("defaultTimezone")}
                      placeholder="UTC"
                    />
                  </div>
                </TabsContent>
                <TabsContent
                  value="design.appearance"
                  className="space-y-4 mt-6"
                >
                  <div className="space-y-2">
                    <Label>Theme Color</Label>
                    <div className="flex gap-4 items-center flex-wrap">
                      <HexColorPicker color={color} onChange={setColor} />
                      <Input
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Font</Label>
                    <Input {...form.register("primaryFont")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Favicon URL</Label>
                    <Input {...form.register("faviconUrl")} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="anim" {...form.register("enableAnimations")} />
                    <Label htmlFor="anim">Enable Animations</Label>
                  </div>
                </TabsContent>

                <TabsContent value="design.editors" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>Markdown Theme</Label>
                    <Input {...form.register("markdownTheme")} />
                  </div>
                  <div className="space-y-2">
                    <Label>JSON Formatter Indent</Label>
                    <Input
                      type="number"
                      {...form.register("jsonFormatterIndent", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="fs"
                      {...form.register("enableFullScreenEditors")}
                    />
                    <Label htmlFor="fs">Enable Full-Screen Editors</Label>
                  </div>
                </TabsContent>

                <TabsContent value="design.ui" className="space-y-4 mt-6">
                  <div className="flex items-center space-x-2">
                    <Switch id="dark" {...form.register("enableDarkMode")} />
                    <Label htmlFor="dark">Enable Dark Mode</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Items Per Page</Label>
                    <Input
                      type="number"
                      {...form.register("itemsPerPage", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Theme</Label>
                    <Select
                      onValueChange={(v) => form.setValue("defaultTheme", v)}
                      defaultValue={form.getValues("defaultTheme")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="social.links" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>LinkedIn URL</Label>
                    <Input {...form.register("linkedinUrl")} />
                  </div>
                  <div className="space-y-2">
                    <Label>GitHub URL</Label>
                    <Input {...form.register("githubUrl")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter URL</Label>
                    <Input {...form.register("twitterUrl")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram URL</Label>
                    <Input {...form.register("instagramUrl")} />
                  </div>
                  <div className="space-y-2">
                    <Label>YouTube URL</Label>
                    <Input {...form.register("youtubeUrl")} />
                  </div>
                </TabsContent>

                <TabsContent value="social.seo" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>Meta Keywords</Label>
                    <Input {...form.register("metaKeywords")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Google Analytics ID</Label>
                    <Input {...form.register("googleAnalyticsId")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Google Site Verification</Label>
                    <Input {...form.register("googleVerification")} />
                  </div>
                  <div className="space-y-2">
                    <Label>robots.txt</Label>
                    <Textarea {...form.register("robotsTxt")} rows={5} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="sitemap" {...form.register("enableSitemap")} />
                    <Label htmlFor="sitemap">Generate Sitemap</Label>
                  </div>
                </TabsContent>
                <TabsContent value="security.auth" className="space-y-4 mt-6">
                  <div className="flex items-center space-x-2">
                    <Switch id="reg" {...form.register("allowRegistration")} />
                    <Label htmlFor="reg">Allow User Registration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="2fa" {...form.register("enable2FA")} />
                    <Label htmlFor="2fa">
                      Enable Two-Factor Authentication
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Session Timeout (seconds)</Label>
                    <Input
                      type="number"
                      {...form.register("sessionTimeout", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CORS Origins (comma-separated)</Label>
                    <Input {...form.register("corsOrigins")} />
                  </div>
                </TabsContent>

                <TabsContent value="security.users" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>Default User Role</Label>
                    <Select
                      onValueChange={(v) => form.setValue("defaultUserRole", v)}
                      defaultValue={form.getValues("defaultUserRole")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="verify"
                      {...form.register("requireEmailVerification")}
                    />
                    <Label htmlFor="verify">Require Email Verification</Label>
                  </div>
                </TabsContent>

                <TabsContent value="security.api" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>Qdrant API Key</Label>
                    <Input type="password" {...form.register("qdrantApiKey")} />
                  </div>
                  <div className="space-y-2">
                    <Label>OpenAI API Key</Label>
                    <Input type="password" {...form.register("openAiApiKey")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Stripe API Key</Label>
                    <Input type="password" {...form.register("stripeApiKey")} />
                  </div>
                </TabsContent>
                <TabsContent value="ai.chat" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>AI Model</Label>
                    <Select
                      onValueChange={(v) => form.setValue("aiModel", v)}
                      defaultValue={form.getValues("aiModel")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-3.5-turbo">
                          GPT-3.5 Turbo
                        </SelectItem>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Temperature</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...form.register("aiTemperature", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Tokens</Label>
                    <Input
                      type="number"
                      {...form.register("maxTokens", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="history"
                      {...form.register("enableChatHistory")}
                    />
                    <Label htmlFor="history">Save Chat History</Label>
                  </div>
                </TabsContent>

                <TabsContent value="ai.content" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>Default Category</Label>
                    <Input {...form.register("defaultCategory")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Blog Image Size (MB)</Label>
                    <Input
                      type="number"
                      {...form.register("maxBlogImageSize", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="excerpt"
                      {...form.register("autoGenerateExcerpt")}
                    />
                    <Label htmlFor="excerpt">Auto-Generate Excerpt</Label>
                  </div>
                </TabsContent>

                <TabsContent value="ai.productivity" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>Pomodoro Work (min)</Label>
                    <Input
                      type="number"
                      {...form.register("pomodoroWorkTime", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pomodoro Break (min)</Label>
                    <Input
                      type="number"
                      {...form.register("pomodoroBreakTime", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>OKR Review Period</Label>
                    <Select
                      onValueChange={(v) => form.setValue("okrReviewPeriod", v)}
                      defaultValue={form.getValues("okrReviewPeriod")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="quotes" {...form.register("enableQuotes")} />
                    <Label htmlFor="quotes">Show Motivational Quotes</Label>
                  </div>
                </TabsContent>

                <TabsContent value="ai.integrations" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>Google Drive API Key</Label>
                    <Input
                      type="password"
                      {...form.register("googleDriveApiKey")}
                    />
                  </div>
                  <div>
                    <Label>Slack Webhook URL</Label>
                    <Input {...form.register("slackWebhook")} />
                  </div>
                </TabsContent>
                <TabsContent
                  value="advanced.notifications"
                  className="space-y-4 mt-6"
                >
                  <div className="flex items-center space-x-2">
                    <Switch id="emails" {...form.register("enableEmails")} />
                    <Label htmlFor="emails">Enable Email Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="toasts" {...form.register("enableToasts")} />
                    <Label htmlFor="toasts">Enable Toast Notifications</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Toast Position</Label>
                    <Select
                      onValueChange={(v) => form.setValue("toastPosition", v)}
                      defaultValue={form.getValues("toastPosition")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="bottom-right">
                          Bottom Right
                        </SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent
                  value="advanced.analytics"
                  className="space-y-4 mt-6"
                >
                  <div className="flex items-center space-x-2">
                    <Switch id="log" {...form.register("enableLogging")} />
                    <Label htmlFor="log">Enable Logging</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Log Level</Label>
                    <Select
                      onValueChange={(v) => form.setValue("logLevel", v)}
                      defaultValue={form.getValues("logLevel")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warn">Warn</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="advanced.backup" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>Backup Schedule</Label>
                    <Select
                      onValueChange={(v) => form.setValue("backupSchedule", v)}
                      defaultValue={form.getValues("backupSchedule")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select
                      onValueChange={(v) => form.setValue("exportFormat", v)}
                      defaultValue={form.getValues("exportFormat")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    onClick={handleBackupNow}
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Create Backup Now
                  </Button>
                </TabsContent>

                <TabsContent value="advanced.email" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label>Email Provider</Label>
                    <Input {...form.register("emailProvider")} />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input {...form.register("smtpHost")} />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input {...form.register("smtpPort")} />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP User</Label>
                    <Input {...form.register("smtpUser")} />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Password</Label>
                    <Input type="password" {...form.register("smtpPass")} />
                  </div>
                </TabsContent>

                <TabsContent value="advanced.system" className="space-y-4 mt-6">
                  <div className="flex items-center space-x-2">
                    <Switch id="maint" {...form.register("maintenanceMode")} />
                    <Label htmlFor="maint">Enable Maintenance Mode</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Maintenance Message</Label>
                    <Textarea
                      {...form.register("maintenanceModeMessage")}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="cache" {...form.register("cacheEnabled")} />
                    <Label htmlFor="cache">Enable Caching</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="compress"
                      {...form.register("compressionEnabled")}
                    />
                    <Label htmlFor="compress">Enable Compression</Label>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset(fallbackSettings);
                    setColor(fallbackSettings.themeColor);
                    toast.success("Reset to defaults");
                  }}
                  className="w-full sm:w-auto"
                >
                  Reset to Defaults
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Saving..." : "Save All Settings"}
                </Button>
              </div>
            </fieldset>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default Settings;
