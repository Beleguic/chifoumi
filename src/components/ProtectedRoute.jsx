import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import PropTypes from "prop-types"; 

const ProtectedRoute = ({ children }) => {
  const { authId } = AuthContext(); // Récupère l'userId depuis le contexte

  console.log("User ID:", authId);

  // Si l'utilisateur n'est pas connecté, redirige vers /login
  if (!authId) {
    return <Navigate to="/login" />;
  }

  // Si connecté, afficher la page demandée
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
