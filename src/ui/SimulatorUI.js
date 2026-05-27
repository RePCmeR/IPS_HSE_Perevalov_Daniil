import { loadStrategies } from '../data/storage.js';
import { presetStrategies } from '../data/presets.js';
import { GraphEditor } from './GraphEditor.js';
import { GameUI } from './GameUI.js';
import { DEFAULT_PAYOFF } from '../core/PayoffMatrix.js';

export class SimulatorUI {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  showOneVsOne() {
    this.container.innerHTML = `
      <h2>Режим 1 на 1</h2>
      <p>Сначала создайте или загрузите стратегию противника (и свою, опционально).</p>
      <button id="btn-open-editor">Открыть редактор</button>
      <div id="sim-controls" style="display:none;">
        <label>Количество раундов: <input id="sim-rounds" type="number" value="10" min="1"></label>
        <button id="btn-start-sim">Запустить симуляцию</button>
        <button id="btn-manual-play">Играть вручную (без своей стратегии)</button>
      </div>
      <div id="sim-result"></div>
    `;

    document.getElementById('btn-open-editor').onclick = () => {
      // Переключаемся на экран редактора
      document.getElementById('simulator-screen').style.display = 'none';
      document.getElementById('editor-screen').style.display = 'flex';
      if (!window.graphEditor) {
        window.graphEditor = new GraphEditor('cy-container', 'palette');
        document.getElementById('btn-toggle-strategy').onclick = () => {
          const mode = window.graphEditor.currentMode === 'opponent' ? 'my' : 'opponent';
          window.graphEditor.switchMode(mode);
        };
        document.getElementById('btn-save-strategy').onclick = () => window.graphEditor.save();
        document.getElementById('btn-load-preset').onclick = () => window.graphEditor.loadPreset();
        document.getElementById('btn-back-editor').onclick = () => {
          window.graphEditor.saveCurrentToStrategy();
          document.getElementById('editor-screen').style.display = 'none';
          document.getElementById('simulator-screen').style.display = 'block';
          document.getElementById('sim-controls').style.display = 'block';
        };
      }
    };

    document.getElementById('btn-start-sim')?.addEventListener('click', async () => {
      const rounds = parseInt(document.getElementById('sim-rounds').value) || 10;
      const oppStrategy = window.graphEditor?.getOpponentStrategy();
      const myStrategy = window.graphEditor?.getMyStrategy();
      if (!oppStrategy) {
        alert('Сначала создайте стратегию противника в редакторе!');
        return;
      }
      if (!myStrategy) {
        alert('Создайте свою стратегию или выберите ручной режим.');
        return;
      }
      const { Game } = await import('../core/Game.js');
      const game = new Game(oppStrategy, oppStrategy.startNodeId, DEFAULT_PAYOFF);
      let myState = myStrategy.startNodeId;
      for (let i = 0; i < rounds; i++) {
        const myAction = myStrategy.getAction(myState);
        const res = game.playRound(myAction);
        myState = myStrategy.getNextState(myState, res.opponentAction);
      }
      const scores = game.getScores();
      document.getElementById('sim-result').innerHTML = `
        <p>Результат симуляции:</p>
        <p>Ваша стратегия: ${scores.player} очков</p>
        <p>Стратегия противника: ${scores.opponent} очков</p>
      `;
    });

    document.getElementById('btn-manual-play')?.addEventListener('click', () => {
      const oppStrategy = window.graphEditor?.getOpponentStrategy();
      if (!oppStrategy) {
        alert('Сначала создайте стратегию противника в редакторе!');
        return;
      }
      const rounds = parseInt(document.getElementById('sim-rounds').value) || 10;
      // Переходим в игру
      document.getElementById('simulator-screen').style.display = 'none';
      document.getElementById('game-screen').style.display = 'block';
      document.getElementById('game-submenu').style.display = 'none';
      new GameUI('game-area', oppStrategy, rounds, DEFAULT_PAYOFF);
    });
  }

  showTournament() {
    import('./TournamentUI.js').then(mod => {
      const tourUI = new mod.TournamentUI('tournament-bracket', 'strategy-list');
      document.getElementById('simulator-screen').style.display = 'none';
      document.getElementById('tournament-screen').style.display = 'flex';
      window.tourUI = tourUI;
    });
  }
}