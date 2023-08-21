import { SubscribeMessage, WebSocketGateway, ConnectedSocket } from "@nestjs/websockets";
import { Socket } from "net";
import { tableGenerator } from "./tables.generator";


@WebSocketGateway()
export class Gateway {
    @SubscribeMessage('tables')
    subscribeToTables(
      @ConnectedSocket() client: Socket,
    ) {
        const generator = tableGenerator();
        setInterval(() => client.emit('data', generator.next()), 1000);
    }
}