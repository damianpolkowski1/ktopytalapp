import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { UsersModule } from './modules/users/users.module';
import { ImagesModule } from './modules/images/images.module';
import { CorsMiddleware } from './main';
import { AuthModule } from './modules/auth/auth.module';
import { FollowingRelationshipsModule } from './modules/following-relationships/following-relationships.module';
import { TweetsModule } from './modules/tweets/tweets.module';
import { LikesModule } from './modules/likes/likes.module';
import { CommentsModule } from './modules/comments/comments.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    UsersModule,
    ImagesModule,
    AuthModule,
    FollowingRelationshipsModule,
    TweetsModule,
    LikesModule,
    CommentsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
} 
