import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
  Request,
  Query,
} from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/utils/role.enum';
import { Destination } from '../utils/types';
import { DestinationsFiletrDto } from './dto/destinations-filter.dto';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Get()
  findAll(
    @Query() filterDto: DestinationsFiletrDto,
  ): Promise<Destination[] | undefined> {
    if (Object.keys(filterDto).length) {
      return this.destinationsService.findAllWithFilters(filterDto);
    } else {
      return this.destinationsService.findAll();
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Get('top')
  findTop(): Promise<Destination[] | undefined> {
    return this.destinationsService.findTop();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<unknown | undefined> {
    return this.destinationsService.findOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('create')
  create(
    @Body() createDestinationDto: CreateDestinationDto,
    @Request() req: any,
  ) {
    const { id: userId } = req.user;
    return this.destinationsService.create(createDestinationDto, userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(
    @Body() updateDestinationDto: UpdateDestinationDto,
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const { id: userId } = req.user;
    return this.destinationsService.update(updateDestinationDto, id, userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.destinationsService.remove(id);
  }
}
