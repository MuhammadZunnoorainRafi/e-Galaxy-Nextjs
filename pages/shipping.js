import BackButton from '@/components/BackButton';
import CheckoutWizard from '@/components/CheckoutWizard';
import Layout from '@/components/Layout';
import CartContext from '@/context/cartContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';

function ShippingScreen() {
  const router = useRouter();
  const { dispatch, state } = useContext(CartContext);
  const { shippingAddress } = state.cart;
  const {
    handleSubmit,

    register,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('city', shippingAddress.city);
    setValue('country', shippingAddress.country);
  }, [shippingAddress, setValue]);

  const formSubmit = ({ fullName, address, postalCode, country, city }) => {
    Cookies.set(
      'cart',
      JSON.stringify({
        ...state.cart,
        shippingAddress: {
          fullName,
          address,
          postalCode,
          city,
          country,
        },
      })
    );

    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, postalCode, country, city, location },
    });
    router.push('/payment');
  };
  return (
    <Layout title="Shipping">
      <BackButton url="/cart" />
      <CheckoutWizard activeStep={1} />
      <div className="mx-auto mb-2 max-w-xl space-y-4 rounded-lg border border-slate-200 p-7 shadow-xl ">
        <h1 className="pb-3 text-5xl font-bold">Shipping Address </h1>
        <form
          onSubmit={handleSubmit(formSubmit)}
          className=" form-control space-y-4"
        >
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className=" shipping-form "
              {...register('fullName', { required: 'Please enter full name' })}
            />
            {errors.fullName && (
              <p className="text-red-500">{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              className="shipping-form"
              placeholder="Address"
              {...register('address', {
                required: 'Please enter address',
                minLength: {
                  value: 3,
                  message: 'Address should be more than 2 chars',
                },
              })}
            />
            {errors.address && (
              <p className="text-red-500 ">{errors.address.message}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              className="shipping-form"
              placeholder="City"
              {...register('city', { required: 'Please enter city' })}
            />
            {errors.city && (
              <p className="text-red-500">{errors.city.message}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              placeholder="Postal Code"
              className="shipping-form"
              {...register('postalCode', {
                required: 'Please enter postal code',
              })}
            />
            {errors.postalCode && (
              <p className="text-red-500">{errors.postalCode.message}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              className="shipping-form"
              placeholder="Country"
              {...register('country', { required: 'Please enter country' })}
            />
            {errors.country && (
              <p className="text-red-500">{errors.country.message}</p>
            )}
          </div>
          <button className=" btn-primary btn" type="submit">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default ShippingScreen;
ShippingScreen.auth = true;
