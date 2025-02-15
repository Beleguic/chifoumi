import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

export default function Animation({ match, turn }) {
  const [turnJ1, setTurnJ1] = useState(null); // Choix du Joueur 1
  const [turnJ2, setTurnJ2] = useState(null); // Choix du Joueur 2
  const [turnAffiche, setTurnAffiche] = useState(null);

  useEffect(() => {
	
    let validTurn = turn - 1; // On commence par le tour actuel
    let MatchTurn = match.turns[validTurn];

    // Si le tour actuel n'a pas de coup joué, on prend le précédent
    while (validTurn > 0 && (!MatchTurn?.user1 && !MatchTurn?.user2)) {
      validTurn--; // On remonte d'un tour
      MatchTurn = match.turns[validTurn];
    }

	setTurnAffiche(validTurn + 1);

    // On met à jour seulement si un tour valide existe
    if (MatchTurn?.user1 || MatchTurn?.user2) {
      setTurnJ1(MatchTurn.user1 ?? null);
      setTurnJ2(MatchTurn.user2 ?? null);
    }
  }, [match, turn]); // Se déclenche uniquement si match ou turn change

  // Styles dynamiques pour le Joueur 1
  const trainStylesJ1 = {
    Metro: turnJ1 === "paper" ? { transform: "translateX(20em)", transition: "transform 0.5s ease-in-out" } : {},
    RER: turnJ1 === "rock" ? { transform: "translateX(20em)", transition: "transform 0.5s ease-in-out" } : {},
    Tram: turnJ1 === "scissors" ? { transform: "translateX(20em)", transition: "transform 0.5s ease-in-out" } : {},
  };

  // Styles dynamiques pour le Joueur 2
  const trainStylesJ2 = {
    Metro: turnJ2 === "paper" ? { transform: "translateX(-20em)", transition: "transform 0.5s ease-in-out" } : {},
    RER: turnJ2 === "rock" ? { transform: "translateX(-20em)", transition: "transform 0.5s ease-in-out" } : {},
    Tram: turnJ2 === "scissors" ? { transform: "translateX(-20em)", transition: "transform 0.5s ease-in-out" } : {},
  };

  return (
    <>
		<h2 className='text-center text-2xl font-bold'>Resultat du tour {turnAffiche}</h2>
		<div className="flex flex-row">
			{/* Partie Gauche - Joueur 1 */}
			<div className="flex flex-col w-1/2">
			<h2 className="text-center text-lg font-bold">Joueur 1</h2>
			<div className="flex relative h-20 overflow-hidden">
				<div className="absolute trainLeft container flex justify-end" style={trainStylesJ1.Metro}>
				<img src="/public/Metro.png" alt="Metro - MP89" className="imgTrain" />
				</div>
			</div>
			<div className="flex relative h-20 overflow-hidden">
				<div className="absolute trainLeft container flex justify-end" style={trainStylesJ1.RER}>
				<img src="/public/RER.png" alt="RER - MI09" className="imgTrain" />
				</div>
			</div>
			<div className="flex relative h-20 overflow-hidden">
				<div className="absolute trainLeft container flex justify-end" style={trainStylesJ1.Tram}>
				<img src="/public/Tram.png" alt="Tram - TW07" className="imgTrain" />
				</div>
			</div>
			</div>

			{/* Partie Droite - Joueur 2 */}
			<div className="flex flex-col w-1/2">
			<h2 className="text-center text-lg font-bold">Joueur 2</h2>
			<div className="flex relative h-20 overflow-hidden">
				<div className="absolute trainRight container flex justify-start" style={trainStylesJ2.Metro}>
				<img src="/public/Metro.png" alt="Metro - MP89" className="imgTrain" />
				</div>
			</div>
			<div className="flex relative h-20 overflow-hidden">
				<div className="absolute trainRight container flex justify-start" style={trainStylesJ2.RER}>
				<img src="/public/RER.png" alt="RER - MI09" className="imgTrain" />
				</div>
			</div>
			<div className="flex relative h-20 overflow-hidden">
				<div className="absolute trainRight container flex justify-start" style={trainStylesJ2.Tram}>
				<img src="/public/Tram.png" alt="Tram - TW07" className="imgTrain" />
				</div>
			</div>
			</div>
		</div>
    </>
  );
}

Animation.propTypes = {
  match: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  turn: PropTypes.number.isRequired,
};
