import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [CloudinaryModule],
  controllers: [UsersController],
})
export class UsersModule {}
