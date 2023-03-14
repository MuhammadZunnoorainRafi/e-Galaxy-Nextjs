import { getSession } from 'next-auth/react';
import bcryptjs from 'bcryptjs';
import db from '@/config/db';
import User from '@/models/users';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  const { user } = session;
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !email.includes('@') ||
    (password && password.trim().length < 5)
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await db.connect();
  await User.findByIdAndUpdate(
    user._id,
    {
      name: name,
      email: email,
      password: bcryptjs.hashSync(password),
    },
    {
      new: true,
    }
  );
  //   toUpdateUser.name = name;

  //   if (password) {
  //     toUpdateUser.password = bcryptjs.hashSync(password);
  //   }

  //   await toUpdateUser.save();
  await db.disconnect();
  res.send('Updated');
}

export default handler;
