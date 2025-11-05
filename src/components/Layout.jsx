import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Users,
  FolderOpen,
  Layers,
  FileText,
  User,
  LogOut,
  Moon,
  Sun,
  Info,
  FolderKanban,
  BookOpen,
  MessageSquare,
  MessageCircle,
  Dumbbell,
  Phone,
  Link as LinkIcon,
  History,
  Code,
  DollarSign,
  Timer,
  Target,
  Settings,
  LibraryIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../context/AuthContext";
import SidebarNav from "./SidebarNav";
import CommandPalette from "./CommandPalette";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { QrCodeIcon } from "lucide-react";
import { Database } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const {theme,toggleTheme} = useTheme()
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Tasks", href: "/tasks", icon: Layers },
    { name: "Notes", href: "/notes", icon: FileText },
    { name: "Library", href: "/library", icon: LibraryIcon },
    { name: "Quick Links", href: "/quicklinks", icon: LinkIcon },
    { name: "About", href: "/about", icon: Info },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Pomodoro Timer", href: "/pomodoro-timer", icon: Timer },
    { name: "Goal Setting", href: "/goal-setting", icon: Target },
    { name: "Blogs", href: "/blogs", icon: BookOpen },
    { name: "Skills", href: "/skills", icon: Layers },
    { name: "Training", href: "/training", icon: Dumbbell },
    { name: "Queries", href: "/queries", icon: MessageSquare },
    { name: "Contact", href: "/contact", icon: Phone },
    { name: "Chat", href: "/chat", icon: MessageCircle },
    { name: "Chat Users", href: "/chat-user", icon: Users },
    { name: "Users", href: "/users", icon: Users },
    { name: "Chat History", href: "/chat-history", icon: History },
    { name: "Code Log", href: "/code-log", icon: Code },
    { name: "Markdown to PDF", href: "/md-to-pdf", icon: FileText },
    { name: "Rich Text Editor", href: "/rich-text-editor", icon: FileText },
    { name: "JSON Formatter", href: "/json-formatter", icon: Code },
    { name: "Profile", href: "/profile", icon: User },
    { name: "QR System", href: "/qr-system", icon: QrCodeIcon },
    { name: "Expense Tracker", href: "/expense-tracker", icon: DollarSign },
    { name: "Prompt Storage", href: "/prompt-storage", icon: Database },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const isCurrentPath = (path) => location.pathname === path;

  return (
    <div className={`min-h-screen`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:inset-0
          `}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 cursor-pointer dark:text-white">
              <Link
                to="https://www.durgagairhe.com.np/"
                target="_blank"
                className="hover:underline"
              >
                durGairhe
              </Link>
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <SidebarNav
            setSidebarOpen={setSidebarOpen}
            isCurrentPath={isCurrentPath}
          />

          {/* User info at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <Link to="/profile">
                <div className="flex items-center space-x-3 cursor-pointer">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarFallback className="bg-blue-500 text-white">
                        {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user?.fullName || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email || "admin@example.com"}
                    </p>
                  </div>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/settings")}
                className="text-gray-500 cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {navigation.find((item) => isCurrentPath(item.href))?.name ||
                    "Dashboard"}
                </h2>
              </div>

              {/* Right section: dark mode + profile dropdown */}
              <div className="flex items-center space-x-4">
                {/* Dark mode toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {theme === 'dark'? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu onOpenChange={setMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 focus:outline-none cursor-pointer">
                      <Avatar className="h-8 w-8 ">
                        {user?.image ? (
                          <AvatarImage src={user.image} alt={user.fullName} />
                        ) : (
                          <AvatarFallback className="bg-blue-500 text-white">
                            {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {menuOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform" />
                      )}
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-48" align="end">
                    <DropdownMenuLabel>
                      {user?.fullName || "User"}
                    </DropdownMenuLabel>
                    <DropdownMenuLabel className="text-gray-400">
                      {user?.role || "User"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <CommandPalette />
    </div>
  );
};

export default Layout;
