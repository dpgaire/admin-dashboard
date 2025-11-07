import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { rolePermissions } from "@/config/permissions";
import  LoadingSpinner  from "./LoadingSpinner";

const isAllowed = (pathname, role) => {
  if (!role) return false;

  

  if (rolePermissions[role] === "all") {
    return true;
  }

  const userRole = role.toLowerCase();

  if (userRole === "admin") {
    const { exclude = [] } = rolePermissions.admin;
    return !exclude.includes(pathname);
  }

  if (userRole === "user") {
    const { allow = [] } = rolePermissions.user;
    return allow.includes(pathname);
  }

  return false;
};

export const ProtectedRoutes = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const userRole = user?.role;
  const currentPath = location.pathname;

  if (!isAllowed(currentPath, userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};