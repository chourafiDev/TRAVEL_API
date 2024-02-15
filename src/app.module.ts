import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoriesModule } from './categories/categories.module';
import { DestinationsModule } from './destinations/destinations.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, CloudinaryModule, CategoriesModule, DestinationsModule, FavoritesModule, ProfileModule],
  providers: [CloudinaryService],
})
export class AppModule {}
