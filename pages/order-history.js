import Layout from '@/components/Layout';
import Spinner from '@/components/Spinner';

import { errorHandler } from '@/utils/errorHandler';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function OrderHistory() {
  // const { dispatch, loading, order } = useContext(OrderScreenContext);
  const [{ loading, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: errorHandler(error) });
      }
    };
    fetchOrders();
  }, [dispatch]);
  if (loading) {
    return <Spinner />;
  }
  return (
    <Layout title="Order-History">
      <h1 className="ml-2 pb-3 text-5xl font-bold">Order History</h1>
      <div className=" overflow-x-auto">
        <table className="min-w-full ">
          <thead>
            <tr className="border-b ">
              <th className="p-2 text-left font-bold sm:p-5">ID</th>
              <th className="p-2 text-left font-bold sm:p-5">DATE</th>
              <th className="p-2 text-left font-bold sm:p-5">TOTAL</th>
              <th className="p-2 text-left font-bold sm:p-5">PAID</th>
              <th className="p-2 text-left font-bold sm:p-5">DELIVERED</th>
              <th className="p-2 text-left font-bold sm:p-5">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((val, ind) => {
              return (
                <tr key={ind} className="border-b">
                  <td className=" p-5 ">{val._id.substring(20, 24)}</td>
                  <td className=" p-5 ">{val.createdAt.substring(0, 10)}</td>
                  <td className=" p-5 ">${val.totalPrice}</td>
                  <td className=" p-5 ">{val.isPaid ? `Paid` : 'Not Paid'}</td>
                  <td className=" p-5 ">
                    {val.isDelivered
                      ? `${val.deliveredAt.substring(0, 10)}`
                      : 'not delivered'}
                  </td>
                  <td className=" p-5 ">
                    <Link
                      href={`/order/${val._id}`}
                      className=" link-primary link"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
OrderHistory.auth = true;
export default OrderHistory;
