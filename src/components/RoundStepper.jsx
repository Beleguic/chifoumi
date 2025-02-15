import PropTypes from 'prop-types';
import {gameState} from "../data/data.js";
import {Fragment} from "react";

export default function RoundStepper({ match, turn, maxTurns, playerNumber }) {
  const { turns = [] } = match;

  // Helper to get the result for each turn
  const getResult = (turnIndex) => {
    if (turnIndex >= turns.length) return ''; // No result for this turn yet
    const { winner } = turns[turnIndex];
    if(!winner) return '';
    if (winner === 'draw') return gameState.DRAW;
    return winner === `user${playerNumber}` ? gameState.WIN : gameState.LOSE;
  };

  function Separator({ index }) {
    if (index < maxTurns - 1) {
      return (
        <li className={`separator 
              ${index < turn-1 ? 'separator-played' : ''}`}
            key={`separator-${index}`}
        >
          <span></span>
        </li>
      );
    }
  }
  Separator.propTypes = {
    index: PropTypes.number.isRequired,
  }
  return (
    <nav className={'round-scores'}>
      <ul>
        {Array.from({ length: maxTurns }).map((_, index) => (
          <Fragment key={`round-fragment-${index}`}>
          <li key={`round-bullet-${index}`}>
            <span
              className={`
              round-bullet 
              ${index <= turn-1 ? 'round-bullet-played' : ''} 
              ${index === turn-1 ? 'round-bullet-current' : ''}
              ${getResult(index) === gameState.WIN ? 'round-bullet-win' : getResult(index) === gameState.LOSE ? 'round-bullet-lose' : getResult(index) === gameState.DRAW ? 'round-bullet-draw' : ''}
              `}
            >{getResult(index)}</span>
          </li>
          <Separator index={index}></Separator>
          </Fragment>
        ))}
      </ul>
    </nav>
  );
}

RoundStepper.propTypes = {
  match: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    user1: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      iat: PropTypes.number.isRequired,
      exp: PropTypes.number.isRequired,
    }).isRequired,
    user2: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      iat: PropTypes.number.isRequired,
      exp: PropTypes.number.isRequired,
    }).isRequired,
    turns: PropTypes.arrayOf(
      PropTypes.shape({
        user1: PropTypes.string,
        user2: PropTypes.string,
        winner: PropTypes.string,
      })
    ).isRequired,
    winner: PropTypes.object,
    __v: PropTypes.number,
  }).isRequired,
  turn: PropTypes.number.isRequired,
  maxTurns: PropTypes.number.isRequired,
  playerNumber: PropTypes.number.isRequired,
};