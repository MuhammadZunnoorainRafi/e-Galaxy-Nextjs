import cartContext from '@/context/cartContext';
import Cookies from 'js-cookie';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';

function Navbar() {
  const { cartItems, dispatch } = useContext(cartContext);
  const [cartItemsNum, setCartItemsNum] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [cartMenu, setCartMenu] = useState(false);
  useEffect(() => {
    setCartItemsNum(cartItems.reduce((a, c) => a + c.quantity, 0));
    setCartTotal(cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
  }, [cartItems]);

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
  };

  const { status, data: session } = useSession();

  return (
    <>
      <div className="mx-auto flex items-center justify-between px-2 py-1 shadow-lg sm:px-5 sm:py-3 ">
        {/* logo */}
        <Link
          href="/"
          className="btn-ghost btn text-xl font-bold normal-case tracking-wider sm:text-3xl"
        >
          e-Galaxy
        </Link>

        {/*menu  */}
        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
          <div>
            <div className="dropdown-end dropdown">
              <div
                onClick={() => setCartMenu(!cartMenu)}
                tabIndex={0}
                className="btn-ghost btn-circle btn"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cartItemsNum > 0 && (
                    <span className="badge badge-sm indicator-item border-none bg-red-500">
                      {cartItemsNum}
                    </span>
                  )}
                </div>
              </div>
              <div
                tabIndex={0}
                className={` ${
                  cartMenu ? 'block' : 'hidden'
                } card dropdown-content card-compact mt-3 w-52 border border-slate-200 bg-base-100 shadow `}
              >
                <div className="card-body">
                  <p className="text-lg font-bold">
                    {' '}
                    {cartItemsNum > 0 && <span>{cartItemsNum}</span>}{' '}
                    {cartItemsNum === 0 ? '0 Item' : 'Items'}
                  </p>
                  <span className="text-info">Subtotal: ${cartTotal}</span>
                  <div className="card-actions">
                    <Link
                      href="/cart"
                      className="btn-primary btn-block btn-sm btn"
                    >
                      View cart
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {status === 'loading' ? (
            'loading...'
          ) : session?.user ? (
            <div className="dropdown-end dropdown">
              <label
                onClick={() => setShowMenu(!showMenu)}
                tabIndex={0}
                className="btn-ghost btn-sm btn sm:btn-md "
              >
                <h3 className="text-base font-bold  sm:text-lg">
                  {' '}
                  {session.user.name}
                </h3>
              </label>
              <ul
                tabIndex={0}
                className={`${
                  showMenu ? ' block' : 'hidden'
                } dropdown-content menu rounded-box menu-compact mt-3 w-52 border border-slate-300 bg-base-100 p-2 shadow`}
              >
                <li>
                  <Link href="/updateProfile">Profile</Link>
                </li>
                <li>
                  <Link href="/order-history">Order History</Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              className="rounded-lg text-base font-semibold  duration-150 hover:bg-slate-800 hover:text-slate-100 sm:px-3 sm:py-1 sm:text-lg"
              href="/login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
