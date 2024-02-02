import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Destination } from '../utils/types';

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

    if (images.length > 0) {
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

    if (images.length > 0) {
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
