// Banglish comments sudhu
// Ei script default admins database te insert kore

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Hardcoded default admins
const defaultAdmins = [
  { username: 'ice_dep', password: 'ice_dep12' },
  { username: 'noor', password: 'noorabdullah' }
];

async function main() {
  console.log('🌱 Seeding database...');

  for (const admin of defaultAdmins) {
    // Check kore jodi already exist kore
    const existing = await prisma.admin.findUnique({
      where: { username: admin.username }
    });

    if (!existing) {
      // Password hash kore save kore
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      await prisma.admin.create({
        data: {
          username: admin.username,
          password: hashedPassword
        }
      });
      console.log(`✅ Admin created: ${admin.username}`);
    } else {
      console.log(`ℹ️ Admin already exists: ${admin.username}`);
    }
  }

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
