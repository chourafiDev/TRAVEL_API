import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, CloudinaryModule, CategoriesModule],
  providers: [CloudinaryService],
})
export class AppModule {}
