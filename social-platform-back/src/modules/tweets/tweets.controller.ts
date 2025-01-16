import {
  Controller,
  UseGuards,
  Post,
  Get,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createTweet(@Body() body: { userId: number; text: string }) {
    return await this.tweetsService.createTweet(body.userId, body.text);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:postId')
  async deleteTweet(@Param('postId', ParseIntPipe) postId: number) {
    return await this.tweetsService.deleteTweet(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bymultipleids')
  async getTweetsByUserIds(@Body() body: { userIds: number[] }) {
    return await this.tweetsService.getTweetsByUserIds(body.userIds);
  }
}
