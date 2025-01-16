import { Test, TestingModule } from '@nestjs/testing';
import { FollowingRelationshipsService } from './following-relationships.service';

describe('FollowingRelationshipsService', () => {
  let service: FollowingRelationshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowingRelationshipsService],
    }).compile();

    service = module.get<FollowingRelationshipsService>(FollowingRelationshipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
