import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
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
