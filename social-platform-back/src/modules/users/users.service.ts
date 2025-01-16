import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { UserProfile } from 'src/entities/userProfiles.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { UpdateProfileDto } from 'src/dto/update-profile.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { ImagesService } from '../images/images.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: EntityRepository<UserProfile>,

    private readonly em: EntityManager,
    private readonly imagesService: ImagesService,
  ) {}

  async getAllUsers() {
    return await this.usersRepository.findAll({
      fields: [
        'id',
        'nickname',
        'email',
        'userSince',
        'IsVerified',
        'profilePictureId',
      ],
    });
  }

  async getUser(id: number) {
    return await this.usersRepository.findOne(
      { id: id },
      {
        fields: [
          'id',
          'nickname',
          'email',
          'userSince',
          'IsVerified',
          'profilePictureId',
        ],
      },
    );
  }

  async getUserProfile(id: number) {
    return await this.userProfileRepository.findOne({ userId: id });
  }

  async getAllUserIds() {
    return await this.usersRepository.findAll({ fields: ['id'] });
  }

  async getUsersByIds(userIds: number[]) {
    if (!userIds || userIds.length === 0) {
      throw new Error('Lista identyfikatorów użytkowników jest pusta.');
    }

    return await this.usersRepository.find(
      { id: { $in: userIds } },
      {
        fields: [
          'id',
          'nickname',
          'email',
          'userSince',
          'IsVerified',
          'profilePictureId',
        ],
      },
    );
  }

  async createUser(nickname: string, email: string, password: string) {
    const newUser = this.usersRepository.create({
      nickname: nickname,
      email: email,
      password: password,
    });

    this.em.persist(newUser);
    await this.em.flush();

    const newUserProfile = this.userProfileRepository.create({
      userId: newUser.id,
      description: null,
      location: null,
      birthdate: null,
    });

    this.em.persist(newUserProfile);
    await this.em.flush();

    return newUser;
  }

  async updateUser(userId: number, payload: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ id: userId });

    if (!user) {
      throw new Error('Nie znaleziono użytkownika');
    }

    if (payload.nickname !== undefined) {
      user.nickname = payload.nickname;
    }
    if (payload.email !== undefined) {
      user.email = payload.email;
    }
    if (payload.IsVerified !== undefined) {
      user.IsVerified = payload.IsVerified;
    }
    if (payload.profilePictureId !== undefined) {
      user.profilePictureId = payload.profilePictureId;
    }

    await this.em.persist(user);
    await this.em.flush();

    return user;
  }

  async updateUserProfile(
    userId: number,
    payload: UpdateProfileDto,
  ): Promise<UserProfile> {
    const userProfile = await this.userProfileRepository.findOne({ userId });

    if (!userProfile) {
      throw new Error('Nie znaleziono profilu użytkownika');
    }

    if (payload.description !== undefined) {
      userProfile.description = payload.description;
    }
    if (payload.location !== undefined) {
      userProfile.location = payload.location;
    }
    if (payload.birthdate !== undefined) {
      userProfile.birthdate = payload.birthdate;
    }
    if (payload.emailNotificationsEnabled !== undefined) {
      userProfile.emailNotificationsEnabled = payload.emailNotificationsEnabled;
    }

    await this.em.persist(userProfile);
    await this.em.flush();

    return userProfile;
  }
  async verifyUser(userId: number): Promise<void> {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    user.IsVerified = 1;
    await this.em.persist(user);
    await this.em.flush();
  }

  async getUniqueProfilePictureIds(): Promise<string[]> {
    const usersWithProfilePicture = await this.usersRepository.find(
      { profilePictureId: { $ne: null } },
      { fields: ['profilePictureId'] },
    );

    return usersWithProfilePicture.map((user) => user.profilePictureId);
  }

  async deleteAccount(userId: number) {
    try {
      const result = await this.em.nativeDelete(User, { id: userId });
      if (result === 0) {
        throw new Error('Failed to delete user account: User not found');
      }
      await this.imagesService.cleanUnusedProfilePictures();
    } catch (error) {
      throw new Error(`Failed to delete user account: ${error.message}`);
    }
  }

  async searchUsers(q: string): Promise<User[]> {
    if (!q) {
      return [];
    }

    const users = await this.em.find(
      User,
      { nickname: { $like: `%${q}%` } },
      { limit: 10 },
    );
    return users;
  }
}
