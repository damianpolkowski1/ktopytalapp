import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FollowingRelationship } from 'src/entities/followingRelationships.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { MailService } from '../mail/mail.service';

@Injectable()
export class FollowingRelationshipsService {
  constructor(
    @InjectRepository(FollowingRelationship)
    private readonly followingRepository: EntityRepository<FollowingRelationship>,

    private readonly em: EntityManager,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async getFollowed(userId: number): Promise<number[]> {
    try {
      const followedUsers = await this.em
        .getConnection()
        .execute(
          'SELECT followedUserId FROM FollowingRelationships WHERE userId = ?',
          [userId],
        );

      return followedUsers.map(
        (row: { followedUserId: number }) => row.followedUserId,
      );
    } catch (error) {
      throw new Error(
        `Błąd podczas pobierania obserwowanych użytkowników: ${error.message}`,
      );
    }
  }

  async getNotFollowed(userId: number): Promise<number[]> {
    try {
      const allUserIds = (await this.usersService.getAllUserIds()).map(
        (user: { id: number }) => Number(user.id),
      );

      if (!allUserIds.includes(Number(userId))) {
        throw new Error(`Użytkownik o id ${userId} nie istnieje.`);
      }

      const followedUserIds = await this.getFollowed(userId);

      const notFollowedUserIds = allUserIds.filter(
        (id) => id != userId && !followedUserIds.includes(id),
      );

      return notFollowedUserIds;
    } catch (error) {
      throw new Error(
        `Błąd podczas pobierania nieobserwowanych użytkowników: ${error.message}`,
      );
    }
  }

  async followUser(
    followerId: number,
    followedId: number,
  ): Promise<FollowingRelationship> {
    const follower = await this.usersService.getUser(followerId);
    const followed = await this.usersService.getUser(followedId);

    if (!follower || !followed) {
      throw new Error('Użytkownik nie istnieje');
    }

    const existingRelationship = await this.followingRepository.findOne({
      userId: followerId,
      followedUserId: followedId,
    });

    if (existingRelationship) {
      throw new Error('Ta relacja obserwowania już istnieje');
    }

    const newRelationship = this.followingRepository.create({
      userId: followerId,
      followedUserId: followedId,
    });

    this.em.persist(newRelationship);
    await this.em.flush();

    const userProfile = await this.usersService.getUserProfile(followedId);
    if (userProfile.emailNotificationsEnabled) {
      this.mailService
        .sendFollowNotificationEmail(
          followed.nickname,
          follower.nickname,
          `http://localhost:6565/profile/${follower.id}`, // Link do profilu obserwatora
          followed.email,
        )
        .catch((error) => {
          console.error('Błąd wysyłania emaila:', error);
        });
    }
    return newRelationship;
  }

  async unfollowUser(followerId: number, followedId: number): Promise<void> {
    const follower = await this.usersService.getUser(followerId);
    const followed = await this.usersService.getUser(followedId);

    if (!follower || !followed) {
      throw new Error('Użytkownik nie istnieje');
    }

    const existingRelationship = await this.followingRepository.findOne({
      userId: followerId,
      followedUserId: followedId,
    });

    if (!existingRelationship) {
      throw new Error('Ta relacja obserwowania nie istnieje');
    }

    await this.em.remove(existingRelationship);
    await this.em.flush();
  }

  async checkIfFollowed(userId: number, followedId: number): Promise<boolean> {
    const existingRelationship = await this.followingRepository.findOne({
      userId: userId,
      followedUserId: followedId,
    });

    return !!existingRelationship;
  }

  async countFollowers(userId: number): Promise<number> {
    const followers = await this.followingRepository.count({
      followedUserId: userId,
    });
    return followers;
  }
}
