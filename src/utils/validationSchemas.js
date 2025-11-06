import * as yup from "yup";

// Login validation schema

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const registerSchema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// User validation schema
export const userSchema = yup.object({
  fullName: yup.string().min(3, "Full name must be at least 3 characters"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  role: yup
    .string()
    .oneOf(["superAdmin", "Admin", "User"], "Invalid role")
    .required("Role is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// User update validation schema (password optional)
export const userUpdateSchema = yup.object({
  fullName: yup
    .string()
    .min(2, "Full name must be at least 2 characters")
    .optional(),
  email: yup.string().email("Invalid email format").optional(),
});

//About Validations
export const aboutSchema = yup.object({
  title: yup.string().required("Title is required"),
  tagline: yup.string().required("Tagline is required"),
  description: yup.string().required("Description is required"),
  philosophy: yup.string().required("Philosophy is required"),
  tags: yup
    .array()
    .of(yup.string().required("Tag is required"))
    .min(1, "At least one tag is required"),
  areasOfExpertise: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required("Area title is required"),
        description: yup.string().required("Area description is required"),
      })
    )
    .min(1, "At least one area of expertise is required"),
  stats: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required("Stat title is required"),
        count: yup.string().required("Stat count is required"),
      })
    )
    .min(1, "At least one stat is required"),
  contactDetails: yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone is required"),
    location: yup.string().required("Location is required"),
    profileImage: yup
      .string()
      .url("Invalid URL")
      .required("Profile image URL is required"),
    cv: yup.string().url("Invalid URL").required("Latest CV URL is required"),
  }),
});

export const skillSchema = yup.object({
  title: yup.string().required("Title is required"),
  icon: yup.string().optional(),
  skills: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("Skill name is required"),
        percentage: yup
          .number()
          .required("Percentage is required")
          .min(0)
          .max(100),
      })
    )
    .optional(),
});

export const projectSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
  longDescription: yup.string().optional(),
  category: yup.string().optional(),
  technologies: yup.array().of(yup.string()).optional(),
  liveUrl: yup
    .string()
    .transform((v) => (v === "" ? null : v))
    .url("Must be a valid URL")
    .nullable()
    .optional(),
  githubUrl: yup
    .string()
    .transform((v) => (v === "" ? null : v))
    .url("Must be a valid URL")
    .nullable()
    .optional(),
  image: yup.string().optional(),
  featured: yup.boolean().optional(),
  status: yup.boolean().optional(),
  problem: yup.string().optional(),
  process: yup.string().optional(),
  solution: yup.string().optional(),
  screenshots: yup.array().of(yup.string()).optional(),
});

export const blogSchema = yup.object({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  slug: yup.string().required("Slug is required"),
  readTime: yup.string().optional(),
  category: yup.string().optional(),
  author: yup.string().optional(),
  tags: yup.array().of(yup.string()).optional(),
  image: yup.string().optional(),
  featured: yup.boolean().optional(),
  likes: yup.number().optional(),
  excerpt: yup.string().optional(),
  date: yup.string().optional(),
});

export const trainingSchema = yup.object({
  category: yup.string().required("Category is required"),
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  tags: yup.array().of(yup.string()).optional(),
});

export const chatSchema = yup.object({
  query: yup.string().required("Query is required"),
});

export const codeLogSchema = yup.object({
  title: yup.string().required("Title is required"),
  code: yup.string().required("Code is required"),
});

export const taskSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
  priority: yup.string().oneOf(["Low", "Medium", "High"]).optional(),
  status: yup.string().oneOf(["todo", "in-progress", "completed"]).optional(),
  dueDate: yup.date().optional(),
});

export const librarySchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
  url: yup.string().url("Must be a valid URL").required("PDF URL is required"),
  author: yup.string().optional(),
  coverImage: yup.string().url("Must be a valid URL").optional(),
});

export const promptStorageSchema = yup.object({
  title: yup.string().required("Title is required"),
  ai_category: yup.string().required("AI Category is required"),
  prompt: yup.string().required("Prompt is required"),
});
