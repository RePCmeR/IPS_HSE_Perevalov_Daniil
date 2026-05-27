import { Strategy } from '../core/Strategy.js';

const STORAGE_KEY = 'user_strategies';

export function saveStrategy(strategy) {
  const strategies = loadStrategies();
  const idx = strategies.findIndex(s => s.name === strategy.name);
  if (idx >= 0) {
    strategies[idx] = strategy;
  } else {
    strategies.push(strategy);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(strategies.map(s => s.toJSON())));
}

export function loadStrategies() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return arr.map(json => Strategy.fromJSON(json));
  } catch (e) {
    return [];
  }
}

export function deleteStrategy(name) {
  let strategies = loadStrategies();
  strategies = strategies.filter(s => s.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(strategies.map(s => s.toJSON())));
}