import {
  Injectable,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class ImagesService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async updateProfilePicture(userId: number, profilePictureId: string) {
    try {
      await this.usersService.updateUser(userId, {
        profilePictureId: profilePictureId,
      });

      await this.cleanUnusedProfilePictures();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update profile picture.',
      );
    }
  }

  async cleanUnusedProfilePictures() {
    try {
      const profilePictureIds =
        await this.usersService.getUniqueProfilePictureIds();

      const uploadsDir = path.join(__dirname, '../../..', 'uploads');
      const uploads = await fs.readdir(uploadsDir);

      const unusedFiles = uploads.filter(
        (file) => !profilePictureIds.includes(file),
      );

      await Promise.all(
        unusedFiles.map((file) =>
          fs.unlink(path.join(uploadsDir, file)).catch((err) => {
            console.error(`Failed to delete unused profile picture: ${file}`);
          }),
        ),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to clean unused profile pictures.',
      );
    }
  }
}
