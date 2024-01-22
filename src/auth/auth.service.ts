import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare, hash } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  verifyPassword(pwd: string, userPwd: string) {
    const verifyPassword = compare(pwd, userPwd);

    return verifyPassword;
  }

  hashPassword(pwd: string) {
    return hash(pwd, 12);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('Username or password incorrect');
    }

    const checkPassword = await this.verifyPassword(password, user.password);

    if (checkPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async register(registerDto: Prisma.UserCreateInput) {
    // check if user exists
    const checkUserExists = await this.usersService.findOne(
      registerDto.username,
    );

    if (checkUserExists) {
      throw new HttpException('User already registered', HttpStatus.CONFLICT);
    }

    // hash password
    registerDto.password = await this.hashPassword(registerDto.password);

    // create new user
    const createUser = await this.prisma.user.create({
      data: registerDto,
    });

    if (createUser) {
      return {
        statusCode: 201,
        message: 'Register Successfull',
      };
    }
  }

  generateToken(user: any) {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    };
  }
}
