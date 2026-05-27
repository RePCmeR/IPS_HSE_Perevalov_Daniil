import { Game } from './Game.js';

export function runMatch(strategyA, strategyB, rounds = 10, payoffMatrix = null) {
  const game = new Game(strategyB, strategyB.startNodeId, payoffMatrix);
  let currentStateA = strategyA.startNodeId;
  for (let i = 0; i < rounds; i++) {
    const actionA = strategyA.getAction(currentStateA);
    const result = game.playRound(actionA);
    currentStateA = strategyA.getNextState(currentStateA, result.opponentAction);
  }
  return game.getScores();
}

export function runTournament(strategies, rounds = 10) {
  const scores = {};
  strategies.forEach(s => { scores[s.name] = 0; });
  for (const s1 of strategies) {
    for (const s2 of strategies) {
      if (s1 === s2) continue;
      const { player } = runMatch(s1, s2, rounds);
      scores[s1.name] += player;
    }
  }
  return scores;
}