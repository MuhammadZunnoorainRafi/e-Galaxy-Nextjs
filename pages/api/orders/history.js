import db from '@/config/db';
import Orders from '@/models/orders';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session.user) {
    return res.status(400).send('Sign In Required');
  }

  await db.connect();
  const result = await Orders.find({ user: session.user._id });

  await db.disconnect();
  res.status(200).json(result);
};

export default handler;
