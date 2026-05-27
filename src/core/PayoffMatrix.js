export const DEFAULT_PAYOFF = {
  'C,C': [3, 3],
  'C,D': [0, 5],
  'D,C': [5, 0],
  'D,D': [1, 1]
};

export function getPayoff(playerAction, opponentAction, matrix = DEFAULT_PAYOFF) {
  const key = `${playerAction},${opponentAction}`;
  return matrix[key] || [0, 0];
}