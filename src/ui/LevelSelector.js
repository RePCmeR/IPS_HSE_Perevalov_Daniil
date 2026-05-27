import { presetLevels } from '../data/presets.js';
import { GameUI } from './GameUI.js';

export class LevelSelector {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  show() {
    this.container.innerHTML = '<div id="levels-grid"></div>';
    const grid = document.getElementById('levels-grid');
    presetLevels.forEach((level, idx) => {
      const card = document.createElement('div');
      card.className = 'level-card';
      card.innerHTML = `<div class="level-num">${idx + 1}</div><div class="level-desc">${level.name}</div>`;
      card.addEventListener('click', () => this.startLevel(level));
      grid.appendChild(card);
    });
  }

  startLevel(level) {
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('game-submenu').style.display = 'none';
    new GameUI('game-area', level.opponentStrategy, level.rounds, level.payoff);
  }
}