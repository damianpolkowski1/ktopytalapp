import { Test, TestingModule } from '@nestjs/testing';
import { FollowingRelationshipsController } from './following-relationships.controller';

describe('FollowingRelationshipsController', () => {
  let controller: FollowingRelationshipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowingRelationshipsController],
    }).compile();

    controller = module.get<FollowingRelationshipsController>(FollowingRelationshipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
