import {Socket, io} from 'socket.io-client';
import {EventEmitter} from 'events';

import { TableFilter, PlayerFilter, playerFilter, tableFilter } from './filter.engine';

type SubjectOptions = {
    socket?: Socket,
    childSubscriptions?: Subject[]
}

export class Subject extends EventEmitter {
    private socket: Socket;
    private childSubscriptions: Subject[];
    constructor(options?: SubjectOptions) {
        super();
        if (options.socket) {
            this.socket = options.socket;
        }
        if (options.childSubscriptions) {
            this.childSubscriptions = options.childSubscriptions;
        }
    }

    clearSubscription() {
        this.removeAllListeners();
        if (this.childSubscriptions) {
            for (const sub of this.childSubscriptions) {
                sub.clearSubscription();
            }
        }
        if (this.socket) {
            this.socket.close();
        }
    }
}

export class DataProvider {

    subscribeToTables(filter: TableFilter) {
        const socket = io('ws://localhost:3002').emit('subscribe');
        const subject = new Subject({socket});
        // value - массив стейтов столов
        socket.on('data', (updates) => {
            const filteredTables = updates.filter(({value}) => tableFilter(value, filter));
            if (filteredTables.length > 0) {
                subject.emit('data', {value: filteredTables, id: socket.id});
            }
        });


        return subject;
    }

    subscribeToPlayers(filter: PlayerFilter) {
        const socket = io('ws://localhost:3001').emit('subscribe');
        const subject = new Subject({socket});
        // value - массив стейтов игроков
        socket.on('data', (updates) => {
            const filteredPlayers: any[] = updates.filter(({value}) => playerFilter(value, filter))
            if (filteredPlayers.length > 0) {
                subject.emit('data', {value: filteredPlayers, id: socket.id});
            }
        });
        
        return subject;
    }
}


export function combineLatest(...subscriptions: Subject[]) {
    let state = {};
    const eventEmitter = new Subject({childSubscriptions: subscriptions});

    for (const subscription of subscriptions) {
        subscription.on('data', ({id, value}) => {
            state[id] = value;
            const newState = {...state};
            eventEmitter.emit('data', newState);
        });
    }

    return eventEmitter;
}
