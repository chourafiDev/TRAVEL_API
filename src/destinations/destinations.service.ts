import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Destination } from '@prisma/client';

@Injectable()
export class DestinationsService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // Get all destinations
  async findAll() {
    return await this.prisma.destination.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // Get destination
  async findOne(id: number): Promise<Destination | undefined> {
    const destination = await this.prisma.destination.findFirst({
      where: { id },
    });

    if (!destination) {
      throw new NotFoundException('Destination not found');
    } else {
      return destination;
    }
  }

  // Create destination
  create(createDestinationDto: CreateDestinationDto) {
    return 'This action adds a new destination';
  }

  // Update destination
  update(id: number, updateDestinationDto: UpdateDestinationDto) {
    return `This action updates a #${id} destination`;
  }

  // Remove destination
  remove(id: number) {
    return `This action removes a #${id} destination`;
  }
}
