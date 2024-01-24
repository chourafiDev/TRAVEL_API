import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const hashPassword = await hash(process.env.SEED_PASSWORD, 12);

  await prisma.user.create({
    data: {
      username: 'chourafi',
      email: 'chourafi@gmail.com',
      firstName: 'chourafi',
      lastName: 'chourafi',
      role: 'admin',
      imagePublicId: '',
      imageUrl: '',
      password: hashPassword,
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
