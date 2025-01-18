import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "./../components/Form";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3002/login", {
        username,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("jwt", token);
      alert("Connexion réussie !");
      navigate("/matches");
    } catch (err) {
      alert("Erreur de connexion. Veuillez vérifier vos identifiants.");
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
          S'inscrire
        </button>
      }
    />
  );
};

export default Login;
