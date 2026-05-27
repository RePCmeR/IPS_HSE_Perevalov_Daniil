import { GameUI } from './ui/GameUI.js';
import { LevelSelector } from './ui/LevelSelector.js';
import { SimulatorUI } from './ui/SimulatorUI.js';
import { GraphEditor } from './ui/GraphEditor.js';
import { generateRandomStrategy } from './utils/randomStrategy.js';
import { DEFAULT_PAYOFF } from './core/PayoffMatrix.js';

const screens = {
  main: document.getElementById('main-menu'),
  game: document.getElementById('game-screen'),
  simulator: document.getElementById('simulator-screen'),
  editor: document.getElementById('editor-screen'),
  tournament: document.getElementById('tournament-screen')
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.style.display = 'none');
  if (screens[name]) screens[name].style.display = 'flex';
}

// Главное меню
document.getElementById('btn-play').onclick = () => {
  showScreen('game');
  document.getElementById('game-submenu').style.display = 'block';
  document.getElementById('game-area').innerHTML = '';
};

document.getElementById('btn-simulator').onclick = () => {
  showScreen('simulator');
  document.getElementById('sim-area').innerHTML = '<p>Выберите режим симуляции.</p>';
};

document.getElementById('btn-exit').onclick = () => window.close();

// Игровое подменю
document.getElementById('btn-random-level').onclick = () => {
  document.getElementById('game-submenu').style.display = 'none';
  const randomStrat = generateRandomStrategy('Случайный противник', 5, false);
  new GameUI('game-area', randomStrat, 10, DEFAULT_PAYOFF);
};

document.getElementById('btn-levels').onclick = () => {
  document.getElementById('game-submenu').style.display = 'none';
  const levelSelector = new LevelSelector('game-area');
  levelSelector.show();
};

document.getElementById('btn-tutorial').onclick = () => {
  alert('Обучение:\n- Левая кнопка мыши на вершине: Сотрудничать (C)\n- Правая кнопка мыши: Предать (D)\n- Ваша цель набрать больше очков, чем противник.');
};

document.getElementById('btn-back-game').onclick = () => showScreen('main');

// Симулятор
document.getElementById('btn-one-vs-one').onclick = () => {
  const simUI = new SimulatorUI('sim-area');
  simUI.showOneVsOne();
};

document.getElementById('btn-tournament').onclick = () => {
  const simUI = new SimulatorUI('sim-area');
  simUI.showTournament();
};

document.getElementById('btn-back-sim').onclick = () => showScreen('main');

// Редактор
document.getElementById('btn-load-preset').onclick = () => {
  if (window.graphEditor) window.graphEditor.loadPreset();
};
document.getElementById('btn-save-strategy').onclick = () => {
  if (window.graphEditor) window.graphEditor.save();
};
document.getElementById('btn-toggle-strategy').onclick = () => {
  if (window.graphEditor) {
    const mode = window.graphEditor.currentMode === 'opponent' ? 'my' : 'opponent';
    window.graphEditor.switchMode(mode);
  }
};
document.getElementById('btn-back-editor').onclick = () => {
  if (window.graphEditor) {
    window.graphEditor.saveCurrentToStrategy();
  }
  showScreen('simulator');
};

showScreen('main');