import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Si está autenticado y está en /login o /registro, redirige a /user
  if (isAuthenticated && ["/login", "/registro"].includes(location.pathname)) {
    return <Navigate to="/frutas" replace />;
  }

  return children;
};

export default PublicRoute;