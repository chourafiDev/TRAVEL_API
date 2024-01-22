import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // Get All Users
  async getAll(): Promise<User[] | undefined> {
    return await this.prisma.user.findMany();
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
  async create(userData: CreateUserDto, file: any) {
    const { email, username, password, role, firstName, lastName } = userData;

    // Upload the image to Cloudinary
    let imageUrl = '';
    let imagePublicId = '';

    if (file) {
      console.log('test');
      const res = await this.cloudinaryService.uploadImage(file, 'users');
      console.log('res', res);
      imageUrl = res.secure_url;
      imagePublicId = res.public_id;
    }

    await this.prisma.user.create({
      data: {
        email,
        username,
        password,
        // imageUrl,
        // imagePublicId,
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
  async update(userData: UpdateUserDto, file: any, id: number) {
    // check if user not exist
    const user = await this.prisma.user.findFirst({ where: { id } });
    console.log('user', user);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { email, username, password, role, firstName, lastName } = userData;

    // Upload the image to Cloudinary
    let imageUrl = '';
    let imagePublicId = '';

    if (file) {
      console.log('test');
      const res = await this.cloudinaryService.uploadImage(file, 'users');
      console.log('res', res);
      imageUrl = res.secure_url;
      imagePublicId = res.public_id;
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        email,
        username,
        password,
        // imageUrl,
        // imagePublicId,
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

  // Delete User
  async delete(id: number) {
    const user = await this.prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
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
