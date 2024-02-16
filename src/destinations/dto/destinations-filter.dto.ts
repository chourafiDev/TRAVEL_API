import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DestinationsFiletrDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  search?: string | null;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  destination?: string | null;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  category?: string | null;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  minPrice?: number | null;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  maxPrice?: number | null;
}
