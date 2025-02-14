import { useAuth } from "../contexts/AuthContext";
import {useEffect, useState, useCallback, useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { EventSourcePolyfill } from "event-source-polyfill";
import {gameState} from "../data/data.js";

export default function MatchGame() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { matchId } = useParams();
  const { authId } = useAuth();

  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [turn, setTurn] = useState(1);
  const [error, setError] = useState("");
  const [moveDisabled, setMoveDisabled] = useState(false);
  const [winner, setWinner] = useState(null);

  const userNumber = useRef(1)

	const fetchMatch = useCallback(async () => {
		try {
			setError(null);
			const token = localStorage.getItem("token");
			const response = await axios.get(`${API_URL}/matches/${matchId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			setMatch(response.data);
      console.log("match data set : ", response.data);
      userNumber.current = response.data.user1._id === authId ? 1 : 2;
			let newTurn = getNextTurnId(response.data);
			console.log(newTurn);
			setTurn(newTurn);
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
      if(Object.keys(lastTurn).includes(`user${userNumber.current}`))
        setMoveDisabled(true);
      else
        setMoveDisabled(false);
			return nbTurns;
		}
    setMoveDisabled(false);
    console.log("turn fully played : ", moveDisabled);
    if (nbTurns < 3) {
			return nbTurns + 1;
		}
    console.log("game ended");
    setWinner(getWinner(match));
    setMoveDisabled(true);
		return 3;
	}

  const getWinner = (match) => {
    const user1WinCount = match.turns.filter((turn) => turn.winner === match.user1._id).length;
    const user2WinCount = match.turns.filter((turn) => turn.winner === match.user2._id).length;

    return user1WinCount > user2WinCount ? match.user1.username : user2WinCount > user1WinCount ? match.user2.username : "draw";
  }

  function Winner() {
    if(!winner)
      return (
        <div>
          <h1>Match en cours</h1>
        </div>
      )
    if(winner === gameState.DRAW)
      return (
        <div>
          <h1>Match terminé</h1>
          <h2>Match nul</h2>
        </div>
      )
    return (
      <div>
        <h1>Match terminé</h1>
        <h2>Le vainqueur est {winner}</h2>
      </div>
    );
  }

  function Buttons() {
    if(!winner)
      return (
        <nav>
          <button onClick={() => submitMove(getTransportEquivalent("RER"))} disabled={ moveDisabled }>RER</button>
          <button onClick={() => submitMove(getTransportEquivalent("Metro"))} disabled={ moveDisabled }>Metro</button>
          <button onClick={() => submitMove(getTransportEquivalent("Tram"))} disabled={ moveDisabled }>Tram</button>
        </nav>
      )
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

    return equivalents.hasOwnProperty(choice) ? equivalents[choice] : reverseEquivalents[choice] || "Inconnu";
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
        setMoveDisabled(true);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.turn === gameState.NOT_FOUND) {
          setError("Tour non trouvé.");
        } else if (data.turn === gameState.NOT_LAST) {
          setError("Le tour est déjà terminé.");
        } else if (data.match === gameState.ENDED) {
          setError("Le match est déjà terminé.");
        } else if (data.user === gameState.ALREADY_MOVED) {
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

  return (
    <>
      <Winner></Winner>
      <div className="flex flex-col items-center">
        <div>
          <h2> Vous êtes le joueur { userNumber.current === 1 ? '1 : ' + match.user1.username : '2 : ' + match.user2.username }</h2>
          <h3> Tour n°{turn}</h3>
          <Buttons></Buttons>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Turn</th>
            <th>Joueur 1</th>
            <th>Joueur 2</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          {match.turns.map((turn, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{getTransportEquivalent(turn.user1) || "En attente"}</td>
              <td>{getTransportEquivalent(turn.user2) || "En attente"}</td>
              <td>{turn.winner === gameState.DRAW ? "Égalité" : match[turn.winner]?.username || "En attente"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
