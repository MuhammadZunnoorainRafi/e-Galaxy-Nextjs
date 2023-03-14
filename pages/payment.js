import BackButton from '@/components/BackButton';
import CheckoutWizard from '@/components/CheckoutWizard';
import Layout from '@/components/Layout';
import CartContext from '@/context/cartContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

function PaymentScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(CartContext);
  const { shippingAddress, paymentMethod } = state.cart;

  const [selectedMethod, setSelectedMethod] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMethod) {
      return toast.error('Please select a Payment method');
    }

    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedMethod });

    Cookies.set(
      'cart',
      JSON.stringify({
        ...state.cart,
        paymentMethod: selectedMethod,
      })
    );
    router.push('/place-order');
  };
  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping');
    }
    setSelectedMethod(paymentMethod || '');
  }, [paymentMethod, router, shippingAddress.address]);
  return (
    <Layout title="Payment">
      <BackButton url="/shipping" />
      <CheckoutWizard activeStep={2} />
      <div className="mx-auto mb-2 max-w-xl space-y-4 rounded-lg border border-slate-200 p-7 shadow-xl ">
        <h1 className="pb-3 text-5xl  font-bold">Shipping Address </h1>
        <form onSubmit={handleSubmit}>
          {['Paypal', 'Stripe', 'Cash On Delivery'].map((val, ind) => {
            return (
              <div
                key={ind}
                className="mb-5 flex items-center space-x-3 font-semibold text-slate-700 "
              >
                <input
                  type="radio"
                  id={val}
                  checked={selectedMethod === val}
                  onChange={() => setSelectedMethod(val)}
                  className="radio-primary radio  "
                  name="paymentMethod"
                />
                <label htmlFor={val}>{val}</label>
              </div>
            );
          })}
          <div className="mt-5 flex items-center justify-between space-x-3">
            <button
              type="button"
              onClick={() => router.push('/shipping')}
              className="btn flex-1 "
            >
              Back
            </button>
            <button type="submit" className="btn-primary btn flex-1">
              Next
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default PaymentScreen;
PaymentScreen.auth = true;
