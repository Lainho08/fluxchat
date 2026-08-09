const path = require('path');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require(path.resolve(__dirname, '../backend/node_modules/bcryptjs'));

const dbPath = path.resolve(__dirname, './prisma/dev.db');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`,
    },
  },
});

async function createTestUser() {
  const email = 'teste@fluxchat.com';
  const password = 'Password123!';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      username: 'UsuarioTeste',
      isGuest: false,
    },
    create: {
      email,
      username: 'UsuarioTeste',
      passwordHash,
      isGuest: false,
      role: 'USER',
    },
  });

  console.log('========================================');
  console.log('✅ Usuário de teste pronto no banco!');
  console.log('E-mail:', user.email);
  console.log('Senha:', password);
  console.log('Username:', user.username);
  console.log('========================================');
}

createTestUser()
  .catch((err) => {
    console.error('❌ Erro ao criar usuário de teste:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
