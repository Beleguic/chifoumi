import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "./../components/Form";

const API_URL = import.meta.env.VITE_API_URL;

console.log(API_URL);

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username,
        password,
      });
      
      // Vérification du statut de la réponse
      if (response.status === 201) {
        console.log(response.data);  // Afficher les données retournées, si nécessaire
        alert("Inscription réussie !");
        navigate("/login");
      } else {
        // Gérer les autres statuts HTTP si nécessaire
        alert("Une erreur est survenue, veuillez réessayer.");
      }
    } catch (err) {
      // Vérification de l'erreur retournée
      if (err.response) {
        // Erreur côté serveur
        alert(`Erreur: ${err.response.data.message || 'Veuillez réessayer.'}`);
      } else {
        // Erreur côté client
        alert("Erreur réseau ou problème avec l'API. Veuillez réessayer.");
      }
    }
  };
  

  return (
    <Form
      title="Inscription"
      fields={[
        { label: "Nom d'utilisateur", type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true },
        { label: "Mot de passe", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true },
      ]}
      onSubmit={handleSubmit}
      submitLabel="S'inscrire"
      otherAction={
        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 15px",
            backgroundColor: "gray",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Se connecter
        </button>
      }
    />
  );
};

export default Register;
