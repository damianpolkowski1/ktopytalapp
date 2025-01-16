import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Comment } from 'src/entities/comments.entity';
import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mysql';
import { UsersService } from '../users/users.service';
import { TweetsService } from '../tweets/tweets.service';
import { User } from 'src/entities/users.entity';
import { Tweet } from 'src/entities/tweets.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: EntityRepository<Comment>,

    private readonly em: EntityManager,
    private readonly tweetsService: TweetsService,
    private readonly usersService: UsersService,
  ) {}

  async createComment(userId: number, tweetId: number, text: string) {
    const newComment = this.commentsRepository.create({
      userId: userId,
      tweetId: tweetId,
      text: text,
    });

    if (newComment.text.length > 2000) {
      throw new Error('Treść komentarza jest zbyt długa');
    }

    const allUserIds = (await this.usersService.getAllUserIds()).map(
      (user: { id: number }) => Number(user.id),
    );

    const allTweetIds = (await this.tweetsService.getAllTweetIds()).map(
      (tweet: { id: number }) => Number(tweet.id),
    );

    if (!allUserIds.includes(Number(userId))) {
      throw new Error(`Użytkownik o id ${userId} nie istnieje.`);
    }

    if (!allTweetIds.includes(Number(tweetId))) {
      throw new Error(`Post o id ${tweetId} nie istnieje.`);
    }

    this.em.persist(newComment);
    await this.em.flush();

    return newComment;
  }

  async deleteComment(commentId: number) {
    const comment = await this.commentsRepository.findOne({ id: commentId });
    if (!comment) {
      throw new Error('Nie znaleziono komentarza o podanym id');
    }

    await this.em.remove(comment);
    await this.em.flush();

    return comment;
  }

  async getCommentsForPost(tweetId: number): Promise<Comment[]> {
    if (!tweetId) {
      return [];
    }

    return this.commentsRepository.find(
      { tweetId: tweetId },
      { orderBy: { createdAt: 'DESC' } },
    );
  }
}
