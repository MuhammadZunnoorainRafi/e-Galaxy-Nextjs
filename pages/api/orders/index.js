import db from '@/config/db';
import Orders from '@/models/orders';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  const session = await getSession({ req });
  const { user } = session;
  await db.connect();
  const newOrder = await Orders.create({
    ...req.body,
    user: user._id,
  });
  await db.disconnect();
  if (!session) {
    return res.status(401).send('Sign In required');
  }

  res.status(201).json(newOrder);
};

export default handler;
