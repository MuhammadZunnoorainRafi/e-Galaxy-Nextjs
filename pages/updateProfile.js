import Layout from '@/components/Layout';

import { errorHandler } from '@/utils/errorHandler';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';

import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

function UpdateProfile() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue('name', session.user.name);
    setValue('email', session.user.email);
  }, [session.user, setValue]);
  const formSubmit = async ({ name, email, password }) => {
    try {
      await axios.put('/api/auth/update', {
        name,
        email,
        password,
      });

      await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      router.push('/');
      toast.success('Updated Successfully');
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
          <h1 className="pb-3 text-5xl font-bold">Update Profile </h1>
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
              className="register-form  "
              type="text"
              placeholder="Email"
              {...register('email', { required: 'Please Enter Your Email' })}
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
            Update Profile
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default UpdateProfile;
UpdateProfile.auth = true;
