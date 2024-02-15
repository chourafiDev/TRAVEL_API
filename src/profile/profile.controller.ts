import {
  Controller,
  Get,
  Body,
  Patch,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';
import { ProfileDto } from './dto/profile-user.dto';
import { ImageUserDto } from './dto/image-user.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // Get Profile
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Get()
  getProfile(@Request() req: any): Promise<User | undefined> {
    const { username } = req.user;
    return this.profileService.getProfile(username);
  }

  // Update Profile
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Put()
  updateProfile(
    @Body() userDto: ProfileDto,
    @Request() req: any,
  ): Promise<any> {
    const { username } = req.user;
    return this.profileService.updateProfile(userDto, username);
  }

  // Update Profile Image
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Patch('edit-image')
  updateProfileImage(
    @Body() imageDto: ImageUserDto,
    @Request() req: any,
  ): Promise<any> {
    const { username } = req.user;
    return this.profileService.updateProfileImage(imageDto, username);
  }
}
