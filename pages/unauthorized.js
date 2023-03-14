import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

function Unauthorized() {
  const router = useRouter();
  const { query } = router;
  return (
    <Layout title="Unauthorized">
      <div className="flex min-h-[70vh] items-center justify-center">
        <div
          className="space-y-3 rounded-lg p-4 shadow-lg
        "
        >
          <h3 className="text-4xl font-bold text-red-500">⚠️Access denied</h3>
          <div className="text-center text-lg text-slate-600">
            {query.message} required, please{' '}
            <Link
              className="link-primary link"
              href={`/${query.message}`.toLowerCase()}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Unauthorized;
