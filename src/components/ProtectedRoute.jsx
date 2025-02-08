import { Navigate } from "react-router-dom";
import { useContext } from "react";
import PropTypes from 'prop-types'; // Importer PropTypes
import AuthContext from "./../contexts/AuthContext"; // Assure-toi que le chemin est correct

const ProtectedRoute = ({ children }) => {
  // Utilisation du contexte pour récupérer l'état d'authentification
  const { user } = useContext(AuthContext); // 'user' contient les infos sur l'utilisateur connecté
  console.log(user);
  // Si l'utilisateur n'est pas authentifié (c'est-à-dire pas de 'user' dans le contexte), redirige vers la page de login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si l'utilisateur est authentifié, affiche les enfants (le composant protégé)
  return children;
};

// Ajouter la validation des props
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // On attend un ou plusieurs éléments React comme children
};

export default ProtectedRoute;
