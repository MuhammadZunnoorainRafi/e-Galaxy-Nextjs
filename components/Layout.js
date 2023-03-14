import Head from 'next/head';
import Footer from './Footer';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? title + ' ━ e-Galaxy' : 'e-Galaxy'}</title>
        <meta name="description" content="E-commerce Website" />
        <link rel="shortcut icon" href="favicon.ong" type="image/png" />
      </Head>
      <Toaster />
      <section className=" flex min-h-screen  flex-col justify-between">
        <header>
          <Navbar />
        </header>
        <main className=" my-auto mt-2 p-2">{children}</main>
        <footer>
          <Footer />
        </footer>
      </section>
    </>
  );
}

export default Layout;
