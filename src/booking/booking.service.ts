import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { STRIPE_CLIENT } from 'src/stripe/constants';
import Stripe from 'stripe';
import { BookingCheckOutDto } from './dto/booking-checkout.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
    private prisma: PrismaService,
  ) {}

  // generate a random string involving both characters and numbers
  generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }

  // Find user bookings
  async findAll(userId: number) {
    const bookings = await this.prisma.bookings.findMany({
      where: { userId },
    });

    return bookings;
  }

  // Create booking
  async create(createBookingDto: CreateBookingDto, userId: number) {
    const { destinationId, amountPaid } = createBookingDto;

    await this.prisma.bookings.create({
      data: {
        destinationId,
        userId,
        amountPaid,
        number: this.generateRandomString(6),
      },
    });

    return {
      statusCode: 201,
      message: 'Booking Created Successfull',
    };
  }

  // Create stripe checkout
  async stripeCheckout(checkOutDto: BookingCheckOutDto) {
    // const lineItems = [
    //   {
    //     price_data: {
    //       unit_amount: price,
    //       currency: 'usd',
    //     },
    //     quantity: 1,
    //   },
    // ];

    // const session = await this.stripe.checkout.sessions.create({
    //   line_items: lineItems,
    //   mode: 'payment',
    //   success_url: `https://www.chourafidev.com/`,
    //   cancel_url: `https://www.chourafidev.com/`,
    //   metadata: {
    //     userId,
    //     destinationId,
    //   },
    //   billing_address_collection: 'required',
    //   phone_number_collection: {
    //     enabled: true,
    //   },
    //   customer_email: userEmail,
    // });

    try {
      const { price } = checkOutDto;

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.floor(price * 100),
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
      });

      return { paymentIntent: paymentIntent.client_secret };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
