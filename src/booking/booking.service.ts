import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { STRIPE_CLIENT } from 'src/stripe/constants';
import Stripe from 'stripe';
import { BookingCheckOutDto } from './dto/booking-checkout.dto';

@Injectable()
export class BookingService {
  constructor(@Inject(STRIPE_CLIENT) private stripe: Stripe) {}

  async stripeCheckout(checkOutDto: BookingCheckOutDto, userId: number) {
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
      const { price, destinationId } = checkOutDto;

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.floor(price * 100),
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata: {
          userId,
          destinationId,
        },
      });

      return { paymentIntent: paymentIntent.client_secret };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
