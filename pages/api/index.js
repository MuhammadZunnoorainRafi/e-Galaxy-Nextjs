// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import db from '@/config/db';
import Products from '@/models/products';
import User from '@/models/users';
import data from '@/utils/data';

export default async function handler(req, res) {
  await db.connect();
  User.deleteMany();
  User.insertMany(data.users);
  Products.deleteMany();
  Products.insertMany(data.products);

  await db.disconnect();

  res.status(200).json({ name: 'Seeded Successfully' });
}
