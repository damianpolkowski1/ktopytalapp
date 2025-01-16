import { Module } from '@nestjs/common';
import { FollowingRelationshipsService } from './following-relationships.service';
import { FollowingRelationshipsController } from './following-relationships.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities/users.entity';
import { FollowingRelationship } from 'src/entities/followingRelationships.entity';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
  providers: [FollowingRelationshipsService],
  controllers: [FollowingRelationshipsController],
  imports: [
    MikroOrmModule.forFeature({ entities: [User, FollowingRelationship] }),
    UsersModule,
    MailModule,
  ],
})
export class FollowingRelationshipsModule {}
