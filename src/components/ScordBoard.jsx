import {gameState, getTransportEquivalent} from "../data/data.js";
import PropTypes from 'prop-types';

export default function ScoreBoard({ match, playerNumber }) {
  return (
    <aside className="flex flex-col whitespace-nowrap min-w-sm">
      <header className={"bg-teal-500 px-4 py-8 rounded-t-md"}>
        <h2 className={"text-2xl font-semibold"}>{ playerNumber === 1 ? match.user1.username : match.user2.username }</h2>
        <p className={`${playerNumber === 1 ? 'text-blue-500' : 'text-red-500'} font-normal text-xl` }> Joueur {playerNumber}</p>
      </header>
      <table>
        <thead>
        <tr className={"text-left"}>
          <th>Manche</th>
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
    </aside>
  )
}
ScoreBoard.propTypes = {
  match: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  turn: PropTypes.number.isRequired,
};