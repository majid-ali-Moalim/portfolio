import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const hashedPassword = bcrypt.hashSync('456654@Portfolio', 12);

    const admin = await prisma.admin.upsert({
      where: { username: 'majidalimoalim@gmail.com' },
      update: {
        password: hashedPassword,
      },
      create: {
        username: 'majidalimoalim@gmail.com',
        password: hashedPassword,
      },
    });

    console.log('Admin user seeded successfully:', admin.username);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
