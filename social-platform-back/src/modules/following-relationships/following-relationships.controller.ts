import { Controller, Param, Get, UseGuards, Put, Delete } from '@nestjs/common';
import { FollowingRelationshipsService } from './following-relationships.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('following-relationships')
export class FollowingRelationshipsController {
  constructor(
    private readonly followingRelationshipService: FollowingRelationshipsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('followed/:userId')
  async getFollowed(@Param('userId') userId: number) {
    return await this.followingRelationshipService.getFollowed(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('notFollowed/:userId')
  async getNotFollowed(@Param('userId') userId: number) {
    return await this.followingRelationshipService.getNotFollowed(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('checkIfFollowed/:userId/:followedId')
  async checkIfFollowed(
    @Param('userId') userId: number,
    @Param('followedId') followedId: number,
  ) {
    return await this.followingRelationshipService.checkIfFollowed(
      userId,
      followedId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('followUser/:followerId/:followedId')
  async followUser(
    @Param('followerId') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    return await this.followingRelationshipService.followUser(
      followerId,
      followedId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unfollowUser/:followerId/:followedId')
  async unfollowUser(
    @Param('followerId') followerId: number,
    @Param('followedId') followedId: number,
  ) {
    return await this.followingRelationshipService.unfollowUser(
      followerId,
      followedId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('countFollowers/:userId')
  async countFollowers(@Param('userId') userId: number) {
    return await this.followingRelationshipService.countFollowers(userId);
  }
}
