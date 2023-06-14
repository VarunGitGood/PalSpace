import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';

const PORT = parseInt(process.env.WS_PORT);

@WebSocketGateway(PORT, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() Server;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  users: number = 0;

  async handleConnection() {
    this.users++;
    this.Server.emit('users_count', this.users);
  }

  async handleDisconnect() {
    this.users--;
    this.Server.emit('users_count', this.users);
  }

  @SubscribeMessage('message')
  async onMessage(client, message) {
    client.broadcast.emit('message', message);
  }
}
