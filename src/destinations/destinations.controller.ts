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
} from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/utils/role.enum';
import { Destination } from '@prisma/client';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Get()
  findAll(): Promise<Destination[] | undefined> {
    return this.destinationsService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Destination | undefined> {
    return this.destinationsService.findOne(id);
  }

  @Post()
  create(@Body() createDestinationDto: CreateDestinationDto) {
    return this.destinationsService.create(createDestinationDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ) {
    return this.destinationsService.update(+id, updateDestinationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.destinationsService.remove(+id);
  }
}
