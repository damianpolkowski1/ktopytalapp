import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from './users.entity';
import { Tweet } from './tweets.entity';

@Entity({ tableName: 'Comments' })
export class Comment {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User, { fieldName: 'userId', nullable: false })
  userId: User;

  @ManyToOne(() => Tweet, { fieldName: 'TweetId', nullable: false })
  tweetId: Tweet;

  @Property({ length: 2000, fieldName: 'Text' })
  text: string;

  @Property({ type: 'datetime', fieldName: 'CreatedAt' })
  createdAt: Date = new Date();
}
