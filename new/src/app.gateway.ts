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
        @MessageBody() body: MsgBody,
        @ConnectedSocket() client: Socket,
    ){
        const hasTableFilter = 'tableFilter' in body;
        const hasPlayerFilter = 'playerFilter' in body;
        let subscription: EventEmitter;

        if (hasTableFilter && hasPlayerFilter) {
            const tableSubscription = this.dataProvider.subscribeToTables(body.tableFilter);
            const playerSubscription = this.dataProvider.subscribeToPlayers(body.playerFilter);
            subscription = combineLatest(tableSubscription, playerSubscription);
        }
        else if (hasTableFilter) {
            subscription = this.dataProvider.subscribeToTables(body.tableFilter);
        }
        else if (hasPlayerFilter) {
            subscription = this.dataProvider.subscribeToPlayers(body.playerFilter);
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

    private clearSubscription(clientId: string) {
        const subscription = this.subscriptions.get(clientId);
        if (subscription) {
            subscription.removeAllListeners();
        }
    }
}