import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqController } from './rabbitmq.controller';

describe('RabbitmqController', () => {
  let controller: RabbitmqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RabbitmqController],
    }).compile();

    controller = module.get<RabbitmqController>(RabbitmqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
