import { Menu, PrismaClient } from '@prisma/client';

import MENU_DATA from './menu-data.json';

const prisma = new PrismaClient();

/**
 * Menu data is taken from
 * https://github.com/igdev116/free-food-menus-api/tree/main/menus
 */
async function main() {
  (MENU_DATA as Menu[]).forEach(async (item) => {
    await prisma.menu.upsert({
      where: {
        id: item.id,
      },
      update: {},
      create: {
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
      },
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
