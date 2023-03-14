import BackButton from '@/components/BackButton';
import Layout from '@/components/Layout';
import db from '@/config/db';
import cartContext from '@/context/cartContext';
import Products from '@/models/products';

import React, { useContext } from 'react';

function ProductScreen({ product }) {
  const { handleAddToCart } = useContext(cartContext);

  if (!product) {
    return (
      <Layout title="Product Not Found">
        <BackButton url="/" />
        <div className="flex min-h-[50vh] items-center justify-center text-6xl font-semibold text-slate-600">
          <h1>
            Product Not Found <span className=" text-rose-500">:(</span>
          </h1>
        </div>
      </Layout>
    );
  }
  const {
    image,
    category,
    name,
    numReviews,
    rating,
    description,
    brand,
    price,
    countInStock,
  } = product;

  return (
    <Layout title={product.name}>
      <BackButton url="/" />

      <div className="card-compact card mx-auto mb-4 border border-slate-200 bg-base-100 shadow-xl md:card-side md:w-[750px] lg:w-[1000px]">
        <picture className="md:w-1/2 ">
          <img
            src={image}
            className=" h-full rounded-t-xl object-cover md:rounded-l-xl md:rounded-tr-none "
            alt="Album"
          />
        </picture>
        <div className="space-y-2 px-7 py-7 text-slate-700 md:w-1/2">
          <div className="flex items-start justify-start space-x-3 pb-4">
            <h1 className=" text-4xl font-bold md:text-3xl lg:text-4xl ">
              {name}
            </h1>
            <div className=" space-x-3">
              <div
                className={` badge rounded-lg rounded-bl-none border-none ${
                  countInStock > 0 ? 'bg-green-400' : 'bg-red-400'
                }   `}
              >
                <p className=" text-white">
                  {countInStock > 0 ? 'In stock' : 'Out of stock'}
                </p>
              </div>
            </div>
          </div>
          <p className="text-xl">Category : {category}</p>
          <p className="text-xl ">Brand : {brand}</p>
          <p className="text-xl">
            Price :{' '}
            <span className="font-serif text-xl font-bold">$ {price}</span>
          </p>
          <p className="text-xl">Reviews : {numReviews}</p>
          <p className="text-xl">Rating : {rating}</p>
          <p className="text-xl">Description : {description}</p>
          <div className="card-actions items-center justify-center space-x-6 pt-6 ">
            <button
              className={`${
                countInStock === 0
                  ? ' btn-disabled text-slate-700'
                  : 'btn-primary'
              }  btn-wide btn`}
              onClick={() => handleAddToCart(product)}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductScreen;

export async function getServerSideProps({ params }) {
  const { slug } = params;
  await db.connect();
  const product = await Products.findOne({ slug: slug }).lean();
  await db.disconnect();
  return {
    props: { product: product ? db.convertDocToObj(product) : null },
  };
}
