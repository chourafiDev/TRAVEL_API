import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      username: 'chourafi',
      email: 'chourafi@gmail.com',
      firstName: 'chourafi',
      lastName: 'chourafi',
      role: 'admin',
      imagePublicId: '',
      imageUrl: '',
      password: 'chourafi',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
