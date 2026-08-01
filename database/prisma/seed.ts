import { PrismaClient, Role, LogLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seed...');

  // 1. Create Default Interests
  const defaultInterests = [
    'gaming',
    'music',
    'technology',
    'movies',
    'anime',
    'programming',
    'sports',
    'travel',
    'art',
    'books',
  ];

  for (const name of defaultInterests) {
    await prisma.interest.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('✅ Default interests seeded.');

  // 2. Create Admin User (Optional / Initial Seed)
  const adminEmail = 'admin@fluxchat.com';
  // Password hash for 'Admin123!' (using bcrypt pre-computed or generated)
  // $2a$10$wO8l2K4gG5H9HqG/Fk4Pq.Q.R5Hq8A3PzYJ9J2J3J4J5J6J7J8J9
  const bcrypt = await import('bcryptjs');
  const passwordHash = await bcrypt.hash('Admin123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      username: 'SystemAdmin',
      passwordHash: passwordHash,
      isGuest: false,
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Admin user ready: ${admin.email}`);

  // 3. Create initial log
  await prisma.log.create({
    data: {
      level: LogLevel.INFO,
      message: 'System database successfully seeded',
      metadata: { seededAt: new Date().toISOString() },
    },
  });

  console.log('🌱 Database Seed Finished!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
