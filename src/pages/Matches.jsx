import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function MatchList() {
  const [matches, setMatches] = useState([]);
  const [errorCreate, setErrorCreate] = useState([]);
  const [error, setError] = useState([]);
  const navigate = useNavigate();

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const matchesResponse = await axios.get(`${API_URL}/matches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Matchs récupérés :", matchesResponse.data);
      setMatches(matchesResponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
	  	setError("Erreur lors de la récupération des matches");
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
      	<div className="flex items-center justify-between mb-4">
        	<h1 className="text-2xl">Liste des matchs</h1>
			<button onClick={() => createMatch()} className="px-4 py-2 text-white bg-blue-500 rounded">
          		+ Créer une partie
        	</button>
			{errorCreate && <p>{errorCreate}</p>}
      	</div>

      	<h2 className="mb-2 text-lg">Vos matchs</h2>
      	<table className="w-full mb-4 bg-white rounded shadow table-auto">
        	<thead>
          		<tr className="bg-gray-200">
            		<th className="p-2">ID</th>
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
					winnerLabel = "Égalité";
				  } else {
					winnerLabel = "En cours";
				  }
				}
				
            	return (
              		<tr key={match._id}>
                	<td className="p-2">{match._id}</td>
                	<td className="p-2">{match.user1?.username || "En attente"}</td>
                	<td className="p-2">{match.user2?.username || "En attente"}</td>
                	<td className="p-2">{winnerLabel}</td>
                	<td className="p-2">
                	  <button
                	    onClick={() => navigate(`/game/${match._id}`)}
                	    className="px-4 py-2 text-white bg-green-500 rounded"
                	  >
                	    Jouer
                	  </button>
                	</td>
              	</tr>
            	);
          	})}
        	</tbody>
      	</table>
    </div>
  );
}
