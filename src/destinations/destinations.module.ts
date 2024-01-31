import { Module } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { DestinationsController } from './destinations.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [DestinationsController],
  providers: [DestinationsService],
})
export class DestinationsModule {}
