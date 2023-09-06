import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { DataProvider, combineLatest } from "./data.provider";
import { PlayerFilter, TableFilter } from "./filter.engine";
import { Socket } from "socket.io-client";
import { EventEmitter } from "stream";
import { Subject } from "./data.provider";


type MsgBody = {
    tableFilter?: TableFilter;
    playerFilter?: PlayerFilter;
}


@WebSocketGateway()
export class Gateway {
    private dataProvider = new DataProvider();
    private subscriptions: WeakMap<Socket, Subject> = new Map();

    @SubscribeMessage('subscribe')
    subscribeToData(
        @MessageBody() body: string,
        @ConnectedSocket() client: Socket,
    ){
        const data: MsgBody = JSON.parse(body);
        const hasTableFilter = 'tableFilter' in data;
        const hasPlayerFilter = 'playerFilter' in data;
        let subscription: Subject;

        if (hasTableFilter && hasPlayerFilter) {
            const tableSubscription = this.dataProvider.subscribeToTables(data.tableFilter);
            const playerSubscription = this.dataProvider.subscribeToPlayers(data.playerFilter);
            subscription = combineLatest(tableSubscription, playerSubscription);
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

        this.clearSubscription(client);

        const newSubscription = subscription.on('data', (data) => client.emit('data', data));
        this.subscriptions.set(client, newSubscription);
    }

    @SubscribeMessage('unsubscribe')
    unsubscribe(
        @ConnectedSocket() client: Socket,
    ) {
        this.clearSubscription(client);
    }

    private clearSubscription(client: Socket) {
        const subscription = this.subscriptions.get(client);
        if (subscription) {
            subscription.clearSubscription();
        }
    }
}