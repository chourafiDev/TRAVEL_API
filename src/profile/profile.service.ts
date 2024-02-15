import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto } from './dto/profile-user.dto';
import { UsersService } from 'src/users/users.service';
import { ImageUserDto } from './dto/image-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { compare, hash } from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private userService: UsersService,
  ) {}

  verifyPassword(pwd: string, userPwd: string) {
    const verifyPassword = compare(pwd, userPwd);

    return verifyPassword;
  }

  // Get Profile
  async getProfile(username: string): Promise<User | undefined> {
    return await this.prisma.user.findFirst({ where: { username } });
  }

  // Update Profile
  async updateProfile(userDto: ProfileDto, username: string) {
    // check if the user  exists
    const user = await this.userService.findOne(username);

    const {
      image,
      username: usernameDto,
      firstName,
      lastName,
      email,
    } = userDto;

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
      where: { username },
      data: {
        email,
        username,
        imageUrl,
        imagePublicId,
        firstName,
        lastName,
      },
    });

    return {
      statusCode: 200,
      message: 'Profile Updated Successfull',
    };
  }

  // Update Profile Image
  async updateProfileImage(imageDto: ImageUserDto, username: string) {
    // check if the user  exists
    const user = await this.userService.findOne(username);

    const { image } = imageDto;

    //Delete previous image
    const image_id = user.imagePublicId;

    if (image_id) {
      await this.cloudinaryService.destroyImage(image_id);
    }

    const res = await this.cloudinaryService.uploadImage(image, 'users');

    await this.prisma.user.update({
      where: { username },
      data: {
        imageUrl: res.secure_url,
        imagePublicId: res.public_id,
      },
    });

    return {
      statusCode: 200,
      message: 'Image Updated Successfull',
    };
  }

  // Change Password
  async changePassword(passwordDto: ChangePasswordDto, username: string) {
    // check if the user  exists
    const user = await this.userService.findOne(username);

    const { oldPassword, newPassword } = passwordDto;

    //Check is password valid
    const checkPassword = await this.verifyPassword(oldPassword, user.password);

    if (checkPassword) {
      // hash password
      const hashPassword = await hash(newPassword, 12);

      await this.prisma.user.update({
        where: { username },
        data: {
          password: hashPassword,
        },
      });

      return {
        statusCode: 200,
        message: 'Password Updated Successfull',
      };
    } else {
      throw new NotFoundException('Old password invalid');
    }
  }
}
