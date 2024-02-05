import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    const { id: userId } = req.user;
    return this.favoritesService.findAll(userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard)
  @Post()
  favorite(@Body() createFavoriteDto: CreateFavoriteDto, @Request() req: any) {
    const { id: userId } = req.user;
    return this.favoritesService.favorite(createFavoriteDto, userId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  unfavorite(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const { id: userId } = req.user;
    return this.favoritesService.unfavorite(id, userId);
  }
}
