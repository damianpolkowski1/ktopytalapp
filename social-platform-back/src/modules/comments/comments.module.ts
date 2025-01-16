import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Comment } from 'src/entities/comments.entity';
import { User } from 'src/entities/users.entity';
import { Tweet } from 'src/entities/tweets.entity';
import { TweetsModule } from '../tweets/tweets.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [
    MikroOrmModule.forFeature({ entities: [Comment, User, Tweet] }),
    TweetsModule,
    UsersModule,
  ],
})
export class CommentsModule {}
