import BackButton from '@/components/BackButton';
import Layout from '@/components/Layout';
import CartContext from '@/context/cartContext';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { HiOutlineXCircle } from 'react-icons/hi';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

function CartScreen() {
  const { cartItems, handleCartSelect, handleRemoveItem } =
    useContext(CartContext);
  const router = useRouter();

  return (
    <Layout title="Cart">
      <BackButton url="/" />
      <h1 className="mb-4 text-3xl font-bold">Shopping Cart</h1>
      <div className="min-h-[50vh]">
        {cartItems.length === 0 ? (
          <div>
            <h1 className="mb-5 flex items-center space-x-3 text-3xl font-semibold text-slate-600">
              <p>Cart is empty</p>
              <AiOutlineShoppingCart />
            </h1>
            <Link className="btn-outline btn-ghost btn " href="/">
              Go Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-4">
            <div className=" overflow-x-auto md:col-span-3">
              <table className="min-w-full">
                <thead className=" border-b-2">
                  <tr>
                    <th className="p-2 text-left sm:px-5">Item</th>
                    <th className="p-2 text-right sm:p-5">Quantity</th>
                    <th className="p-2 text-right sm:p-5">Price</th>
                    <th className="p-2 text-right sm:p-5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((val, ind) => (
                    <tr className="border-b" key={ind}>
                      <td>
                        <Link
                          className="flex items-center p-0 sm:px-5"
                          href={`/product/${val.slug}`}
                        >
                          <Image
                            src={val.image}
                            alt="error"
                            height={50}
                            width={50}
                            className="h-auto  w-auto rounded-sm"
                            priority
                          />
                          &nbsp;
                          <p className=" text-sm sm:text-base">{val.name}</p>
                        </Link>
                      </td>
                      <td className="p-2 text-right sm:p-5">
                        {' '}
                        <select
                          className=" select select-sm bg-base-200 hover:bg-base-300"
                          value={val.quantity}
                          onChange={(e) =>
                            handleCartSelect(val, e.target.value)
                          }
                        >
                          {[...Array(val.countInStock).keys()].map(
                            (item, ind) => {
                              return (
                                <option value={item + 1} key={ind}>
                                  {item + 1}
                                </option>
                              );
                            }
                          )}
                        </select>{' '}
                      </td>
                      <td className="p-2 text-right sm:p-5">${val.price}</td>
                      <td className="p-2 text-right sm:p-5">
                        <button onClick={() => handleRemoveItem(val.slug)}>
                          <HiOutlineXCircle className="h-5 w-5 hover:scale-110 hover:stroke-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3 rounded-lg border border-slate-300 p-3 shadow-lg">
              <p className=" card-title card-normal font-semibold">
                Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) :{' '}
                <span>
                  ${cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </span>
              </p>
              <div>
                <button
                  onClick={() => router.push('login?redirect=/shipping')}
                  className="btn-success btn-block btn hover:text-white"
                >
                  Check out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
