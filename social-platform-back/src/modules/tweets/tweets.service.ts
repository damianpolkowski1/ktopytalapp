import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Tweet } from 'src/entities/tweets.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/mysql';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet)
    private readonly tweetRepository: EntityRepository<Tweet>,

    private readonly em: EntityManager,
  ) {}

  async createTweet(userId: number, text: string) {
    const newTweet = this.tweetRepository.create({
      userId: userId,
      text: text,
    });

    if (newTweet.text.length > 4000) {
      throw new Error('Treść posta jest zbyt długa');
    }

    this.em.persist(newTweet);
    await this.em.flush();

    return newTweet;
  }

  async deleteTweet(postId: number) {
    const tweet = await this.tweetRepository.findOne({ id: postId });
    if (!tweet) {
      throw new Error('Nie znaleziono posta o podanym id');
    }

    await this.em.remove(tweet);
    await this.em.flush();
    return tweet;
  }

  async getTweetsByUserIds(userIds: number[]): Promise<Tweet[]> {
    if (!userIds || userIds.length === 0) {
      return [];
    }

    const tweets = await this.tweetRepository.find(
      { userId: { $in: userIds } },
      { orderBy: { createdAt: 'DESC' } },
    );

    // adding views to the tweets
    tweets.forEach((tweet) => {
      tweet.viewsCount += 1;
    });

    await this.em.persist(tweets);
    await this.em.flush();

    return tweets;
  }

  async getTweet(tweetId: number): Promise<Tweet> {
    const tweet = await this.tweetRepository.findOne({ id: tweetId });

    if (!tweet) {
      throw new Error('Tweet not found');
    }

    return tweet;
  }

  async getAllTweetIds() {
    return await this.tweetRepository.findAll({ fields: ['id'] });
  }
}
