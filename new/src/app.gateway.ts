import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { DataProvider, combineLatest } from "./data.provider";
import { PlayerFilter, TableFilter } from "./filter.engine";
import { Socket } from "socket.io-client";
import { EventEmitter } from "stream";


type MsgBody = {
    tableFilter?: TableFilter;
    playerFilter?: PlayerFilter;
}


@WebSocketGateway()
export class Gateway {
    private dataProvider = new DataProvider();
    private subscriptions: Map<string, EventEmitter> = new Map();

    @SubscribeMessage('subscribe')
    subscribeToData(
        @MessageBody() body: string,
        @ConnectedSocket() client: Socket,
    ){
        const data: MsgBody = JSON.parse(body);
        const hasTableFilter = 'tableFilter' in data;
        const hasPlayerFilter = 'playerFilter' in data;
        let subscription: EventEmitter;

        if (hasTableFilter && hasPlayerFilter) {
            const tableSubscription = this.dataProvider.subscribeToTables(data.tableFilter);
            const playerSubscription = this.dataProvider.subscribeToPlayers(data.playerFilter);
            const [subscription, stopSubscription] = combineLatest(tableSubscription, playerSubscription);
        }
        else if (hasTableFilter) {
            subscription = this.dataProvider.subscribeToTables(data.tableFilter);
        }
        else if (hasPlayerFilter) {
            subscription = this.dataProvider.subscribeToPlayers(data.playerFilter);
        }
        else if (!hasPlayerFilter && !hasTableFilter) {
            return;
        }

        this.clearSubscription(client.id);

        const newSubscription = subscription.on('data', (data) => client.emit('data', data));
        this.subscriptions.set(client.id, newSubscription);
    }

    @SubscribeMessage('unsubscribe')
    unsubscribe(
        @ConnectedSocket() client: Socket,
    ) {
        this.clearSubscription(client.id);
    }

    private createSubscription(data: MsgBody) {
        const hasTableFilter = 'tableFilter' in data;
        const hasPlayerFilter = 'playerFilter' in data;
        let subscription: EventEmitter;

        if (hasTableFilter && hasPlayerFilter) {
            const tableSubscription = this.dataProvider.subscribeToTables(data.tableFilter);
            const playerSubscription = this.dataProvider.subscribeToPlayers(data.playerFilter);
            const [subscription, stopSubscription] = combineLatest(tableSubscription, playerSubscription);
        }
        else if (hasTableFilter) {
            subscription = this.dataProvider.subscribeToTables(data.tableFilter);
        }
        else if (hasPlayerFilter) {
            subscription = this.dataProvider.subscribeToPlayers(data.playerFilter);
        }
        else if (!hasPlayerFilter && !hasTableFilter) {
            return;
        }
    }

    private clearSubscription(clientId: string, stopChildSubscriptions?: () => void) {
        const subscription = this.subscriptions.get(clientId);
        if (subscription) {
            if (stopChildSubscriptions) {
                stopChildSubscriptions();
            }
            subscription.removeAllListeners();
        }
    }
}