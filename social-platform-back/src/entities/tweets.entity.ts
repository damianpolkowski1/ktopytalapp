import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from './users.entity';

@Entity({ tableName: 'Tweets' })
export class Tweet {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User, { fieldName: 'userId', nullable: false })
  userId: User;

  @Property({ length: 4000, fieldName: 'Text' })
  text: string;

  @Property({ type: 'datetime', fieldName: 'CreatedAt' })
  createdAt: Date = new Date();

  @Property({
    type: 'int',
    default: 0,
    nullable: true,
    fieldName: 'ViewsCount',
  })
  viewsCount?: number;
}
