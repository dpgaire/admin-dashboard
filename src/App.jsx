import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

import Layout from "./components/Layout";

import {
  Login,
  Register,
  Dashboard,
  Profile,
  About,
  Projects,
  Contacts,
  Queries,
  Training,
  Blogs,
  Chat,
  Skills,
  Notes,
  QuickLinks,
  ChatUser,
  ChatHistory,
  CodeLog,
  Tasks,
  MarkdownEditor,
  RichTextEditor,
  JsonFormatter,
  PomodoroTimer,
  GoalSetting,
  ExpenseTracker,
  Library,
  Settings,
  PromptStorage,
  QRSystem,
  Users,
  Landing,
} from "./pages";
import { ProtectedRoutes } from "./components/ProtectedRoutes";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoutes>
                <Layout>
                  <Routes>
                    {/* Dashboard & Core */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contacts />} />
                    <Route path="/queries" element={<Queries />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/training" element={<Training />} />
                    <Route path="/skills" element={<Skills />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/quicklinks" element={<QuickLinks />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Chat */}
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/chat-user" element={<ChatUser />} />
                    <Route path="/chat-history" element={<ChatHistory />} />

                    {/* Productivity */}
                    <Route path="/pomodoro-timer" element={<PomodoroTimer />} />
                    <Route path="/goal-setting" element={<GoalSetting />} />
                    <Route
                      path="/expense-tracker"
                      element={<ExpenseTracker />}
                    />

                    {/* Dev Tools */}
                    <Route path="/code-log" element={<CodeLog />} />
                    <Route path="/prompt-storage" element={<PromptStorage />} />
                    <Route path="/md-to-pdf" element={<MarkdownEditor />} />
                    <Route
                      path="/rich-text-editor"
                      element={<RichTextEditor />}
                    />
                    <Route path="/json-formatter" element={<JsonFormatter />} />
                    <Route path="/qr-system" element={<QRSystem />} />

                    {/* Admin Only */}
                    <Route path="/users" element={<Users />} />

                    {/* Root Redirect */}
                    <Route
                      path="/"
                      element={
                        isAuthenticated ? (
                          <Navigate to="/dashboard" replace />
                        ) : (
                          <Navigate to="/" replace />
                        )
                      }
                    />

                    {/* 404 → Dashboard */}
                    <Route
                      path="*"
                      element={
                        isAuthenticated ? (
                          <Navigate to="/dashboard" replace />
                        ) : (
                          <Navigate to="/" replace />
                        )
                      }
                    />
                  </Routes>
                </Layout>
              </ProtectedRoutes>
            }
          />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: { duration: 3000 },
            error: { duration: 4000 },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
