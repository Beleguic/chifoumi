import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types'; // Importer PropTypes

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifie si le token est présent dans le localStorage et si le token est valide
  useEffect(() => {

    const validateToken = async (token) => {
        try {
          // Ajouter le token à l'en-tête Authorization
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/matches`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            setUser({ token });
          } else {
            logout();
          }
        } catch (error) {
          console.error("Token invalide ou expiré", error);
          logout();
        } finally {
          setLoading(false);
        }
      };

    const token = localStorage.getItem('jwt');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Fonction pour vérifier la validité du token côté serveur
  

  // Fonction pour se connecter
  const login = (token) => {
    localStorage.setItem('jwt', token);
    setUser({ token });
  };

  // Fonction pour se déconnecter
  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
  };

  // Fournir le contexte aux composants enfants
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Ajouter la validation des props
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // On attend un ou plusieurs éléments React comme children
};

export default AuthContext;
