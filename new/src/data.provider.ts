import {io} from 'socket.io-client';
import {EventEmitter} from 'events';

import { TableFilter, PlayerFilter, playerFilter, tableFilter } from './filter.engine';


export class DataProvider {

    subscribeToTables(filter: TableFilter) {
        const socket = io('ws://tables:3000').emit('subscribe');
        const eventEmitter = new EventEmitter();
        socket.on('data', ({value}) => {
            if (tableFilter(value, filter)) {
                eventEmitter.emit('data', {value, id: socket.id})
            }
        });
        
        return eventEmitter;
    }

    subscribeToPlayers(filter: PlayerFilter) {
        const socket = io('ws://players:3000').emit('subscribe');
        const eventEmitter = new EventEmitter();
        socket.on('data', ({value}) => {
            if (playerFilter(value, filter)) {
                eventEmitter.emit('data', {value, id: socket.id});
            }
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
    
    return eventEmitter;
}
