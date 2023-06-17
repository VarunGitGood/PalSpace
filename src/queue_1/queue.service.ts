import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { EventsGateway } from 'src/events/events.gateway';
import { RedisDbService } from 'src/redis-db/redis-db.service';

@Injectable()
export class QueueService {
  constructor(private redis: RedisDbService, private events: EventsGateway) {}

  async matchUsers() {
    // get the users from the queue
    const users = await this.redis.popUsers();
    // get the clientIDs of the users
    const clientIDs = users.map(
      (user) => this.events.getConnectedUsers()[user],
    );
    // send the clientIDs to the users
    return [clientIDs[0], clientIDs[1]];
  }

  async joinQueue(req: Request) {
    const username = req.user['username'];
    const clientID: string = this.events.getConnectedUsers()[username];
    // now we have the clientID, we can add it to the queue
    await this.redis.addUserToQueue(clientID);
    // now we can check if there is a match
    const result = await this.matchUsers();
    if (result.length === 2) {
      // send the result to the users
    } else {
      // send the user that they are in the queue
    }
  }
}
