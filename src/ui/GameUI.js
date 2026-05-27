import { Game } from '../core/Game.js';
import { DEFAULT_PAYOFF } from '../core/PayoffMatrix.js';

export class GameUI {
  constructor(containerId, strategy, rounds = 10, payoffMatrix = DEFAULT_PAYOFF) {
    this.container = document.getElementById(containerId);
    this.strategy = strategy;
    this.totalRounds = rounds;
    this.roundsLeft = rounds;
    this.payoff = payoffMatrix;
    this.currentNodeId = strategy.startNodeId;
    this.playerScore = 0;
    this.opponentScore = 0;

    this.container.innerHTML = `
      <div id="game-graph"></div>
      <div id="game-control-panel">
        <button id="btn-finish-game">Завершить игру</button>
        <div id="payoff-matrix-display"></div>
        <div id="score-panel">
          <span class="player-score">Игрок: <span id="player-score">0</span></span>
          <span class="opponent-score">Противник: <span id="opponent-score">0</span></span>
          <span>Раунд: <span id="round-counter">0/0</span></span>
        </div>
      </div>
    `;

    this.game = new Game(strategy, strategy.startNodeId, payoffMatrix);
    this.cy = this.initCytoscape();
    this.highlightCurrent();
    this.attachEvents();
    this.updateScore();
    this.createControlPanel();
  }

  initCytoscape() {
    const cy = cytoscape({
      container: document.getElementById('game-graph'),
      elements: this.getCyElements(),
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#aaa',
            'label': 'data(action)',
            'text-valign': 'center',
            'color': '#fff',
            'width': 50,
            'height': 50
          }
        },
        {
          selector: 'node.cooperate',
          style: { 'background-color': '#4caf50' }
        },
        {
          selector: 'node.defect',
          style: { 'background-color': '#f44336' }
        },
        {
          selector: 'node.current',
          style: {
            'border-width': 5,
            'border-color': '#ff9800',
            'border-style': 'solid'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#888',
            'target-arrow-color': '#888',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': 10,
            'text-rotation': 'autorotate'
          }
        }
      ],
      layout: { name: 'preset' },
      userZooming: false,
      userPanning: false
    });
    return cy;
  }

  getCyElements() {
    const nodes = this.strategy.nodes.map(n => ({
      group: 'nodes',
      data: { id: n.id, action: n.action },
      classes: n.action === 'C' ? 'cooperate' : 'defect',
      position: { x: n.x || 200, y: n.y || 200 }
    }));
    const edges = this.strategy.edges.map(e => ({
      group: 'edges',
      data: {
        source: e.source,
        target: e.target,
        label: e.playerAction + (e.probability ? ` (${e.probability.toFixed(2)})` : ''),
        playerAction: e.playerAction
      }
    }));
    return nodes.concat(edges);
  }

  highlightCurrent() {
    this.cy.nodes().removeClass('current');
    this.cy.getElementById(this.currentNodeId).addClass('current');
  }

  attachEvents() {
    // Левый клик -> Cooperate
    this.cy.on('tap', 'node', () => {
      this.playRound('C');
    });

    // Правый клик -> Defect
    this.cy.on('cxttap', 'node', () => {
      this.playRound('D');
    });

    document.getElementById('game-graph').oncontextmenu = () => false;
  }

  playRound(playerAction) {
    if (this.roundsLeft <= 0) {
      this.endGame();
      return;
    }
    const result = this.game.playRound(playerAction);
    this.currentNodeId = result.nextNodeId;
    this.playerScore = this.game.playerScore;
    this.opponentScore = this.game.opponentScore;
    this.roundsLeft--;
    this.highlightCurrent();
    this.updateScore();
    if (this.roundsLeft === 0) {
      this.endGame();
    }
  }

  updateScore() {
    document.getElementById('player-score').innerText = this.playerScore;
    document.getElementById('opponent-score').innerText = this.opponentScore;
    document.getElementById('round-counter').innerText = `${this.game.round}/${this.totalRounds}`;
  }

  createControlPanel() {
    document.getElementById('btn-finish-game').onclick = () => {
      this.destroy();
      document.getElementById('game-submenu').style.display = 'block';
      this.container.innerHTML = '';
    };

    const matrixDiv = document.getElementById('payoff-matrix-display');
    if (matrixDiv) {
      matrixDiv.innerHTML = `
        <h3>Матрица выигрышей</h3>
        <table>
          <tr><th></th><th>C (противник)</th><th>D (противник)</th></tr>
          <tr><td>C (вы)</td><td>${this.payoff['C,C'][0]}:${this.payoff['C,C'][1]}</td><td>${this.payoff['C,D'][0]}:${this.payoff['C,D'][1]}</td></tr>
          <tr><td>D (вы)</td><td>${this.payoff['D,C'][0]}:${this.payoff['D,C'][1]}</td><td>${this.payoff['D,D'][0]}:${this.payoff['D,D'][1]}</td></tr>
        </table>
      `;
    }
  }

  destroy() {
    if (this.cy) {
      this.cy.destroy();
      this.cy = null;
    }
    const graphDiv = document.getElementById('game-graph');
    if (graphDiv) {
      graphDiv.oncontextmenu = null;
    }
  }

  endGame() {
    let message = 'Игра окончена!\n';
    if (this.playerScore > this.opponentScore) {
      message += 'Вы выиграли!';
    }
    else if (this.playerScore < this.opponentScore) {
      message += 'Вы проиграли.';
    }
    else {
      message += 'Ничья.';
    }
    alert(message);
    this.cy.off('tap');
    this.cy.off('cxttap');
    const graphDiv = document.getElementById('game-graph');
    if (graphDiv) {
      graphDiv.oncontextmenu = null;
    }
  }
}