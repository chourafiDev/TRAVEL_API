import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(destinationId: number) {
    return await this.prisma.review.findMany({
      where: { destinationId },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async create(createReviewDto: CreateReviewDto, userId: number) {
    const { content, rating, destinationId } = createReviewDto;

    const destinations = await this.findAll(destinationId);

    // get review by userId and destinationId
    const userDestinationReviewd = destinations.find(
      (item) => item.userId === userId && item.destinationId === destinationId,
    );

    const isUserReviewd = destinations.some((item) => item.userId === userId);

    if (isUserReviewd) {
      await this.prisma.review.update({
        where: { id: userDestinationReviewd.id },
        data: {
          content,
          rating,
          destinationId,
          userId,
        },
      });

      return {
        statusCode: 200,
        message: 'Review Updated Successfull',
      };
    } else {
      await this.prisma.review.create({
        data: {
          content,
          rating,
          destinationId,
          userId,
        },
      });

      return {
        statusCode: 201,
        message: 'Review Created Successfull',
      };
    }
  }
}
