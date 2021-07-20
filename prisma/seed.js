const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

var bcrypt = require('bcryptjs');

const userData = [
  {
    email: 'Jeffers@prisma.io',
    password: bcrypt.hashSync('1356', 8),
  },
  {
    email: 'nilu@prisma.io',
    password: bcrypt.hashSync('19056', 8),
  },
  {
    email: 'mahmoud@prisma.io',
    password: bcrypt.hashSync('1356029178', 8),
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
