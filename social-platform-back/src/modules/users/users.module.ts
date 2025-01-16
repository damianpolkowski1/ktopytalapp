import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities/users.entity';
import { UserProfile } from 'src/entities/userProfiles.entity';
import { ImagesModule } from '../images/images.module';
import { forwardRef } from '@nestjs/common';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    MikroOrmModule.forFeature([User, UserProfile]),
    forwardRef(() => ImagesModule),
  ],
})
export class UsersModule {}
