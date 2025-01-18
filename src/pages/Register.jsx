import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "./../components/Form";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3002/register", {
        username,
        password,
      });

      alert("Inscription réussie !");
      navigate("/login");
    } catch (err) {
      alert("Erreur lors de l'inscription. Veuillez réessayer.");
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
