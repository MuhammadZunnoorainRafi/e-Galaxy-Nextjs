import Link from 'next/link';
import React from 'react';

function BackButton({ url }) {
  return (
    <div className=" mb-3">
      <Link className="btn  btn-sm w-24 bg-black text-white" href={url}>
        Back
      </Link>
    </div>
  );
}

export default BackButton;
