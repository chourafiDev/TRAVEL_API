import { IsNotEmpty, IsString } from 'class-validator';

export class ImageUserDto {
  @IsString()
  @IsNotEmpty()
  image: string;
}
