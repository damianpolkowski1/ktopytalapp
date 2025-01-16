import {
  Controller,
  Post,
  Delete,
  Body,
  Get,
  ParseIntPipe,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('likeorunlike')
  async likeOrUnlikeATweet(@Body() body: { userId: number; tweetId: number }) {
    return await this.likesService.likeOrUnlikeATweet(
      body.userId,
      body.tweetId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('like')
  async likeATweet(@Body() body: { userId: number; tweetId: number }) {
    return await this.likesService.likeATweet(body.userId, body.tweetId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unlike')
  async unlikeATweet(@Body() body: { userId: number; tweetId: number }) {
    return await this.likesService.unlikeATweet(body.userId, body.tweetId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('likesCount/:tweetId')
  async countLikesForTweet(@Param('tweetId', ParseIntPipe) tweetId: number) {
    return await this.likesService.countLikesForTweet(tweetId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getLike/:userId/:tweetId')
  async getLike(
    @Param('userId') userId: number,
    @Param('tweetId') tweetId: number,
  ) {
    const like = await this.likesService.getLike(userId, tweetId);
    return like;
  }
}
