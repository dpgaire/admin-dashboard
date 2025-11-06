'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LandingLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Nexus</h1>
          <nav className="hidden sm:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              About
            </a>
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="sm:hidden bg-white border-t border-gray-100">
            <ul className="flex flex-col space-y-2 py-4 px-6">
              <li>
                <a href="#features" className="block py-2 text-gray-700 hover:text-gray-900">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="block py-2 text-gray-700 hover:text-gray-900">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#about" className="block py-2 text-gray-700 hover:text-gray-900">
                  About
                </a>
              </li>
              <li>
                <Link to="/login" className="block py-2 text-gray-700 hover:text-gray-900">
                  Login
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/register"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main className="container mx-auto px-4 py-12 sm:py-16">{children}</main>

      <footer className="bg-white border-t border-gray-100 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Nexus. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;