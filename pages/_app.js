import Spinner from '@/components/Spinner';
import { CartProvider } from '@/context/cartContext';
import { OrderScreenProvider } from '@/context/orderScreenContext/orderContext';

import '@/styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <OrderScreenProvider>
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </OrderScreenProvider>
      </CartProvider>
    </SessionProvider>
  );
}

const Auth = ({ children }) => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=Login');
    },
  });
  if (status === 'loading') {
    return <Spinner />;
  }
  return children;
};
