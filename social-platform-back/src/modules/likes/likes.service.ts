import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Like } from 'src/entities/likes.entity';
import { User } from 'src/entities/users.entity';
import { Tweet } from 'src/entities/tweets.entity';
import { TweetsService } from '../tweets/tweets.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: EntityRepository<Like>,

    private readonly em: EntityManager,
    private readonly tweetsService: TweetsService,
  ) {}

  async likeOrUnlikeATweet(userId: number, tweetId: number): Promise<number> {
    const tweet = await this.tweetsService.getTweet(tweetId);
    if (!tweet) {
      throw new Error('Tweet not found');
    }

    const existingLike = await this.em.findOne(Like, { userId, tweetId });

    if (existingLike) {
      return await this.unlikeATweet(userId, tweetId);
    } else {
      return await this.likeATweet(userId, tweetId);
    }
  }

  async likeATweet(userId: number, tweetId: number): Promise<number> {
    const tweet = await this.tweetsService.getTweet(tweetId);
    if (!tweet) {
      throw new Error('Tweet not found');
    }

    const like = new Like();
    like.userId = this.em.getReference(User, userId);
    like.tweetId = this.em.getReference(Tweet, tweetId);
    await this.em.persistAndFlush(like);

    return await this.countLikesForTweet(tweetId);
  }

  async unlikeATweet(userId: number, tweetId: number): Promise<number> {
    const tweet = await this.tweetsService.getTweet(tweetId);
    if (!tweet) {
      throw new Error('Tweet not found');
    }

    const like = await this.em.findOne(Like, { userId, tweetId });
    if (!like) {
      throw new Error('Like not found');
    }

    await this.em.removeAndFlush(like);

    return await this.countLikesForTweet(tweetId);
  }

  async countLikesForTweet(tweetId: number): Promise<number> {
    const tweet = await this.tweetsService.getTweet(tweetId);
    if (!tweet) {
      throw new Error('Tweet not found');
    }

    const likeCount = await this.em.count(Like, { tweetId });

    return likeCount;
  }

  async getLike(userId: number, tweetId: number): Promise<Like | null> {
    const like = await this.em.findOne(Like, { userId, tweetId });

    return like || null;
  }
}
