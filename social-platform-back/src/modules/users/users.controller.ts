import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from 'src/dto/update-profile.dto';
import { User } from 'src/entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('one/:id')
  async getUser(@Param('id') id: number) {
    return await this.usersService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-by-ids')
  async getUsersByIds(@Body('ids') userIds: number[]) {
    return await this.usersService.getUsersByIds(userIds);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-profile/:id')
  async getUserProfile(@Param('id') id: number) {
    return await this.usersService.getUserProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('updateProfile/:userId')
  async updateProfile(
    @Param('userId') userId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.usersService.updateUserProfile(userId, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteAccount/:id')
  async deleteAccount(@Param('id') userId: number) {
    return await this.usersService.deleteAccount(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchUsers(@Query('q') q: string): Promise<User[]> {
    return this.usersService.searchUsers(q);
  }
}
