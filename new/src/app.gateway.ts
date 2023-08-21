import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";



type SubscriptionFilter = {
    freeTable: boolean;
    occupiedTable: boolean;
    
}


@WebSocketGateway()
export class Gateway {


    @SubscribeMessage('data')
    onData(
        @MessageBody() body
    ){
        console.log(body)
    }

    @SubscribeMessage('filter')
    applyFilter(
        @MessageBody() body
    ){
        console.log(body)
    }
}