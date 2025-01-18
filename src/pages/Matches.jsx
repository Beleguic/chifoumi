import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "../components/Table";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("jwt");

  // Récupérer la liste des matchs
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get("http://localhost:3002/matches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMatches(response.data);
      } catch (err) {
        setError("Impossible de charger les matchs.");
        console.error(err);
      }
    };

    fetchMatches();
  }, [token]);

  // Colonnes pour le tableau
  const columns = [
    {
      key: "user1",
      header: "Joueur 1",
      render: (user1) => user1?.username || "N/A",
    },
    {
      key: "user2",
      header: "Joueur 2",
      render: (user2) => (user2?.username ? user2.username : "En attente..."),
    },
    {
      key: "_id",
      header: "ID du Match",
    },
  ];

  // Gestion du clic sur une ligne
  const handleRowClick = (match) => {
    window.location.href = `/matches/${match._id}`;
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Liste des matchs</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!matches.length && !error && <p>Chargement des matchs...</p>}
      {matches.length > 0 && (
        <Table columns={columns} data={matches} onRowClick={handleRowClick} />
      )}
    </div>
  );
};

export default Matches;
