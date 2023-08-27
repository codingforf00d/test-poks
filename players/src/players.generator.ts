import * as _ from 'lodash';

export type Player = {
  playerId: string,
  name: string,
  balanceAtCents: number,
  tableIds: number[]
};

export function* playersGenerator(): Generator<Player> {
  while (true) {
    const playerId = `player${_.random(1, 50)}`
    yield {
      playerId,
      name: playerId,
      balanceAtCents: _.random(100, 20_000),
      tableIds: _.sample([[1], [2,3], [4,5,6], []])
    };
  }
}