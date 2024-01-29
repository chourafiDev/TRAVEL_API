import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    console.log('createCategoryDto', createCategoryDto);
    const { image, content } = createCategoryDto;

    // Upload the image to Cloudinary
    let imageUrl = '';
    let imagePublicId = '';

    if (image) {
      const res = await this.cloudinaryService.uploadImage(image, 'categories');
      imageUrl = res.secure_url;
      imagePublicId = res.public_id;
      console.log('res', res);
    }

    await this.prisma.category.create({
      data: {
        content,
        imageUrl,
        imagePublicId,
      },
    });

    return {
      statusCode: 201,
      message: 'Category Created Successfull',
    };
  }

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findFirst({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    } else {
      return category;
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: number) {
    const category = await this.prisma.category.findFirst({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Delete exist category
    await this.prisma.category.delete({ where: { id } });

    return {
      statusCode: 200,
      message: 'Category Deleted Successfull',
    };
  }
}
