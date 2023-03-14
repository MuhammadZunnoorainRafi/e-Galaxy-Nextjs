import Layout from '@/components/Layout';

import { errorHandler } from '@/utils/errorHandler';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

function Register() {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;
  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const formSubmit = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(errorHandler(error));
    }
  };

  return (
    <Layout title="Register">
      <div className="mx-auto max-w-xl ">
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="form-control space-y-4 rounded-lg border border-slate-200 p-7 shadow-xl "
        >
          <h1 className="pb-3 text-5xl font-bold">Create Account </h1>
          <div>
            <input
              type="text"
              placeholder="Name"
              className="register-form"
              {...register('name', { required: 'Please Enter Your Name' })}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <input
              className="register-form"
              placeholder="Email"
              {...register('email', {
                required: 'Please Enter Email',
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: 'Please Enter Valid Email',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              className="register-form"
              placeholder="Password"
              {...register('password', {
                required: 'Please Enter Password',
                minLength: {
                  value: 6,
                  message: 'Password is more than 5 chars',
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="register-form"
              {...register('password2', {
                validate: (value) => value === getValues('password'),
                required: 'Please Enter Confirm Password',
                minLength: {
                  value: 1,
                },
              })}
            />

            {errors.password2 && errors.password2.type === 'validate' && (
              <p className="text-red-500">Password do not match</p>
            )}
          </div>

          <button type="submit" className="btn-primary  btn">
            Register
          </button>
          <div className="flex space-x-2">
            <p>Have an account? </p>{' '}
            <Link href="/login" className=" link-primary link ">
              Login
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Register;
