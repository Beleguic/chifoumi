import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "./../components/Form";
import { AuthContext } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { updateUser } = AuthContext();
	const navigate = useNavigate();
	
  
	const handleSubmit = async (e) => {
	  	e.preventDefault();
	  	try {
			const response = await axios.post(`${API_URL}/login`, {
		  		username,
		  		password,
			});
  
			// Vérification du statut de la réponse
			if (response.status === 200 && response.data.token) {
		  		const { token } = response.data;

		  		localStorage.setItem("token", token);

		  		const AuthId = extractPayloadFromToken(token);
				if(!AuthId){
					setError("Une erreur s'est produite lors de l'identification de l'utilisateur");
				}
				else{
					localStorage.setItem("AuthId", AuthId);
					updateUser(AuthId);
					navigate("/matches");
				}
		
			} else {
				setError("Erreur de connexion. Veuillez vérifier vos identifiants.");
			}
	  	} catch (err) {
			// Vérification de l'erreur retournée
			if (err.response) {
		  		// Erreur côté serveur
		  		setError(`Erreur: ${err.response.data.message || 'Vérifiez vos identifiants et réessayez.'}`);
			} else {
		  		// Erreur côté client
		  		setError("Erreur réseau ou problème avec l'API. Veuillez réessayer.");
			}
	  	}
	};

	const extractPayloadFromToken = (token) => {
		try {
			const decodedToken = JSON.parse(atob(token.split(".")[1]));
			return decodedToken && decodedToken._id ? decodedToken._id : null;
		} catch (error) {
			console.error("Erreur lors de l'extraction de l'userId :", error);
			return null;
		}
	};
  
	return (
		<>
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
		{error && <p>{error}</p>}
		</>
	);
  };
  
  export default Login;
  