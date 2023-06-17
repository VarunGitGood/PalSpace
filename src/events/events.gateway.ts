import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/utils/types';

const PORT = parseInt(process.env.WS_PORT);

@WebSocketGateway(PORT, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
  namespace: 'events',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService: AuthService) {}
  @WebSocketServer() Server;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types

  // DISCUSS: is this the best way to store the connected users?
  public connectedUsers: Map<string, string> = new Map<string, string>();

  public getConnectedUsers() {
    return this.connectedUsers;
  }

  async handleConnection(client) {
    const token = client.handshake.query.token;
    const user: User = await this.authService.verifyWsConnection(token);
    if (!user) {
      throw new WsException('Invalid token');
    }
    this.connectedUsers.set(user.username, client.id);
    this.Server.emit('users_count', this.connectedUsers.size);
  }

  async handleDisconnect(client) {
    const token = client.handshake.query.token;
    const user: User = await this.authService.verifyWsConnection(token);
    if (!user) {
      throw new WsException('Invalid token');
    }
    this.connectedUsers.delete(user.username);
    this.Server.emit('users_count', this.connectedUsers.size);
  }

  @SubscribeMessage('message')
  async onMessage(client, message) {
    client.broadcast.emit('message', message);
  }
}
