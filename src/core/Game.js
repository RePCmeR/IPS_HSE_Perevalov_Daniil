import { getPayoff } from "./PayoffMatrix.js";

export class Game {
  constructor(strategy, startNodeId = null, payoffMatrix = null) {
    this.strategy = strategy;
    this.currentNodeId = startNodeId || strategy.startNodeId;
    this.payoffMatrix = payoffMatrix;
    this.playerScore = 0;
    this.opponentScore = 0;
    this.round = 0;
    this.history = [];
  }

  playRound(playerAction) {
    const opponentAction = this.strategy.getAction(this.currentNodeId);
    const [player, opponent] = getPayoff(
      playerAction,
      opponentAction,
      this.payoffMatrix,
    );
    this.playerScore += player;
    this.opponentScore += opponent;

    const nextNodeId = this.strategy.getNextState(
      this.currentNodeId,
      playerAction,
    );
    this.history.push({
      round: ++this.round,
      playerAction,
      opponentAction,
      player,
      opponent,
      currentNodeId: this.currentNodeId,
      nextNodeId,
    });
    this.currentNodeId = nextNodeId;
    return { playerAction, opponentAction, player, opponent, nextNodeId };
  }

  getScores() {
    return { player: this.playerScore, opponent: this.opponentScore };
  }
}
