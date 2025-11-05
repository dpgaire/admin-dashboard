import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import "./App.css";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contacts from "./pages/Contacts";
import Queries from "./pages/Queries";
import Training from "./pages/Training";
import Blogs from "./pages/Blogs";
import Chat from "./pages/Chat";
import Skills from "./pages/Skills";
import Notes from "./pages/Notes";
import QuickLinks from "./pages/QuickLinks";
import ChatUser from "./pages/ChatUser";
import ChatHistory from "./pages/ChatHistory";
import CodeLog from "./pages/CodeLog";
import Tasks from "./pages/Tasks";
import MarkdownEditor from "./pages/MarkdownEditor";
import RichTextEditor from "./pages/RichTextEditor";
import JsonFormatter from "./pages/JsonFormatter";
import PomodoroTimer from "./pages/PomodoroTimer";
import GoalSetting from "./pages/GoalSetting";
import ExpenseTracker from "./pages/ExpenseTracker";
import Library from "./pages/Library";
import Settings from "./pages/Settings";
import PromptStorage from "./pages/PromptStorage";
import QRSystem from "./pages/QRSystem";
import Users from "./pages/Users";

// Component to handle authenticated routes
const AuthenticatedApp = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contact" element={<Contacts />} />
                <Route path="/about" element={<About />} />
                <Route path="/queries" element={<Queries />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/training" element={<Training />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/quicklinks" element={<QuickLinks />} />
                <Route path="/chat-user" element={<ChatUser />} />
                <Route path="/users" element={<Users />} />
                <Route path="/chat-history" element={<ChatHistory />} />
                <Route path="/code-log" element={<CodeLog />} />
                <Route path="/prompt-storage" element={<PromptStorage />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/md-to-pdf" element={<MarkdownEditor />} />
                <Route path="/rich-text-editor" element={<RichTextEditor />} />
                <Route path="/json-formatter" element={<JsonFormatter />} />
                <Route path="/pomodoro-timer" element={<PomodoroTimer />} />
                <Route path="/goal-setting" element={<GoalSetting />} />
                <Route path="/expense-tracker" element={<ExpenseTracker />} />
                <Route path="/library" element={<Library />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/qr-system" element={<QRSystem />} />

                <Route
                  path="/"
                  element={
                    isAuthenticated() ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AuthenticatedApp />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                theme: {
                  primary: "#4aed88",
                },
              },
              error: {
                duration: 4000,
                theme: {
                  primary: "#ff4b4b",
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
