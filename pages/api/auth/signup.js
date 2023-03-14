import db from '@/config/db';

import User from '@/models/users';

import bcryptjs from 'bcryptjs';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;
    if (
      !name ||
      !email ||
      !email.includes('@') ||
      !password ||
      password.trim().length < 6
    ) {
      res.status(422).json({ message: 'Validation Error' });
      return;
    }

    await db.connect();
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(401).json({ message: 'User Already Exists' });
      await db.disconnect();
      return;
      // throw new Error('User Already Exists');
    }

    const newUser = await User.create({
      name: name,
      email: email,
      password: bcryptjs.hashSync(password),
      isAdmin: false,
    });
    await db.disconnect();
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  }
};

export default handler;
