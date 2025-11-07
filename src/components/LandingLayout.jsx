import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LandingLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
            Nexus
          </h1>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {["Features", "Pricing", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm tracking-wide transition-colors duration-200"
              >
                {item}
              </a>
            ))}

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm tracking-wide transition-colors duration-200"
              >
                {user?.fullName}
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm tracking-wide transition-colors duration-200"
              >
                Login
              </Link>
            )}

            {/* CTA Button */}
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className={cn(
                "px-6 py-2.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300",
                "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
                "hover:scale-105 active:scale-95"
              )}
            >
              {isAuthenticated ? "Dashboard" : "Get Started"}
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-200"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Sliding Menu - Right to Left */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-all duration-500 ease-in-out",
          mobileOpen
            ? "translate-x-0"
            : "translate-x-full"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0  backdrop-blur"
          onClick={() => setMobileOpen(false)}
        />

        {/* Menu Panel */}
        <nav className="absolute right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-black shadow-2xl border-l border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold tracking-tighter">Nexus</h2>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <ul className="p-6 space-y-1">
            {["Features", "Pricing", "About"].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-4 px-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-xl transition-all duration-200"
                >
                  {item}
                </a>
              </li>
            ))}

            <li className="pt-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block py-4 px-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-xl transition-all duration-200"
                >
                  {user?.fullName}
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block py-4 px-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-xl transition-all duration-200"
                >
                  Login
                </Link>
              )}
            </li>

            <li className="pt-6">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              </Link>
            </li>

            <li className="pt-8 flex justify-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-6 w-6 mr-3" />
                ) : (
                  <Moon className="h-6 w-6 mr-3" />
                )}
                <span className="font-medium">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-6 container mx-auto max-w-7xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 mt-24">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">
            © {new Date().getFullYear()} Nexus. Crafted with precision.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;