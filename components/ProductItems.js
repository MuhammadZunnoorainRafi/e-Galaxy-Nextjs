/* eslint-disable @next/next/no-img-element */

import CartContext from '@/context/cartContext';

import Link from 'next/link';
import React, { useContext } from 'react';

export default function ProductItems({ val }) {
  const { handleAddToCart } = useContext(CartContext);
  const { name, slug, image, price, brand, countInStock } = val;

  return (
    <div className="card-compact group card w-72 bg-base-100 shadow-xl">
      <picture className="relative overflow-hidden rounded-t-xl">
        <img
          src={image}
          className="rounded-t-xl duration-200 group-hover:scale-[1.1]"
          alt="Shoes"
        />
      </picture>
      <div className="card-body -space-y-1">
        <div className="flex items-center space-x-3">
          <h2 className="card-title">{name}</h2>
          <div
            className={` ${
              countInStock > 0
                ? ''
                : ' badge rounded-lg  border-none bg-red-400 duration-1000'
            }  `}
          >
            <p className=" text-white">
              {countInStock > 0 ? '' : 'Out of stock'}
            </p>
          </div>
        </div>
        <p className="text-slate-600">{brand}</p>
        <p className="font-semibold text-slate-600">$ {price}</p>
        <div className="card-actions  ">
          <button
            onClick={() => handleAddToCart(val)}
            className={`${
              countInStock === 0
                ? ' btn-disabled text-slate-700'
                : 'btn-primary'
            }  btn w-full`}
          >
            Add to cart
          </button>

          <Link href={`/product/${slug}`} className="btn w-full ">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
