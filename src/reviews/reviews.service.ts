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
    console.log('userId', userId);
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
