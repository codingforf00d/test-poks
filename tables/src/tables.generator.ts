import * as _ from 'lodash';

type GameType = 'NLH' | 'PLO';

type Player = {playerId: string; stackAtCents: number; cards: string[]};

export type Table = {
  tableId: number;
  gameType: GameType;
  bbInCents: number;
  anteInCents?: number;
  organizationId: string;
  size: number;
  seats: Array<Player>;
}

const deck: string[] = [
  'As', 'Ks', 'Qs', 'Js', 'Ts', '9s', '8s', '7s', '6s', '5s', '4s', '3s', '2s',
  'Ah', 'Kh', 'Qh', 'Jh', 'Th', '9h', '8h', '7h', '6h', '5h', '4h', '3h', '2h',
  'Ad', 'Kd', 'Qd', 'Jd', 'Td', '9d', '8d', '7d', '6d', '5d', '4d', '3d', '2d',
  'Ac', 'Kc', 'Qc', 'Jc', 'Tc', '9c', '8c', '7c', '6c', '5c', '4c', '3c', '2c',
];

export function* tableGenerator(): Generator<Table> {
  while (true) {
    const size = _.sample([6, 9]);
    const numberOfSeats = _.random(1, size);
    const seats = _.range(0, numberOfSeats).map((_n) => ({
      playerId: `player${_.random(1, 50)}`,
      stackAtCents: _.random(1000, 20_000),
      cards: [_.sample(deck), _.sample(deck)] // Карты могут быть одинаковые, но в рамках задачи это не важно
    }))
  
    const table: Table = {
      tableId: _.random(1, 6),
      gameType: _.sample<GameType>(['NLH', 'PLO']),
      bbInCents: _.random(0, 100),
      organizationId: _.sample(['org1', 'org2', 'org3', 'org4', 'org5']),
      size,
      seats,
    };

    yield table;
  }
}