import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BookingCheckOutDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
