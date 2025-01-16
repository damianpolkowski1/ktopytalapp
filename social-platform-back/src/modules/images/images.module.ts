import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { UsersModule } from '../users/users.module';
import { forwardRef } from '@nestjs/common';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
  imports: [forwardRef(() => UsersModule)],
})
export class ImagesModule {}
