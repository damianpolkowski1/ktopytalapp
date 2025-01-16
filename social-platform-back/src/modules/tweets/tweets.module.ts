import { Module } from '@nestjs/common';
import { TweetsController } from './tweets.controller';
import { TweetsService } from './tweets.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Tweet } from 'src/entities/tweets.entity';

@Module({
  controllers: [TweetsController],
  providers: [TweetsService],
  imports: [MikroOrmModule.forFeature({ entities: [Tweet] })],
  exports: [TweetsService],
})
export class TweetsModule {}
