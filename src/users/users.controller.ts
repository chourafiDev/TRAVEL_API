import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { User } from '@prisma/client';
import { Role } from 'src/utils/role.enum';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // get All Users
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/')
  async getUsers(): Promise<User[] | undefined> {
    return this.usersService.getAll();
  }

  // Create User
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('create')
  async create(@Body() userData: any): Promise<any> {
    return 'user created';
  }

  // get User Profile
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Get('me')
  async getProfile(@Request() req): Promise<any> {
    const { username } = req.user;
    return this.usersService.getProfile(username);
  }
}
