import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "./../components/Form";
import animateTrain from "../components/trainAnimation";

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
        setError("Inscription réussie !");
        navigate("/login");
      } else {
        // Gérer les autres statuts HTTP si nécessaire
        setError("Une erreur est survenue, veuillez réessayer.");
      }
    } catch (err) {
      // Vérification de l'erreur retournée
      if (err.response) {
        console.log(err);
        // Erreur côté serveur
        setError(`Erreur: ${err.response.data.error || 'Veuillez réessayer.'}`);
      } else {
        // Erreur côté client
        setError("Erreur réseau ou problème avec l'API. Veuillez réessayer.");
      }
    }
  };
  

  return (
    <>
    <div>
      <Form
        title="Inscription"
        fields={[
          { name:"username", label: "Nom d'utilisateur", type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true },
          { name:"password", label: "Mot de passe", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true },
        ]}
        onSubmit={handleSubmit}
        submitLabel="S'inscrire"
        className="form"
        otherAction={
          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Se connecter
          </button>
        }
      />
        <div>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      
      </div>

      <div className="w-full">{animateTrain("Metro", "right-to-left")}</div>
    </>
  );
};

export default Register;
