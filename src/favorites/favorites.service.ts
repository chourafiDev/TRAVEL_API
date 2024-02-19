import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Favorite } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number): Promise<Favorite[] | undefined> {
    return await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        destination: {
          include: {
            images: {
              select: {
                imageUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async favorite(createFavoriteDto: CreateFavoriteDto, userId: number) {
    const { destinationId } = createFavoriteDto;

    await this.prisma.favorite.create({
      data: {
        destinationId,
        userId,
      },
    });

    return {
      statusCode: 201,
      message: 'Destination Favorited Successfully',
    };
  }

  async unfavorite(id: number, userId: number) {
    // Delete favorite
    await this.prisma.favorite.delete({
      where: {
        userId_destinationId: {
          userId: userId,
          destinationId: id,
        },
      },
    });

    return {
      statusCode: 200,
      message: 'Destination Unfavorited Successfully',
    };
  }
}
