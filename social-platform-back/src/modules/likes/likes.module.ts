import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Tweet } from 'src/entities/tweets.entity';
import { Like } from 'src/entities/likes.entity';
import { TweetsModule } from '../tweets/tweets.module';

@Module({
  providers: [LikesService],
  controllers: [LikesController],
  imports: [
    MikroOrmModule.forFeature({ entities: [Tweet, Like] }),
    TweetsModule,
  ],
})
export class LikesModule {}
