import { Entity, ManyToOne, Unique } from '@mikro-orm/core';
import { User } from './users.entity';
import { Tweet } from './tweets.entity';

@Entity({ tableName: 'Likes' })
@Unique({ properties: ['userId', 'tweetId'] })
export class Like {
  @ManyToOne({ entity: () => User, primary: true, fieldName: 'userId' })
  userId!: User;

  @ManyToOne({ entity: () => Tweet, primary: true, fieldName: 'tweetId' })
  tweetId!: Tweet;
}
