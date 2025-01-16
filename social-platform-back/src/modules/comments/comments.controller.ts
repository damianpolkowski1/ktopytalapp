import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async createComment(
    @Body() body: { userId: number; tweetId: number; text: string },
  ) {
    return await this.commentsService.createComment(
      body.userId,
      body.tweetId,
      body.text,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:commentId')
  async deleteComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return await this.commentsService.deleteComment(commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('commentsForPost/:tweetId')
  async getCommentsForPost(@Param('tweetId', ParseIntPipe) tweetId: number) {
    return await this.commentsService.getCommentsForPost(tweetId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('numberOfCommentsForPost/:tweetId')
  async getNumberOfCommentsForPost(
    @Param('tweetId', ParseIntPipe) tweetId: number,
  ) {
    return (await this.commentsService.getCommentsForPost(tweetId)).length;
  }
}
