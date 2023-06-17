import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  constructor(@Inject('RABBIT_SERVICE') private readonly client: ClientProxy) {}
  public send(pattern: string, data: any) {
    return this.client.send(pattern, data).toPromise();
  }
}
