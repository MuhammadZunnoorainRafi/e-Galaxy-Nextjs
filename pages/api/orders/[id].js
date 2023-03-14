const { default: db } = require('@/config/db');
const { default: Orders } = require('@/models/orders');

const { getSession } = require('next-auth/react');

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('Sign In Required');
  }
  if (req.method === 'GET') {
    await db.connect();
    const order = await Orders.findById(req.query.id);
    await db.disconnect();

    res.status(200).json(order);
  }
  if (req.method === 'PUT') {
    await db.connect();
    const updatedOrder = await Orders.findByIdAndUpdate(
      req.query.id,
      { isPaid: true },
      { new: true }
    );
    await db.disconnect();
    res.status(203).json(updatedOrder);
  }
};

export default handler;
