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
import { ReviewsModule } from './reviews/reviews.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeModule } from './stripe/stripe.module';
import { BookingModule } from './booking/booking.module';
import configs from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs],
    }),
    StripeModule.forRoot(process.env.STRIPE_API_KEY, {
      apiVersion: '2023-10-16',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CloudinaryModule,
    CategoriesModule,
    DestinationsModule,
    FavoritesModule,
    ProfileModule,
    ReviewsModule,
    BookingModule,
  ],
  providers: [CloudinaryService],
})
export class AppModule {}
