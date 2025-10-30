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
} from "lucide-react";

const SidebarNav = ({ setSidebarOpen, isCurrentPath }) => {
  const menuGroups = [
    {
      title: "Main",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Tasks", href: "/tasks", icon: Layers },
        { name: "Notes", href: "/notes", icon: FileText },
        { name: "Quick Links", href: "/quicklinks", icon: LinkIcon },
      ],
    },
    {
      title: "Content Management",
      items: [
        { name: "About", href: "/about", icon: Info },
        { name: "Projects", href: "/projects", icon: FolderKanban },
        { name: "Blogs", href: "/blogs", icon: BookOpen },
        { name: "Markdown to PDF", href: "/md-to-pdf", icon: FileText },
        { name: "Rich Text Editor", href: "/rich-text-editor", icon: FileText },
        { name: "Skills", href: "/skills", icon: Layers },
        { name: "Training", href: "/training", icon: Dumbbell },
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
      title: "Development",
      items: [{ name: "Code Log", href: "/code-log", icon: Code }],
    },
  ];

  // ✅ Initialize all menus as open by default
  const [openMenus, setOpenMenus] = useState(
    menuGroups.reduce((acc, group) => {
      acc[group.title] = true;
      return acc;
    }, {})
  );

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <nav className="mt-6 px-3">
      <div className="max-h-[calc(100vh-100px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-3">
            <button
              onClick={() => toggleMenu(group.title)}
              className="flex justify-between text-left items-center w-full text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wider px-3 py-2"
            >
              {group.title}
              {openMenus[group.title] ? (
                <ChevronDown className="w-4 h-4 cursor-context-menu" />
              ) : (
                <ChevronRight className="w-4 h-4 cursor-context-menu" />
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
                            : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
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
