import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./../contexts/AuthContext"; // Importer AuthContext

const Home = () => {
  const navigate = useNavigate();

  // Utiliser le AuthContext pour obtenir l'état d'authentification
  const { user, logout } = useContext(AuthContext);

  // Vérifie si l'utilisateur est authentifié en vérifiant la présence de l'utilisateur dans le contexte
  const isAuthenticated = Boolean(user);

  const handleLogout = () => {
    // Utiliser la méthode logout du AuthContext pour déconnecter l'utilisateur
    logout();

    // Redirige l'utilisateur vers la page de connexion
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1>Bienvenue sur Chi Fou Mi</h1>
      {!isAuthenticated ? (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <button
            onClick={() => navigate("/register")}
            style={{
              	padding: "10px 15px",
              	backgroundColor: "blue",
              	color: "white",
              	border: "none",
              	cursor: "pointer",
            }}	
          >
            S&apos;inscrire
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              	padding: "10px 15px",
              	backgroundColor: "gray",
              	color: "white",
              	border: "none",
              	cursor: "pointer",
            }}
          >
            Connexion
          </button>
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <p>Vous êtes connecté(e).</p>
          <button
            onClick={() => navigate("/matches")}
            style={{
              	padding: "10px 15px",
              	backgroundColor: "green",
              	color: "white",
              	border: "none",
              	cursor: "pointer",
            }}
          >
            Aller aux parties
          </button>
          <button
            onClick={handleLogout}
            style={{
              	padding: "10px 15px",
              	backgroundColor: "red",
              	color: "white",
              	border: "none",
              	cursor: "pointer",
              	marginLeft: "10px",
            }}
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
