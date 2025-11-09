import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

import HomeIndex from "./pages/Home/Index";
import Login from "./pages/Login/Index";
import Registro from "./pages/Registro/Index";
import UserIndex from "./pages/User/Index";
import GPUIndex from "./pages/Frutas/Index";
import GPUCreate from "./pages/Frutas/Create";
import GPUEdit from "./pages/Frutas/Edit";
import GPUDetails from "./pages/Frutas/Details";
import GPUDelete from "./pages/Frutas/Delete";

import Header from "./components/Header";
import Footer from "./components/Footer";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomeIndex />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/registro"
            element={
              <PublicRoute>
                <Registro />
              </PublicRoute>
            }
          />

          <Route
            path="/user/*"
            element={
              <PrivateRoute>
                <UserIndex />
              </PrivateRoute>
            }
          />

          <Route
            path="/frutas/*"
            element={
              <PrivateRoute>
                <GPUIndex />
              </PrivateRoute>
            }
          >
            <Route path="create" element={<GPUCreate />} />
            <Route path="edit/:id" element={<GPUEdit />} />
            <Route path="details/:id" element={<GPUDetails />} />
            <Route path="delete/:id" element={<GPUDelete />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;