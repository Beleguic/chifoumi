import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { authId, clearUser, username } = useAuth();

  console.log(username);

  const isAuthenticated = Boolean(authId);

  console.log(authId);

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  return (
    <header>
        <div style={{ width: "20%" }}>
            <img src="/public/ratp.png" alt="Logo Chifoumi" />
        </div>
        <div style={{ width: "60%", textAlign: "center" }}>
            <h1 onClick={() => navigate("/matches")} className='logo'>Chifoumi {username && `- Bienvenue ${username}`}</h1>
        </div>
        <div style={{ width: "20%", justifyContent: "right" }}>
            <nav>
                <ul className="navList">
                {isAuthenticated ? (
                    <>
                    <li><button onClick={() => navigate("/matches")} className="button">Liste des Matchs</button></li>
                    <li><button onClick={handleLogout} className="button">Déconnexion</button></li>
                    </>
                ) : (
                    <>
                    <li><button onClick={() => navigate("/login")} className="button">Connexion</button></li>
                    <li><button onClick={() => navigate("/register")} className="button">Inscription</button></li>
                    </>
                )}
                </ul>
            </nav>
        </div>
    </header>
  );
};

export default Header;
