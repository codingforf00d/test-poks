import { SubscribeMessage, WebSocketGateway, ConnectedSocket } from "@nestjs/websockets";
import { Socket } from "net";
import { tableGenerator } from "./tables.generator";
import { range, random } from 'lodash';

@WebSocketGateway()
export class Gateway {
    @SubscribeMessage('subscribe')
    subscribeToTables(
      @ConnectedSocket() client: Socket,
    ) {
        const generator = tableGenerator();
        const initialState = createRandomStatesArray(generator);
        client.emit('data', initialState);
        const interval = setInterval(() => client.emit('data', createRandomStatesArray(generator)), 1000);
        client.on('close', interval.unref);
    }
}

const createRandomStatesArray = (generator: Generator) => range(0, random(1, 5)).map(() => generator.next());