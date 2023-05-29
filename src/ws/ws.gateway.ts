import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway(4000, { namespace: 'ws' })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  public users = 0;

  handleConnection() {
    this.users++;
  }

  handleDisconnect() {
    this.users--;
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
