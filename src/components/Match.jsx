import React, { useEffect, useState } from "react";
import axios from "axios";
import EventSourcePolyfill from "event-source-polyfill";

const Match = ({ matchId }) => {
  const [match, setMatch] = useState(null); // Données du match
  const [turnId, setTurnId] = useState(null); // ID du tour actuel
  const [playerMove, setPlayerMove] = useState(null); // Coup du joueur
  const [error, setError] = useState(null); // Gestion des erreurs
  const [winner, setWinner] = useState(null); // Gagnant de la partie ou du tour

  const token = localStorage.getItem("jwt"); // Token JWT pour l'authentification

  // Récupérer les détails du match au chargement
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/matches/${matchId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMatch(response.data);
        setTurnId(response.data.turns.length + 1); // Initialiser le tour
      } catch (err) {
        setError("Impossible de charger le match.");
        console.error(err);
      }
    };

    fetchMatch();
  }, [matchId, token]);

  // S'abonner aux notifications via SSE
  useEffect(() => {
    if (!matchId) return;

    const eventSource = new EventSourcePolyfill(
      `http://localhost:3002/matches/${matchId}/subscribe`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Événement SSE reçu :", data);

      switch (data.type) {
        case "PLAYER1_JOIN":
        case "PLAYER2_JOIN":
          console.log(`${data.payload.user} a rejoint le match.`);
          break;

        case "NEW_TURN":
          setTurnId(data.payload.turnId);
          break;

        case "TURN_ENDED":
          setWinner(data.payload.winner);
          setTurnId(data.payload.newTurnId);
          break;

        case "MATCH_ENDED":
          setWinner(data.payload.winner);
          alert(`Le match est terminé. Gagnant : ${data.payload.winner}`);
          break;

        default:
          console.warn("Type d'événement inconnu :", data.type);
      }
    };

    eventSource.onerror = (err) => {
      console.error("Erreur SSE :", err);
      setError("Erreur de connexion au flux SSE.");
    };

    return () => {
      eventSource.close();
    };
  }, [matchId, token]);

  // Envoyer un coup (rock, paper, scissors)
  const playMove = async (move) => {
    try {
      setPlayerMove(move);
      const response = await axios.post(
        `http://localhost:3002/matches/${matchId}/turns/${turnId}`,
        { move },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Coup joué avec succès :", response.data);
    } catch (err) {
      setError("Impossible de jouer ce coup.");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Partie : {matchId}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {match && (
        <>
          <p>
            <strong>Joueur 1 :</strong> {match.user1.username}
          </p>
          <p>
            <strong>Joueur 2 :</strong>{" "}
            {match.user2 ? match.user2.username : "En attente..."}
          </p>
          <p>
            <strong>Tour actuel :</strong> {turnId}
          </p>
          {winner && (
            <p>
              <strong>Résultat précédent :</strong>{" "}
              {winner === "draw" ? "Égalité" : `Gagnant : ${winner}`}
            </p>
          )}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={() => playMove("rock")}
              style={{
                padding: "10px 15px",
                backgroundColor: "gray",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Pierre
            </button>
            <button
              onClick={() => playMove("paper")}
              style={{
                padding: "10px 15px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Feuille
            </button>
            <button
              onClick={() => playMove("scissors")}
              style={{
                padding: "10px 15px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Ciseaux
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Match;
