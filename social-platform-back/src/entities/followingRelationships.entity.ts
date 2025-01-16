import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
} from '@mikro-orm/core';
import { User } from './users.entity';

@Entity({ tableName: 'FollowingRelationships' })
@Unique({ properties: ['userId', 'followedUserId'] })
export class FollowingRelationship {
  @ManyToOne(() => User, { primary: true, fieldName: 'userId' })
  userId: User;

  @ManyToOne(() => User, { primary: true, fieldName: 'followedUserId' })
  followedUserId: User;

  @Property({
    type: 'datetime',
    defaultRaw: 'CURRENT_TIMESTAMP',
    fieldName: 'followedAt',
  })
  followedAt: Date = new Date();
}
