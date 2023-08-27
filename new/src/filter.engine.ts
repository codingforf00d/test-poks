import _ from 'lodash'
import { Player } from '@players';
import { Table } from '@tables';

export type TableFilter = {
    gameType?: 'NLH' | 'PLO';
    bbAtCents?: [number, number];
    anteAtCents?: [number, number];
    organizationId?: string;
    size?: [number, number];
    occupiedSeatsCount?: [number, number]
  }


export type PlayerFilter = {
    playerId?: string;
    name?: string;
    balanceAtCents?: [number, number];
    online?: boolean;
    totalOnlineTables?: number;
    organizations?: Array<{id: string; inGameTables: number[]}>;
}

export const playerFilter = (data: Player, filter: PlayerFilter) => {
    if (filter.playerId != null) {
        if (data.playerId !== filter.playerId) {
            return false;
        }
    }
    if (filter.balanceAtCents != null) {
        if (!_.inRange(data.balanceAtCents, filter.balanceAtCents[0], filter.balanceAtCents[1])) {
            return false;
        }
    }
    if (filter.online != null) {
        if (data.tableIds.length === 0) {
            return false;
        }
    }
    return true;
}

export const tableFilter = (data: Table, filter: TableFilter) => {
    if (filter.anteAtCents != null) {
        if (
            data.anteInCents == null ||
            !_.inRange(data.anteInCents, filter.anteAtCents[0], filter.anteAtCents[1])
        ) {
            return false;
        }
    }

    if (filter.gameType != null) {
        if (data.gameType !== filter.gameType) {
            return false;
        }
    }

    if (filter.size != null) {
        if (!_.inRange(data.size, filter.size[0], filter.size[1])) {
            return false
        }
    }

    return true;
}
