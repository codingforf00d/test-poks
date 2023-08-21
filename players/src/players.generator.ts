import _ from 'lodash';

type Player = {
  playerId: string,
  name: string,
  balanceAtCents: number
};

export function* playersGenerator(): Generator<Player> {
  while (true) {
    const playerId = `player${_.random(1, 50)}`
    yield {
      playerId,
      name: playerId,
      balanceAtCents: _.random(100, 20_000)
    };
  }
}