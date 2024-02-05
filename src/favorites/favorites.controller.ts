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
  findAll() {
    return this.favoritesService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.favoritesService.findOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard)
  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto, @Request() req: any) {
    const { id: userId } = req.user;
    return this.favoritesService.create(createFavoriteDto, userId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.favoritesService.remove(id);
  }
}
