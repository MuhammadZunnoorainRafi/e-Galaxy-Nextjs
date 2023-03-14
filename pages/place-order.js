import BackButton from '@/components/BackButton';
import CheckoutWizard from '@/components/CheckoutWizard';
import Layout from '@/components/Layout';

import CartContext from '@/context/cartContext';

import { errorHandler } from '@/utils/errorHandler';
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';

function PlaceOrderScreen() {
  const { state, dispatch } = useContext(CartContext);
  const { cartItems, shippingAddress, paymentMethod } = state.cart;

  const router = useRouter();

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  // Item Price
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  // Shipping Price
  const shippingPrice = itemsPrice > 200 ? 5 : 15;

  // Tax Price
  const taxPrice = round2(itemsPrice * 0.15);

  // Total Price
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);

      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...state.cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (error) {
      setLoading(false);
      toast.error(errorHandler(error));
    }
  };

  return (
    <Layout title="Place-Order">
      <BackButton url="/payment" />
      <CheckoutWizard activeStep={3} />

      <h1 className="pb-3 text-5xl font-bold">Place Order</h1>
      {cartItems.length === 0 ? (
        <div className="font-semibold text-slate-700">
          Cart is empty{' '}
          <Link href="/" className="link-primary link">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto  md:col-span-3">
            <div className="card card-compact mb-3 rounded-lg border border-slate-300 p-4 shadow-md">
              <h2 className="mb-2 text-lg font-semibold">Shipping Address</h2>
              <div>
                {shippingAddress.fullName},{shippingAddress.address},{' '}
                {shippingAddress.city},{shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </div>
              <div>
                <Link className="link-primary link" href="/shipping">
                  Edit
                </Link>
              </div>
            </div>
            <div className="card card-compact mb-3 rounded-lg border border-slate-300 p-4 shadow-md">
              <h2 className="mb-2 text-lg font-semibold">Payment Method</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link className="link-primary link" href="/payment">
                  Edit
                </Link>
              </div>
            </div>
            <div className="card card-compact mb-3  overflow-x-auto rounded-lg border border-slate-300 p-4 shadow-md">
              <h2 className="mb-2 text-lg font-semibold">Order Items </h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="p-2 text-left sm:px-5">Item</th>
                    <th className="p-2 text-right sm:p-5">Quantity</th>
                    <th className="p-2 text-right sm:p-5">Price</th>
                    <th className="p-2 text-right sm:p-5">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((val, ind) => {
                    return (
                      <tr key={ind} className="border-b">
                        <td className="p-0 sm:p-5">
                          <Link
                            className="flex items-center "
                            href={`/product/${val.slug}`}
                          >
                            <Image
                              src={val.image}
                              alt={val.name}
                              width={50}
                              height={50}
                              className=" h-auto w-auto rounded-md"
                              priority
                            />
                            &nbsp;{' '}
                            <p className=" text-sm sm:text-base">{val.name}</p>
                          </Link>
                        </td>
                        <td className="p-2 text-right sm:p-5">
                          {val.quantity}
                        </td>
                        <td className="p-2 text-right sm:p-5">{val.price}</td>
                        <td className="p-2 text-right sm:p-5">
                          ${val.quantity * val.price}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div>
                <Link className="link-primary link" href="/cart">
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <div className="card mb-3 border border-slate-300 p-4 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold">Order Summary</h2>
            <div className="mb-1 flex justify-between">
              <p>Items</p>
              <p>${itemsPrice}</p>
            </div>
            <div className="mb-1 flex justify-between">
              <p>Tax</p>
              <p>${taxPrice}</p>
            </div>
            <div className="mb-1 flex justify-between">
              <p>Shipping</p>
              <p>${shippingPrice}</p>
            </div>
            <div className="mb-1 flex justify-between">
              <p>Total</p>
              <p>${totalPrice}</p>
            </div>
            <div>
              {loading ? (
                <button
                  disabled={loading}
                  className="loading btn w-full text-slate-700"
                >
                  Loading
                </button>
              ) : (
                <button
                  onClick={placeOrderHandler}
                  className="btn-primary  btn w-full"
                >
                  Place Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default PlaceOrderScreen;
PlaceOrderScreen.auth = true;
