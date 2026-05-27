import { Strategy } from '../core/Strategy.js';

export const presetStrategies = [
  new Strategy('Всегда сотрудничать',
    [{ id: 'n0', action: 'C', x: 200, y: 200 }],
    [
      { source: 'n0', target: 'n0', playerAction: 'C' },
      { source: 'n0', target: 'n0', playerAction: 'D' }
    ],
    'n0'
  ),
  new Strategy('Всегда предавать',
    [{ id: 'n0', action: 'D', x: 200, y: 200 }],
    [
      { source: 'n0', target: 'n0', playerAction: 'C' },
      { source: 'n0', target: 'n0', playerAction: 'D' }
    ],
    'n0'
  ),
  new Strategy('Око за око',
    [
      { id: 'good', action: 'C', x: 150, y: 100 },
      { id: 'bad', action: 'D', x: 350, y: 100 }
    ],
    [
      { source: 'good', target: 'good', playerAction: 'C' },
      { source: 'good', target: 'bad', playerAction: 'D' },
      { source: 'bad', target: 'good', playerAction: 'C' },
      { source: 'bad', target: 'bad', playerAction: 'D' }
    ],
    'good'
  )
];

export const presetLevels = [
  {
    name: 'Уровень 1: Доверчивый',
    description: 'Противник всегда сотрудничает. Наберите максимум очков.',
    opponentStrategy: presetStrategies[0],
    payoff: { 'C,C': [3, 3], 'C,D': [0, 5], 'D,C': [5, 0], 'D,D': [1, 1] },
    rounds: 10,
    condition: 'score > 25'
  },
  {
    name: 'Уровень 2: Предатель',
    description: 'Противник всегда предаёт. Постарайтесь минимизировать потери.',
    opponentStrategy: presetStrategies[1],
    payoff: { 'C,C': [3, 3], 'C,D': [0, 5], 'D,C': [5, 0], 'D,D': [1, 1] },
    rounds: 10,
    condition: 'score > 5'
  },
  {
    name: 'Уровень 3: Зеркало',
    description: 'Око за око. Будьте осторожны с выбором.',
    opponentStrategy: presetStrategies[2],
    payoff: { 'C,C': [3, 3], 'C,D': [0, 5], 'D,C': [5, 0], 'D,D': [1, 1] },
    rounds: 10,
    condition: 'score > 15'
  }
];