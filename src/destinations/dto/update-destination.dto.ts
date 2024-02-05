import { IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateDestinationDto } from './create-destination.dto';

export class UpdateDestinationDto extends PartialType(CreateDestinationDto) {
  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}
