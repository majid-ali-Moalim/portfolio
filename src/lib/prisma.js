import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis;

if (!globalForPrisma.prisma) {
  try {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';
    const adapter = new PrismaPg({ connectionString });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  } catch (err) {
    console.warn('PrismaClient initialization notice:', err.message);
    globalForPrisma.prisma = new PrismaClient();
  }
}

const prisma = globalForPrisma.prisma;

export default prisma;
