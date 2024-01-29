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

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { image, content } = createCategoryDto;

    // Upload the image to Cloudinary
    let imageUrl = '';
    let imagePublicId = '';

    if (image) {
      const res = await this.cloudinaryService.uploadImage(image, 'categories');
      imageUrl = res.secure_url;
      imagePublicId = res.public_id;
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
      message: 'Category Created Successfully',
    };
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
    const { image, content } = updateCategoryDto;

    // check if the category exists
    const category = await this.findOne(id);

    // Upload the image to Cloudinary
    let imageUrl = category.imageUrl;
    let imagePublicId = category.imagePublicId;

    if (image) {
      const image_id = category.imagePublicId;

      if (image_id) {
        //Delete previous image
        await this.cloudinaryService.destroyImage(image_id);
      }

      const res = await this.cloudinaryService.uploadImage(image, 'categories');
      imageUrl = res.secure_url;
      imagePublicId = res.public_id;
    }

    await this.prisma.category.update({
      where: { id },
      data: {
        content,
        imageUrl,
        imagePublicId,
      },
    });

    return {
      statusCode: 201,
      message: 'Category Updated Successfully',
    };
  }

  async remove(id: number) {
    // check if the category exists
    const category = await this.findOne(id);
    const image_id = category.imagePublicId;

    if (image_id) {
      //Delete category image
      await this.cloudinaryService.destroyImage(image_id);
    }

    // Delete exist category
    await this.prisma.category.delete({ where: { id } });

    return {
      statusCode: 200,
      message: 'Category Deleted Successfull',
    };
  }
}
