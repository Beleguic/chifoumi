export const gameState = {
  ON_GOING: "on_going",
  ENDED: "Match already finished",
  DRAW: "draw",
  WIN: "win",
  LOSE: "lose",
  NOT_FOUND: "not found",
  NOT_LAST: "not last",
  ALREADY_MOVED: "move already given",
}
export const getTransportEquivalent = (choice) => {
  const equivalents = {
    rock: "RER",
    paper: "Metro",
    scissors: "Tram",
  };

  const reverseEquivalents = Object.fromEntries(
    Object.entries(equivalents).map(([key, value]) => [value, key])
  );

  return Object.prototype.hasOwnProperty.call(equivalents, choice) ? equivalents[choice] : reverseEquivalents[choice] || "Inconnu";
};