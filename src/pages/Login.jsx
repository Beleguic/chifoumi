import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "./../components/Form";
import { useAuth } from "../contexts/AuthContext";
import animateTrain from "../components/trainAnimation";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { updateUser } = useAuth();
	const navigate = useNavigate();
	
  
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
		  const response = await axios.post(`${API_URL}/login`, {
			username,
			password,
		  });
	  
		  if (response.status === 200 && response.data.token) {
			const { token } = response.data;
			localStorage.setItem("token", token);
	  
			const { authId, name } = extractPayloadFromToken(token);
			if (!authId || !name) {
			  setError("Une erreur s'est produite lors de l'identification de l'utilisateur");
			} else {
			  localStorage.setItem("AuthId", authId);
			  localStorage.setItem("Username", name);
			  updateUser(authId, name);
			  navigate("/matches");
			}
		  } else {
			setError("Erreur de connexion. Veuillez vérifier vos identifiants.");
		  }
		} catch (err) {
		  if (err.response) {
			setError(`Erreur: ${err.response.data.error || 'Vérifiez vos identifiants et réessayez.'}`);
		  } else {
			setError("Erreur réseau ou problème avec l'API. Veuillez réessayer.");
		  }
		}
	};
	  
	const extractPayloadFromToken = (token) => {
		try {
		  const decodedToken = JSON.parse(atob(token.split(".")[1]));
		  return {
			authId: decodedToken?._id || null,
			name: decodedToken?.username || null
		  };
		} catch (error) {
		  	console.error("Erreur lors de l'extraction des informations utilisateur :", error);
		  	return { authId: null, name: null };
		}
	};
	  
  
	return (
		<>
		<div>
		<Form
			title="Connexion"
			fields={[
				{ name: "username", label: "Nom d'utilisateur", type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true },
				{ name: "password", label: "Mot de passe", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true },
			]}
			onSubmit={handleSubmit}
			submitLabel="Se connecter"
			className="form"
			otherAction={
			<button
				type="button"
				onClick={() => navigate("/register")}
			>
				S&apos;inscrire
			</button>
			}
		/>
			<div>
			{error && <p className="text-red-500 text-center mt-4">{error}</p>}
			</div>
		</div>

		<div className="w-full">{animateTrain("RER", "left-to-right")}</div>
		</>
	);
  };
  
  export default Login;
  