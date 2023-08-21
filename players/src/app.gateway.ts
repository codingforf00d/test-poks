import { SubscribeMessage, WebSocketGateway, ConnectedSocket } from "@nestjs/websockets";
import { Socket } from "net";
import { playersGenerator } from "./players.generator";


@WebSocketGateway()
export class Gateway {

    @SubscribeMessage('players')
    subscribeToPlayers(
      @ConnectedSocket() client: Socket,
    ) {
        const generator = playersGenerator();
        setInterval(() => client.emit('data', generator.next()), 1000);
    }
}