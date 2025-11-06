// Define allowed routes per role
export const rolePermissions = {
  superAdmin: "all",
  admin: {
    exclude: ["/users"],
  },
  user: {
    allow: [
      "/dashboard",
      "/profile",
      "/settings",
      "/tasks",
      "/library",
      "/notes",
      "/quicklinks",
      "/pomodoro-timer",
      "/goal-setting",
      "/about",
      "/projects",
      "/blogs",
      "/skills",
      "/training",
      "/contact",
      "/queries",
      "/chat",
      "/chat-user",
      "/chat-history",
    ],
  },
};
