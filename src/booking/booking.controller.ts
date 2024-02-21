import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { STRIPE_CLIENT } from 'src/stripe/constants';
import Stripe from 'stripe';
import { BookingService } from './booking.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BookingCheckOutDto } from './dto/booking-checkout.dto';

@Controller('booking')
export class BookingController {
  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
    private bookingService: BookingService,
  ) {}

  @Get('/customers')
  getCustomers() {
    return this.stripe.customers.list();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Get()
  getBookings() {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  @Post('/checkout')
  stripeCheckout(@Body() checkOutDto: BookingCheckOutDto, @Request() req: any) {
    const { id: userId } = req.user;

    return this.bookingService.stripeCheckout(checkOutDto, userId);
  }
}
