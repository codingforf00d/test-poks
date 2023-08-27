import { SubscribeMessage, WebSocketGateway, ConnectedSocket } from "@nestjs/websockets";
import { Socket } from "net";
import { tableGenerator } from "./tables.generator";


@WebSocketGateway()
export class Gateway {
    @SubscribeMessage('subscribe')
    subscribeToTables(
      @ConnectedSocket() client: Socket,
    ) {
        const generator = tableGenerator();
        const emitter = setInterval(() => client.emit('data', generator.next()), 1000);
        client.on('close', emitter.unref);
    }
}