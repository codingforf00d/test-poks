import { SubscribeMessage, WebSocketGateway, ConnectedSocket } from "@nestjs/websockets";
import { Socket } from "net";
import { playersGenerator } from "./players.generator";
import { range, random } from 'lodash';

@WebSocketGateway()
export class Gateway {

    @SubscribeMessage('subscribe')
    subscribeToPlayers(
      @ConnectedSocket() client: Socket,
    ) {
        const generator = playersGenerator();
        const inittialState = createRandomStatesArray(generator);
        client.emit('data', inittialState)
        const interval = setInterval(() => client.emit('data', createRandomStatesArray(generator)), 1000);
        client.on('close', interval.unref);
    }
}

const createRandomStatesArray = (generator: Generator) => range(0, random(1, 5)).map(() => generator.next());