import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  UseGuards,
  HttpStatus,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Get()
  findAll(@Query('destinationId', ParseIntPipe) destinationId: number) {
    return this.reviewsService.findAll(destinationId);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Request() req: any) {
    const { id: userId } = req.user;
    return this.reviewsService.create(createReviewDto, userId);
  }
}
