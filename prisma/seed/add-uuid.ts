import { Menu } from '@prisma/client';
import fs from 'fs';

import MENU_DATA from './menu-data.json';

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const addUUIDToObj = (obj) => ({ id: uuidv4(), ...obj });

const main = async () => {
  const data = (MENU_DATA as Menu[]).map((item) => {
    if (item.id) return item;

    return addUUIDToObj(item);
  });

  console.log(data);
  console.log(JSON.stringify(data));

  try {
    fs.writeFileSync(
      './prisma/seed/menu-data.json',
      JSON.stringify(data, null, 2)
    );
  } catch (err) {
    console.log('Error writing Metadata.json:' + err.message);
  }
};

main();
