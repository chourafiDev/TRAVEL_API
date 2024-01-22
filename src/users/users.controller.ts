import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { User } from '@prisma/client';
import { Role } from 'src/utils/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Get User Profile
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Get('me')
  getProfile(@Request() req: any): Promise<User | undefined> {
    const { username } = req.user;
    console.log('username', username);
    return this.usersService.getProfile(username);
  }

  // Get All Users
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/')
  async getUsers(): Promise<User[] | undefined> {
    return this.usersService.getAll();
  }

  // Get User
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number): Promise<User | undefined> {
    return this.usersService.findOneById(id);
  }

  // Create User
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() userData: CreateUserDto,
  ): Promise<any> {
    return this.usersService.create(userData, file);
  }

  // Update User
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @UploadedFile() file: Express.Multer.File,
    @Body() userData: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return this.usersService.update(userData, file, id);
  }

  // Delete Profile
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.usersService.delete(id);
  }
}
