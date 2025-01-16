import { Entity, Property, OneToOne } from '@mikro-orm/core';
import { User } from './users.entity';

@Entity({ tableName: 'UserProfiles' })
export class UserProfile {
  @OneToOne(() => User, { fieldName: 'userId', primary: true, nullable: false })
  userId: User;

  @Property({ length: 5000, nullable: true })
  description?: string;

  @Property({ length: 100, nullable: true })
  location?: string;

  @Property({ type: 'date', nullable: true })
  birthdate?: Date;

  @Property({
    fieldName: 'emailNotificationsEnabled',
    type: 'tinyint',
    default: 1,
  })
  emailNotificationsEnabled: number;
}
