import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { gameState } from "../data/data.js";
import animateTrain from "../components/trainAnimation";

const API_URL = import.meta.env.VITE_API_URL;

export default function MatchList() {
  const [matches, setMatches] = useState([]);
  const [errorCreate, setErrorCreate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const matchesResponse = await axios.get(`${API_URL}/matches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Matchs récupérés :", matchesResponse.data);
      setMatches(matchesResponse.data);
      setError("");
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setError("Erreur lors de la récupération des matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const createMatch = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/matches`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        fetchMatches();
      } else {
        setErrorCreate(response.data.match || "Erreur inconnue");
      }
    } catch (err) {
      console.error("Erreur lors de la création d'un match :", err);
      setErrorCreate("Une erreur est survenue lors de la création du match.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center flex-col mb-4">
        <h1 className="text-2xl text-center m-6">Liste des matchs</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => createMatch()}
            className="px-4 py-2 text-white bg-blue-500 rounded cursor-pointer transition hover:brightness-110"
          >
            + Créer une partie
          </button>
          <button
            onClick={fetchMatches}
            className="px-4 py-2 text-white bg-gray-500 rounded cursor-pointer transition hover:brightness-110"
            disabled={loading}
          >
            {loading ? "Chargement..." : "Rafraîchir"}
          </button>
        </div>
        {errorCreate && <p className="text-red-500 m-1">{errorCreate}</p>}
      </div>

      <h2 className="mb-2 text-2xl text-center">Vos matchs</h2>
      <table className="w-4/5 m-auto mb-4 bg-white rounded shadow table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID du match</th>
            <th className="p-2">Joueur 1</th>
            <th className="p-2">Joueur 2</th>
            <th className="p-2">Statut du match</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => {
            let allTurnsPlayed = false;
            if (match.turns && match.turns.length === 3) {
              allTurnsPlayed = match.turns.every((t) => t.user1 && t.user2);
            }

            let winnerLabel;
            if (match.winner) {
              winnerLabel = match.winner.username;
            } else {
              if (allTurnsPlayed) {
                winnerLabel = gameState.DRAW;
              } else {
                winnerLabel = "En cours";
              }
            }

            return (
              <tr key={match._id}>
                <td className="p-2 text-center">{match._id}</td>
                <td className="p-2 text-center">{match.user1?.username || "En attente"}</td>
                <td className="p-2 text-center">{match.user2?.username || "En attente"}</td>
                <td className="p-2 text-center">
                  {winnerLabel === gameState.DRAW ? "Égalité" : winnerLabel}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => navigate(`/game/${match._id}`)}
                    className="px-4 py-2 text-white bg-green-500 rounded cursor-pointer transition hover:brightness-110"
                  >
                    {match.winner || winnerLabel === gameState.DRAW ? "Voir" : "Jouer"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

	  <div className="w-full">{animateTrain("RER", "left-to-right")}</div>
    </div>
  );
}
