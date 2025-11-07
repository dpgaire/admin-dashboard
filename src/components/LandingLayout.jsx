"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

const LandingLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, isAuthenticated } = useAuth();

  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <header className="shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Nexus
          </h1>
          <nav className="hidden sm:flex items-center space-x-8">
            <a
              href="#features"
              className="  font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="  font-medium transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="  font-medium transition-colors"
            >
              About
            </a>
            {isAuthenticated ? (
              <Link
                className="  font-medium transition-colors"
                to="/dashboard"
              >
                {user?.fullName}
              </Link>
            ) : (
              <Link
                to="/login"
                className="  font-medium transition-colors"
              >
                Login
              </Link>
            )}
            {isAuthenticated ? (
              <Link
                className="bg-blue-600 hover:bg-blue-700  font-semibold py-2.5 px-5 rounded-lg transition-all shadow-sm hover:shadow-md"
                to="/dashboard"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700  font-semibold py-2.5 px-5 rounded-lg transition-all shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-500 cursor-pointer hover dark:text-gray-400 dark:hover:text-gray-200"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden p-2 rounded-md  hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <nav className="sm:hidden border-t border-gray-100">
            <ul className="flex flex-col space-y-2 py-4 px-6">
              <li>
                <a
                  href="#features"
                  className="block py-2"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="block py-2 "
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="block py-2 "
                >
                  About
                </a>
              </li>
              <li>
                <Link
                  to="/login"
                  className="block py-2 "
                >
                  Login
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/register"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700  font-semibold py-2.5 rounded-lg"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main className="container mx-auto px-4 py-12 sm:py-16">{children}</main>

      <footer className="border-t border-gray-100 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Nexus. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
