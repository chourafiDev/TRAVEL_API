# Journey Waypoints

This is the backend service for the Journey Waypoints application, responsible for managing destinations, bookings, and user interactions. Built with NestJS, this service utilizes Prisma ORM for database operations, Passport for authentication, and integrates Stripe for payment processing and Cloudinary for image management. It features role-based access control with distinct permissions for admins and users.

## Features

- **Manage Destinations:** Admins can add, update, or remove travel destinations.
- **Book Destinations:** Users can book destinations using Stripe for secure payments.
- **User Authentication:** Utilizes Passport for robust authentication mechanisms.
- **Image Management:** Cloudinary integration for uploading and managing destination images.
- **Role-Based Authorization:** Separate roles and permissions for admins and users.

## Technologies Used

- **Backend Framework:** NestJS
- **ORM:** Prisma
- **Authentication:** Passport
- **Database:** PostgreSQL
- **Payment Service:** Stripe
- **Image Management:** Cloudinary

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL database
- Stripe account for payment processing
- Cloudinary account for image management

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
