import { useEffect, useState } from "react";
import axios from "axios";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const MatchGame = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [turnId, setTurnId] = useState(null);
  const [error, setError] = useState(null);
  const [winner, setWinner] = useState(null);
  const [matchEnded, setMatchEnded] = useState(false);
  const [turnFinished, setTurnFinished] = useState(false);
  const [playerMove, setPlayerMove] = useState(null);
  const [opponentMove, setOpponentMove] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("jwt");
  const currentUser = localStorage.getItem("username");

  // Fonction de récupération du match
  const fetchMatch = async () => {
    try {
      const response = await axios.get(`${API_URL}/matches/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatch(response.data);
      setTurnId(response.data.turns.length + 1);
    } catch (err) {
      setError("Erreur lors du chargement du match.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (matchId) {
      fetchMatch();
    }
  }, [matchId]);

  // Abonnement aux notifications SSE pour les mises à jour en temps réel
  useEffect(() => {
    if (!matchId) return;
    const eventSource = new EventSourcePolyfill(
      `${API_URL}/matches/${matchId}/subscribe`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Événement SSE reçu :", data);
      switch (data.type) {
        case "PLAYER1_JOIN":
        case "PLAYER2_JOIN":
          setMatch((prevMatch) => ({
            ...(prevMatch || {}),
            [data.type === "PLAYER1_JOIN" ? "user1" : "user2"]: { username: data.payload.user },
          }));
          break;
        case "PLAYER1_MOVED":
        case "PLAYER2_MOVED":
          if (match) {
            const playerWhoMoved =
              data.type === "PLAYER1_MOVED" ? match.user1?.username : match.user2?.username;
            if (playerWhoMoved !== currentUser) {
              setOpponentMove(data.payload.move);
            }
          }
          break;
        case "NEW_TURN":
          setTurnId(data.payload.turnId);
          setPlayerMove(null);
          setOpponentMove(null);
          setTurnFinished(false);
          setWinner(null);
          break;
        case "TURN_ENDED":
          setWinner(data.payload.winner);
          setTurnId(data.payload.newTurnId);
          setTurnFinished(true);
          break;
        case "MATCH_ENDED":
          setWinner(data.payload.winner);
          setMatchEnded(true);
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
  }, [matchId, token, match, currentUser]);

  // Fonction pour envoyer le coup du joueur avec gestion détaillée des erreurs
  const playMove = async (move) => {
    try {
      setLoading(true);
      setPlayerMove(move);
      setError(null);
      await axios.post(
        `${API_URL}/matches/${matchId}/turns/${turnId}`,
        { move },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Coup joué :", move);
    } catch (err) {
      let errorMsg = "Erreur lors de l'envoi du coup.";
      if (err.response && err.response.status === 400 && err.response.data) {
        if (err.response.data.turn === "not found") {
          errorMsg = "Le tour demandé n'existe pas.";
        } else if (err.response.data.turn === "not last") {
          errorMsg = "Le tour est déjà terminé.";
        } else if (err.response.data.match === "Match already finished") {
          errorMsg = "Le match est déjà terminé.";
        } else if (err.response.data.user === "move already given") {
          errorMsg = "Vous avez déjà joué ce tour.";
        }
      }
      setError(errorMsg);
      console.error(err.response?.data || err.message);
      setPlayerMove(null);
    } finally {
      setLoading(false);
    }
  };

  // Action pour passer au tour suivant
  const nextTurn = () => {
    setTurnFinished(false);
    setPlayerMove(null);
    setOpponentMove(null);
    setWinner(null);
  };

  // Action pour quitter le match
  const quitMatch = () => {
    navigate("/matches");
  };

  // Détermine le message du résultat de fin de tour en fonction du rôle du joueur gagnant
  const renderTurnResult = () => {
    if (winner === "draw") {
      return "Égalité";
    }
    if (winner === "user1") {
      return match?.user1?.username === currentUser
        ? "Vous avez gagné ce tour !"
        : "Vous avez perdu ce tour.";
    }
    if (winner === "user2") {
      return match?.user2?.username === currentUser
        ? "Vous avez gagné ce tour !"
        : "Vous avez perdu ce tour.";
    }
    return "";
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Match {matchId}</h1>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {match ? (
        <>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <p>
              <strong>Joueur 1 :</strong> {match.user1?.username || "N/A"}
            </p>
            <p>
              <strong>Joueur 2 :</strong> {match.user2?.username || "En attente..."}
            </p>
            <p>
              <strong>Tour actuel :</strong> {turnId}
            </p>
          </div>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            {matchEnded ? (
              <p style={{ fontSize: "1.2em", color: "red" }}>
                {winner === "draw"
                  ? "Match nul"
                  : (winner === "user1"
                      ? match?.user1?.username === currentUser
                      : match?.user2?.username === currentUser)
                  ? "Vous avez gagné le match !"
                  : "Vous avez perdu le match."}
              </p>
            ) : !turnFinished && playerMove === null ? (
              <p style={{ fontSize: "1.2em", color: "green" }}>C&apos;est à vous de jouer</p>
            ) : !turnFinished && playerMove !== null ? (
              <p style={{ fontSize: "1.2em", color: "orange" }}>
                Vous avez joué : {playerMove}. En attente de l&apos;autre joueur...
              </p>
            ) : (
              turnFinished && (
                <p style={{ fontSize: "1.2em", color: "blue" }}>
                  Tour terminé. Résultat du tour : {renderTurnResult()}
                </p>
              )
            )}
            {opponentMove && !turnFinished && !matchEnded && (
              <p style={{ fontSize: "1.2em", color: "blue" }}>
                L&apos;adversaire a joué : {opponentMove}
              </p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            {!turnFinished && !matchEnded && (
              <>
                <button
                  onClick={() => playMove("rock")}
                  disabled={loading || playerMove !== null}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "gray",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "1em",
                  }}
                >
                  Pierre
                </button>
                <button
                  onClick={() => playMove("paper")}
                  disabled={loading || playerMove !== null}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "1em",
                  }}
                >
                  Feuille
                </button>
                <button
                  onClick={() => playMove("scissors")}
                  disabled={loading || playerMove !== null}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "1em",
                  }}
                >
                  Ciseaux
                </button>
              </>
            )}
            {turnFinished && !matchEnded && (
              <button
                onClick={nextTurn}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1em",
                }}
              >
                Passer au tour suivant
              </button>
            )}
            {matchEnded && (
              <button
                onClick={quitMatch}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1em",
                }}
              >
                Quitter le match
              </button>
            )}
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => navigate("/matches")}
              style={{
                padding: "8px 16px",
                backgroundColor: "#444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Retour aux matchs
            </button>
          </div>
        </>
      ) : (
        <p style={{ textAlign: "center" }}>Chargement du match...</p>
      )}
    </div>
  );
};

export default MatchGame;
