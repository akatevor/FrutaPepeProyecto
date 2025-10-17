import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, getToken, logout, validateSession, login } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("EMPLEADO"); // Rol por defecto
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      const currentUser = getCurrentUser();

      if (token && currentUser) {
        const valid = await validateSession();
        setIsAuthenticated(valid);

        if (valid) {
          setUser(currentUser);
          setUserRole(currentUser.rol || currentUser.role || "EMPLEADO");
        } else {
          setUser(null);
          setUserRole("EMPLEADO");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole("EMPLEADO");
      }
    };
    checkAuth();
  }, []);

  // Función para login que actualiza el estado correctamente
  const handleLogin = async (username, password) => {
    try {
      const result = await login(username, password);
      if (result.token && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        setUserRole(result.user.rol || result.user.role || "EMPLEADO");
        return { success: true };
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole("EMPLEADO");
        return { success: false, message: "Credenciales inválidas" };
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setUserRole("EMPLEADO");
      return { success: false, message: error.message || "Error al iniciar sesión" };
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setUserRole("EMPLEADO");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, isAuthenticated, setUser, handleLogout, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
