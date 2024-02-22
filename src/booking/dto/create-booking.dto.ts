import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  amountPaid: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  destinationId: number;
}
