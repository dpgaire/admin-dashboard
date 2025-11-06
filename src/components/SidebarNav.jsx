import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  ChevronDown,
  ChevronRight,
  Home,
  Layers,
  FileText,
  Link as LinkIcon,
  Info,
  FolderKanban,
  BookOpen,
  Dumbbell,
  MessageSquare,
  Phone,
  MessageCircle,
  Users,
  History,
  Code,
  Timer,
  Target,
  Library as LibraryIcon,
  Database,
  QrCode,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { rolePermissions } from "@/config/permissions";

const SidebarNav = ({ setSidebarOpen, isCurrentPath }) => {
  const { user } = useAuth();

  const menuGroups = [
    {
      title: "Main",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Tasks", href: "/tasks", icon: Layers },
        { name: "Users", href: "/users", icon: Users },
        { name: "Library", href: "/library", icon: LibraryIcon },
        { name: "Notes", href: "/notes", icon: FileText },
        { name: "Quick Links", href: "/quicklinks", icon: LinkIcon },
      ],
    },
    {
      title: "Productivity",
      items: [
        { name: "Pomodoro Timer", href: "/pomodoro-timer", icon: Timer },
        { name: "Goal Setting", href: "/goal-setting", icon: Target },
      ],
    },
    {
      title: "Content Management",
      items: [
        { name: "About", href: "/about", icon: Info },
        { name: "Projects", href: "/projects", icon: FolderKanban },
        { name: "Blogs", href: "/blogs", icon: BookOpen },
        { name: "Skills", href: "/skills", icon: Layers },
        { name: "Training", href: "/training", icon: Dumbbell },
      ],
    },
    {
      title: "Finances",
      items: [
        { name: "Expense Tracker", href: "/expense-tracker", icon: DollarSign },
      ],
    },
    {
      title: "Communication",
      items: [
        { name: "Queries", href: "/queries", icon: MessageSquare },
        { name: "Contact", href: "/contact", icon: Phone },
      ],
    },
    {
      title: "Chat System",
      items: [
        { name: "Chat", href: "/chat", icon: MessageCircle },
        { name: "Chat Users", href: "/chat-user", icon: Users },
        { name: "Chat History", href: "/chat-history", icon: History },
      ],
    },
    {
      title: "Development Tools",
      items: [
        { name: "Code Log", href: "/code-log", icon: Code },
        { name: "Prompt Storage", href: "/prompt-storage", icon: Database },
        { name: "Markdown to PDF", href: "/md-to-pdf", icon: FileText },
        { name: "Rich Text Editor", href: "/rich-text-editor", icon: FileText },
        { name: "JSON Formatter", href: "/json-formatter", icon: FileText },
        { name: "QR System", href: "/qr-system", icon: QrCode },
      ],
    },
  ];

  // Filter menu items based on role
  const filterMenuByRole = (groups) => {
    const role = user?.role;
    
    if (!role || rolePermissions[role] === "all") {
      return groups;
    }

    const userRole = role.toLowerCase();

    if (userRole === "admin") {
      const exclude = rolePermissions.admin.exclude;
      return groups.map((group) => ({
        ...group,
        items: group.items.filter((item) => !exclude.includes(item.href)),
      }));
    }

    if (userRole === "user") {
      const allow = rolePermissions.user.allow;
      return groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => allow.includes(item.href)),
        }))
        .filter((group) => group.items.length > 0); // Remove empty groups
    }
    return [];
  };

  const filteredMenuGroups = filterMenuByRole(menuGroups);

  // Collapse state
  const [openMenus, setOpenMenus] = useState(
    filteredMenuGroups.reduce((acc, group) => {
      acc[group.title] = true;
      return acc;
    }, {})
  );

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <nav className="mt-6 px-3">
      <div className="max-h-[calc(100vh-100px)] pb-12 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {filteredMenuGroups.map((group) => (
          <div key={group.title} className="mb-3">
            <button
              onClick={() => toggleMenu(group.title)}
              className="flex justify-between text-left items-center w-full text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wider px-3 py-2"
            >
              {group.title}
              {openMenus[group.title] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {openMenus[group.title] && (
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const current = isCurrentPath(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        current
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon
                        className={`mr-3 h-5 w-5 ${
                          current
                            ? "text-blue-500 dark:text-blue-300"
                            : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default SidebarNav;
