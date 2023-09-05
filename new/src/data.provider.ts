import {io} from 'socket.io-client';
import {EventEmitter} from 'events';

import { TableFilter, PlayerFilter, playerFilter, tableFilter } from './filter.engine';


export class DataProvider {

    subscribeToTables(filter: TableFilter) {
        const socket = io('ws://localhost:3002').emit('subscribe');
        const eventEmitter = new EventEmitter();
        // value - массив стейтов столов
        socket.on('data', ({value}) => {
            const filteredTables = value.filter((table) => tableFilter(table, filter))
            eventEmitter.emit('data', {value: filteredTables, id: socket.id})
        });

        const closeSocket = () => socket.close();

        return [eventEmitter, closeSocket];
    }

    subscribeToPlayers(filter: PlayerFilter) {
        const socket = io('ws://localhost:3001').emit('subscribe');
        const eventEmitter = new EventEmitter();
        // value - массив стейтов игроков
        socket.on('data', ({value}) => {
            const filteredPlayers = value.filter((player) => playerFilter(player, filter))
            eventEmitter.emit('data', {value: filteredPlayers, id: socket.id});
        });
        
        return eventEmitter;
    }
}


export function combineLatest(...subscriptions: EventEmitter[]) {
    let state = {};
    const eventEmitter = new EventEmitter();

    for (const subscription of subscriptions) {
        subscription.on('data', ({id, value}) => {
            state[id] = value;
            const newState = {...state};
            eventEmitter.emit('data', newState);
        });
    }

    const stopSubscriptions = () => {
        for (const subscription of subscriptions) {
            subscription.removeAllListeners();
        }
    }

    return [eventEmitter, stopSubscriptions];
}
