import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/utils/role.enum';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // Find all categories
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/')
  async findAll(): Promise<Category[] | undefined> {
    return this.categoriesService.findAll();
  }

  // Find one category
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // Remove one category
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
