import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // get All Users
  async getAll(): Promise<User[] | undefined> {
    return this.prisma.user.findMany();
  }

  // get User By Username
  async findOne(username: string): Promise<User | undefined> {
    return this.prisma.user.findFirst({ where: { username } });
  }

  // Create User
  async create(data: any) {
    return this.prisma.user.create({ data: data });
  }

  // get User Profile
  async getProfile(username: string): Promise<User | undefined> {
    return this.prisma.user.findFirst({ where: { username } });
  }
}
