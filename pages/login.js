import Layout from '@/components/Layout';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { errorHandler } from '@/utils/errorHandler';
import { useRouter } from 'next/router';

function Input() {
  const router = useRouter();
  const { redirect } = router.query;

  const [inputText, setInputText] = useState({
    email: '',
    password: '',
  });
  const { email, password } = inputText;

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [session, router, redirect]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputText({ ...inputText, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        return toast.error(result.error);
      } else {
        router.push(`/login?redirect=${redirect || '/'}`);
      }
    } catch (error) {
      toast.error(errorHandler(error));
    }
  };

  return (
    <Layout title="Login">
      <div className="mx-auto max-w-xl ">
        <form
          onSubmit={handleSubmit}
          className="form-control space-y-4 rounded-lg border border-slate-200 p-7 shadow-xl "
        >
          <h1 className="pb-3 text-5xl font-bold">Login </h1>
          <input
            className="input-group-md input-bordered input"
            placeholder="Email"
            type="email"
            id="email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            required
            onChange={handleInputChange}
            value={inputText.email}
          />
          <input
            className="input-group-md input-bordered input"
            placeholder="Password"
            id="password"
            required
            value={inputText.password}
            onChange={handleInputChange}
            type="password"
          />
          <button type="submit" className="btn-primary  btn">
            Login
          </button>
          <div className="flex space-x-2">
            <p>Don&apos;t have an account? </p>{' '}
            <Link href="/register" className=" link-primary link ">
              Register
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Input;
