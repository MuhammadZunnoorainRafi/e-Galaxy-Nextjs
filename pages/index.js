/* eslint-disable @next/next/no-img-element */
import Layout from '@/components/Layout';
import ProductItems from '@/components/ProductItems';
import db from '@/config/db';
import Products from '@/models/products';

export default function Home({ products }) {
  return (
    <Layout title="Home Page">
      <div className="grid place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, ind) => (
          <ProductItems key={ind} val={product} />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Products.find().lean();
  await db.disconnect();
  return {
    props: { products: products.map(db.convertDocToObj) },
  };
}
