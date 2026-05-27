import { loadStrategies } from '../data/storage.js';
import { presetStrategies } from '../data/presets.js';
import { runTournament } from '../core/Tournament.js';
// Не работает пока что

export class TournamentUI {
  constructor(bracketContainerId, listContainerId) {
    this.bracketContainer = document.getElementById(bracketContainerId);
    this.listContainer = document.getElementById(listContainerId);
    this.strategies = [];
    this.bracketSize = 4;
    this.init();
  }

  init() {
    this.strategies = [...presetStrategies, ...loadStrategies()];
    this.renderStrategyList();
    this.renderBracket();
    this.setupDragAndDrop();
    document.getElementById('btn-start-tournament').onclick = () => this.startTournament();
    document.getElementById('btn-back-tournament').onclick = () => {
      document.getElementById('tournament-screen').style.display = 'none';
      document.getElementById('simulator-screen').style.display = 'block';
    };
  }

  renderStrategyList() {
    this.listContainer.innerHTML = this.strategies.map((s, i) => `
      <div class="strategy-card" draggable="true" data-index="${i}">
        <span>${s.name}</span>
        <button class="view-graph" data-index="${i}">👁</button>
      </div>
    `).join('');

    this.listContainer.querySelectorAll('.view-graph').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = e.target.dataset.index;
        const strat = this.strategies[idx];
        alert(`Граф стратегии "${strat.name}":\n` +
          strat.nodes.map(n => `${n.id} (${n.action})`).join('\n') +
          '\nПереходы: ' + strat.edges.length);
      });
    });
  }

  renderBracket() {
    this.bracketContainer.innerHTML = '';
    for (let i = 0; i < this.bracketSize; i++) {
      const slot = document.createElement('div');
      slot.className = 'bracket-slot';
      slot.dataset.slot = i;
      slot.textContent = 'Пусто';
      this.bracketContainer.appendChild(slot);
    }
  }

  setupDragAndDrop() {
    this.listContainer.querySelectorAll('.strategy-card').forEach(card => {
      card.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', card.dataset.index);
      });
    });

    this.bracketContainer.querySelectorAll('.bracket-slot').forEach(slot => {
      slot.addEventListener('dragover', e => e.preventDefault());
      slot.addEventListener('drop', e => {
        e.preventDefault();
        const stratIdx = e.dataTransfer.getData('text/plain');
        const strategy = this.strategies[stratIdx];
        slot.textContent = strategy.name;
        slot.dataset.strategy = stratIdx;
        slot.style.border = '2px solid #e94560';
      });
    });
  }

  startTournament() {
    const selected = [];
    this.bracketContainer.querySelectorAll('.bracket-slot').forEach(slot => {
      const idx = slot.dataset.strategy;
      if (idx !== undefined) selected.push(this.strategies[idx]);
    });
    if (selected.length < 2) {
      alert('Перетащите хотя бы 2 стратегии в сетку!');
      return;
    }
    const results = runTournament(selected, 10);
    let msg = 'Результаты турнира:\n';
    for (const [name, score] of Object.entries(results)) {
      msg += `${name}: ${score} очков\n`;
    }
    alert(msg);
  }
}