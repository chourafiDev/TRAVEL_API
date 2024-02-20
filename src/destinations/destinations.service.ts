import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Destination } from '../utils/types';
import { DestinationsFiletrDto } from './dto/destinations-filter.dto';
import { Prisma } from '@prisma/client';

interface Root {
  price: Price;
}

interface Price {
  gte: number;
  lte: number;
}

@Injectable()
export class DestinationsService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  //Delete previous images
  async deletePreviousImages(
    publicIdsToDelete: string[],
    destinationId: number,
  ): Promise<void> {
    // Delete destination images from Cloudinary
    for (let i = 0; i < publicIdsToDelete.length; i++) {
      const imagePublicId = publicIdsToDelete[i];

      await this.cloudinaryService.destroyImage(imagePublicId);
    }

    // Delete destination images from DB
    await this.prisma.destinationImages.deleteMany({
      where: { destinationId },
    });
  }

  // Get all destinations
  async findAll(): Promise<Destination[] | undefined> {
    return await this.prisma.destination.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        images: {
          select: {
            imageUrl: true,
          },
        },
        category: {
          select: {
            content: true,
          },
        },
      },
    });
  }

  // Get all destinations by filters
  async findAllWithFilters(
    filterDto: DestinationsFiletrDto,
  ): Promise<Destination[] | undefined> {
    const { search, minPrice, maxPrice, duration, category, destination } =
      filterDto;

    let fullQuery: Prisma.DestinationWhereInput[] = [];

    // search by keyword
    if (search) {
      fullQuery.push({
        OR: [
          {
            title: {
              search: search,
            },
          },
          {
            description: {
              search: search,
            },
          },
        ],
      });
    }

    // search by destination
    if (destination) {
      fullQuery.push({
        destination: {
          search: destination,
        },
      });
    }

    // search by duration
    if (duration) {
      fullQuery.push({
        duration: { equals: duration },
      });
    }

    // search by category
    if (category) {
      fullQuery.push({
        category: {
          content: { search: category },
        },
      });
    }

    // search by price
    if (minPrice || maxPrice) {
      const priceQuery: any = {};

      if (minPrice) {
        priceQuery.price = { gte: Number(minPrice) };
      }
      if (maxPrice) {
        priceQuery.price = { ...priceQuery.price, lte: Number(maxPrice) };
      }

      fullQuery.push(priceQuery);
    }

    return await this.prisma.destination.findMany({
      where: {
        AND: fullQuery,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        images: {
          select: {
            imageUrl: true,
          },
        },
        category: {
          select: {
            content: true,
          },
        },
      },
    });
  }

  // Get top destinations
  async findTop(): Promise<Destination[] | undefined> {
    return await this.prisma.destination.findMany({
      take: 10,
      include: {
        images: {
          select: {
            imageUrl: true,
          },
        },
        category: {
          select: {
            content: true,
          },
        },
      },
    });
  }

  // Get destination
  async findOne(id: number): Promise<Destination | undefined> {
    const destination = await this.prisma.destination.findFirst({
      where: { id },
      include: {
        images: {
          select: {
            imageUrl: true,
            imagePublicId: true,
          },
        },
        category: {
          select: {
            content: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    } else {
      return destination;
    }
  }

  // Create destination
  async create(createDestinationDto: CreateDestinationDto, userId: number) {
    const {
      title,
      description,
      price,
      categoryId,
      duration,
      images,
      destination,
    } = createDestinationDto;

    // Upload the images to Cloudinary
    let destinationImgs = [];

    if (images) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        const res = await this.cloudinaryService.uploadImage(
          image,
          'destinations',
        );

        destinationImgs.push({
          imageUrl: res.secure_url,
          imagePublicId: res.public_id,
        });
      }
    }

    await this.prisma.destination.create({
      data: {
        title,
        description,
        price,
        userId,
        duration,
        destination,
        categoryId,
        images: {
          create: destinationImgs,
        },
      },
    });

    return {
      statusCode: 201,
      message: 'Destination Created Successfull',
    };
  }

  // Update destination
  async update(
    updateDestinationDto: UpdateDestinationDto,
    id: number,
    userId: number,
  ) {
    // check if the destination exists
    const checkDestination = await this.findOne(id);

    // get public IDs
    let publicIdsToDelete: string[] = checkDestination.images.map(
      (image) => image.imagePublicId,
    );

    const {
      title,
      description,
      price,
      categoryId,
      duration,
      images,
      destination,
    } = updateDestinationDto;

    // Upload the images to Cloudinary
    let newImages = [];

    if (images) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        const res = await this.cloudinaryService.uploadImage(
          image,
          'destinations',
        );

        newImages.push({
          imageUrl: res.secure_url,
          imagePublicId: res.public_id,
        });
      }
    }

    // Update the destination data
    const updateData = {
      title,
      description,
      price,
      userId,
      duration,
      destination,
      categoryId,
    };

    if (newImages.length > 0) {
      updateData['images'] = {
        create: newImages,
      };

      await this.deletePreviousImages(publicIdsToDelete, checkDestination.id);
    }

    await this.prisma.destination.update({
      where: { id },
      data: updateData,
    });

    return {
      statusCode: 201,
      message: 'Destination Updated Successfull',
    };
  }

  // Remove destination
  async remove(id: number) {
    // check if the user exists
    const destination = await this.findOne(id);
    const images = destination.images;

    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        //Delete old image
        await this.cloudinaryService.destroyImage(image.imagePublicId);
      }
    }

    // Delete destination images
    await this.prisma.destinationImages.deleteMany({
      where: { destinationId: id },
    });

    // Delete destination
    await this.prisma.destination.delete({ where: { id } });
    return {
      statusCode: 200,
      message: 'Destination Deleted Successfull',
    };
  }
}
