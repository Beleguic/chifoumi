import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "./../components/Form";
import AuthContext from "./../contexts/AuthContext"; // Importer AuthContext

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
  
	// Accéder au contexte d'authentification
	const { login } = useContext(AuthContext); // Utiliser la méthode login du contexte
  
	const handleSubmit = async (e) => {
	  e.preventDefault();
	  try {
		const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
		  username,
		  password,
		});
  
		// Vérification du statut de la réponse
		if (response.status === 200 && response.data.token) {
		  const { token } = response.data;
  
		  // Utiliser la méthode login du AuthContext pour stocker le token
		  login(token);
  
		  alert("Connexion réussie !");
		  navigate("/matches");
		} else {
		  alert("Erreur de connexion. Veuillez vérifier vos identifiants.");
		}
	  } catch (err) {
		// Vérification de l'erreur retournée
		if (err.response) {
		  // Erreur côté serveur
		  alert(`Erreur: ${err.response.data.message || 'Vérifiez vos identifiants et réessayez.'}`);
		} else {
		  // Erreur côté client
		  alert("Erreur réseau ou problème avec l'API. Veuillez réessayer.");
		}
	  }
	};
  
	return (
	  <Form
		title="Connexion"
		fields={[
		  { label: "Nom d'utilisateur", type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true },
		  { label: "Mot de passe", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true },
		]}
		onSubmit={handleSubmit}
		submitLabel="Se connecter"
		otherAction={
		  <button
			type="button"
			onClick={() => navigate("/register")}
			style={{
			  padding: "10px 15px",
			  backgroundColor: "gray",
			  color: "white",
			  border: "none",
			  borderRadius: "4px",
			  cursor: "pointer",
			}}
		  >
			S&apos;inscrire
		  </button>
		}
	  />
	);
  };
  
  export default Login;
  