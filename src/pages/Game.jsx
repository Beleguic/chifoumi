import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { EventSourcePolyfill } from "event-source-polyfill";

export default function MatchGame() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { matchId } = useParams();
  const { authId } = useAuth();

  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [turn, setTurn] = useState(1);
  const [error, setError] = useState("");

	const fetchMatch = useCallback(async () => {
		try {
			setError(null);
			const token = localStorage.getItem("token");
			const response = await axios.get(`${API_URL}/matches/${matchId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			setMatch(response.data);
			let newTurn = getNextTurnId(response.data);
			console.log(newTurn);
			setTurn(newTurn);
			console.log("Match data fetched:", response.data);
		} catch (err) {
			console.error("Erreur lors de la récupération du match :", err);
			setError("Impossible de charger le match.");
		}
	}, [matchId]);

	function isTurnFullyPlayed(turn) {
		return !!(turn.user1 && turn.user2);
	}
		
	function getNextTurnId(match) {
		const nbTurns = match.turns.length;
		if (nbTurns === 0) {
			return 1;
		}
		const lastTurn = match.turns[nbTurns - 1];
		if (!isTurnFullyPlayed(lastTurn)) {
			return nbTurns;
		}
		if (nbTurns < 3) {
			return nbTurns + 1;
		}
		return 3;
	}
  

  const subscribeToMatch = useCallback(
    (matchId) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token manquant !");
        setError("Vous devez être connecté pour accéder à ce match.");
        return null;
      }

      const url = `${API_URL}/matches/${matchId}/subscribe`;
      const eventSource = new EventSourcePolyfill(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      eventSource.onmessage = (event) => {
        console.log("SSE message reçu :", event.data);
        fetchMatch();
      };

      eventSource.onerror = (e) => {
        console.error("Erreur SSE, on ferme la connexion :", e);
        eventSource.close();
      };

      return eventSource;
    },
    [fetchMatch]
  );

  const getTransportEquivalent = (choice) => {
    const equivalents = {
      rock: "RER",
      paper: "Metro",
      scissors: "Tram",
    };

    const reverseEquivalents = Object.fromEntries(
      Object.entries(equivalents).map(([key, value]) => [value, key])
    );

    return reverseEquivalents[choice] || "Inconnu";
  };

  const submitMove = async (move) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/matches/${matchId}/turns/${turn}`,
        { move },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 202) {
        console.log("Coup envoyé avec succès !");
        fetchMatch(); // Met à jour les données du match après le coup joué
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.turn === "not found") {
          setError("Tour non trouvé.");
        } else if (data.turn === "not last") {
          setError("Le tour est déjà terminé.");
        } else if (data.match === "Match already finished") {
          setError("Le match est déjà terminé.");
        } else if (data.user === "move already given") {
          setError("Vous avez déjà joué ce tour.");
        } else {
          setError("Une erreur inconnue s'est produite.");
        }
      }
    }
  };

  useEffect(() => {
    if (!authId) {
      setError("Vous devez être connecté pour accéder à ce match.");
      return;
    }
    fetchMatch();
    if (matchId) {
      const es = subscribeToMatch(matchId);
      return () => {
        if (es) es.close();
      };
    }
  }, [matchId, authId, fetchMatch, subscribeToMatch]);

  if (!match && !error) {
    return <div>Chargement ..., Veuillez patienter</div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!match) {
    return (
      <p>
        Erreur, Match Introuvable,{" "}
        <button onClick={() => navigate("/matches")}>
          revenir à la sélection des matchs ?
        </button>
      </p>
    );
  }

  const isUser1 = match.user1?._id === authId;
  const isUser2 = match.user2?._id === authId;

  return (
    <div>
      <button onClick={() => submitMove(getTransportEquivalent("RER"))}>RER</button>
      <button onClick={() => submitMove(getTransportEquivalent("Metro"))}>Metro</button>
      <button onClick={() => submitMove(getTransportEquivalent("Tram"))}>Tram</button>
    </div>
  );
}
