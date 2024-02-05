import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Favorite } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Favorite[] | undefined> {
    return await this.prisma.favorite.findMany({
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

  async findOne(id: number): Promise<Favorite | undefined> {
    const favorite = await this.prisma.favorite.findFirst({
      where: { id },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    } else {
      return favorite;
    }
  }

  async create(createFavoriteDto: CreateFavoriteDto, userId: number) {
    const { destinationId } = createFavoriteDto;

    await this.prisma.favorite.create({
      data: {
        destinationId,
        userId,
      },
    });

    return {
      statusCode: 201,
      message: 'Favorite Created Successfull',
    };
  }

  async remove(id: number) {
    // check if favorite exists
    await this.findOne(id);

    // Delete favorite
    await this.prisma.favorite.delete({ where: { id } });
    return {
      statusCode: 200,
      message: 'Favorite Deleted Successfull',
    };
  }
}
