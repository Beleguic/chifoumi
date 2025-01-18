import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwt");

  if (!token) {
    // Redirige vers la page de connexion si le token n'existe pas
    return <Navigate to="/login" />;
  }

  // Affiche les enfants (le composant protégé) si le token est présent
  return children;
};

export default ProtectedRoute;
