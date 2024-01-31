import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // Get All Users
  async getAll(): Promise<User[] | undefined> {
    return await this.prisma.user.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // Get User By Id
  async findOneById(id: number): Promise<User | undefined> {
    const user = await this.prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    } else {
      return user;
    }
  }

  // Get User By Username
  async findOne(username: string): Promise<User | undefined> {
    return this.prisma.user.findFirst({ where: { username } });
  }

  // Create User
  async create(userDto: CreateUserDto) {
    const { email, username, password, role, image, firstName, lastName } =
      userDto;

    // Upload the image to Cloudinary
    let imageUrl = '';
    let imagePublicId = '';

    if (image) {
      const res = await this.cloudinaryService.uploadImage(image, 'users');
      imageUrl = res.secure_url;
      imagePublicId = res.public_id;
    }

    // hash password
    const hashPassword = await hash(password, 12);

    await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashPassword,
        imageUrl,
        imagePublicId,
        role,
        firstName,
        lastName,
      },
    });

    return {
      statusCode: 201,
      message: 'User Created Successfull',
    };
  }

  // Update User
  async update(userDto: UpdateUserDto, id: number) {
    // check if the category exists
    const user = await this.findOneById(id);

    const { email, username, role, image, firstName, lastName } = userDto;

    // Upload the image to Cloudinary
    let imageUrl = user.imageUrl ? user.imageUrl : '';
    let imagePublicId = user.imagePublicId ? user.imagePublicId : '';

    if (image) {
      const image_id = user.imagePublicId;

      if (image_id) {
        //Delete previous image
        await this.cloudinaryService.destroyImage(image_id);
      }

      const res = await this.cloudinaryService.uploadImage(image, 'users');
      imageUrl = res.secure_url;
      imagePublicId = res.public_id;
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        email,
        username,
        imageUrl,
        imagePublicId,
        role,
        firstName,
        lastName,
      },
    });

    return {
      statusCode: 200,
      message: 'User Updated Successfull',
    };
  }

  // Remove User
  async remove(id: number) {
    // check if the user exists
    const user = await this.findOneById(id);
    const image_id = user.imagePublicId;

    if (image_id) {
      //Delete user image
      await this.cloudinaryService.destroyImage(image_id);
    }

    // Delete exist user
    await this.prisma.user.delete({ where: { id } });

    return {
      statusCode: 200,
      message: 'User Deleted Successfull',
    };
  }

  // Get User Profile
  async getProfile(username: string): Promise<User | undefined> {
    return await this.prisma.user.findFirst({ where: { username } });
  }
}
