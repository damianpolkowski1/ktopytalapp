import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'Users' })
export class User {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  nickname: string;

  @Property({ unique: true })
  email: string;

  @Property()
  password: string;

  @Property({ type: 'datetime', fieldName: 'userSince' })
  userSince: Date = new Date();

  @Property({ type: 'tinyint', default: 0, fieldName: 'IsVerified' })
  IsVerified: number;

  @Property({ nullable: true, fieldName: 'profilePictureId' })
  profilePictureId: string | null;
}
