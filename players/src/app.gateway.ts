import { SubscribeMessage, WebSocketGateway, ConnectedSocket } from "@nestjs/websockets";
import { Socket } from "net";
import { playersGenerator } from "./players.generator";


@WebSocketGateway()
export class Gateway {

    @SubscribeMessage('subscribe')
    subscribeToPlayers(
      @ConnectedSocket() client: Socket,
    ) {
        const generator = playersGenerator();
        const emitter = setInterval(() => client.emit('data', generator.next()), 1000);
        client.on('close', emitter.unref);
    }
}