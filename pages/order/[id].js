import Layout from '@/components/Layout';
import Spinner from '@/components/Spinner';
import OrderScreenContext from '@/context/orderScreenContext/orderContext';
import { errorHandler } from '@/utils/errorHandler';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';

function OrderScreen() {
  const { order, loading, error, dispatch } = useContext(OrderScreenContext);
  const router = useRouter();
  const { query } = router;
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${query.id}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: errorHandler(error) });
      }
    };
    if (!order._id || (order._id && order._id !== query.id)) {
      fetchOrder();
    }
  }, [dispatch, order._id, query.id]);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,

    isDelivered,
    deliveredAt,
  } = order;

  const updatePayment = async () => {
    try {
      const { data } = await axios.put(`/api/orders/${query.id}`);
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
      toast.success('Payment Successful');
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: errorHandler(error) });
    }
  };

  return (
    <Layout title={`Order ${query.id}`}>
      <h1 className="mb-4 ml-0 text-[20px] font-bold underline underline-offset-4 sm:ml-2 sm:text-3xl">{`Order ID : ${query.id}`}</h1>
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className=" alert alert-error ">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="space-y-3 overflow-x-auto md:col-span-3">
            <div className="card border border-gray-300 p-5 shadow-lg">
              <h2 className="mb-2 text-lg font-semibold">Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className=" alert alert-success mt-2 p-3">
                  Delivered at {deliveredAt}
                </div>
              ) : (
                <div className="alert alert-error mt-2 p-3">Not delivered</div>
              )}
            </div>

            <div className="card border border-gray-300 p-5 shadow-lg">
              <h2 className="mb-2 text-lg font-semibold">Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert alert-success mt-2 p-3 font-semibold text-white">
                  Paid 👍
                </div>
              ) : (
                <div className="alert alert-error mt-2 p-3">Not paid</div>
              )}
            </div>

            <div className="card overflow-x-auto border border-gray-300 p-2 shadow-lg sm:p-4">
              <h2 className="mb-2 text-lg font-semibold">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className=" p-2 text-left sm:px-5">Item</th>
                    <th className=" p-2 text-right sm:p-5">Quantity</th>
                    <th className=" p-2 text-right sm:p-5">Price</th>
                    <th className=" p-2 text-right sm:p-5">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link
                          className="flex items-center p-0 sm:px-5"
                          href={`/product/${item.slug}`}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            className=" h-auto w-auto rounded-md"
                            width={50}
                            height={50}
                            priority
                          ></Image>
                          &nbsp;
                          <p className=" text-xs sm:text-base">{item.name}</p>
                        </Link>
                      </td>
                      <td className="p-2 text-right sm:p-5">{item.quantity}</td>
                      <td className="p-2 text-right sm:p-5">${item.price}</td>
                      <td className="p-2 text-right sm:p-5">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card  mb-3 border border-gray-300 p-5 shadow-lg">
              <h2 className="mb-2 text-lg font-semibold">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>{' '}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
              </ul>
            </div>
            <Link className=" btn-primary btn w-full" href="/">
              Continue Shopping
            </Link>
            {!isPaid && paymentMethod !== 'Cash On Delivery' && (
              <button
                onClick={updatePayment}
                className=" btn-outline btn-warning btn mt-2 w-full"
              >
                Pay Bill (Dummy)
              </button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default OrderScreen;
OrderScreen.auth = true;
