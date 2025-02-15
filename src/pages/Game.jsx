import { useAuth } from "../contexts/AuthContext";
import {useEffect, useState, useCallback, useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { EventSourcePolyfill } from "event-source-polyfill";
import {gameState, getTransportEquivalent} from "../data/data.js";
import ScoreBoard from "../components/ScordBoard.jsx";
import RoundStepper from "../components/RoundStepper.jsx";

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

  const playerNumber = useRef(1)

	const fetchMatch = useCallback(async () => {
		try {
			setError(null);
			const token = localStorage.getItem("token");
			const response = await axios.get(`${API_URL}/matches/${matchId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			setMatch(response.data);
      console.log("match data set : ", response.data);
      playerNumber.current = response.data.user1._id === authId ? 1 : 2;
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
      if(Object.keys(lastTurn).includes(`user${playerNumber.current}`))
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
    const user1WinCount = match.turns.filter((turn) => turn.winner === 'user1').length;
    const user2WinCount = match.turns.filter((turn) => turn.winner === 'user2').length;

    return user1WinCount > user2WinCount ? "1" : user2WinCount > user1WinCount ? "2" : "draw";
  }

  function Winner() {
    if(!winner)
      return (
        <>
          <h1 className="text-3xl">Match en cours</h1>
        </>
      )
    if(winner === gameState.DRAW)
      return (
        <>
          <h1 className="text-6xl">Match terminé</h1>
          <h2 className="text-3xl">Match nul</h2>
        </>
      )
    return (
      <div>
        <h1>Match terminé</h1>
        <h2>Vous avez { winner === playerNumber.current.toString() ?  "gagné" : "perdu" }</h2>
      </div>
    );
  }

  function Buttons() {
    if(!winner)
      return (
        <nav className={"flex justify-evenly items-center w-full"}>
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
      <div className={"flex mx-auto w-xl gap-8 my-12"}>
        <div>
          <RoundStepper match={match} turn={turn} maxTurns={3} playerNumber={playerNumber.current}></RoundStepper>
          <div className={"text-center my-12"}>
            <Winner></Winner>
          </div>
          <div className={"gameboard"}>
            <Buttons></Buttons>
          </div>
        </div>
        <ScoreBoard match={match} playerNumber={playerNumber.current} turn={turn}></ScoreBoard>
      </div>
    </>
  );
}
