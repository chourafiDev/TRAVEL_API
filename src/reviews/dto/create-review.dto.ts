import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  destinationId: number;
}
