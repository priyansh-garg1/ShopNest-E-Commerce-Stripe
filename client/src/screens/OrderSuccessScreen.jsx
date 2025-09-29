import React, { useEffect, useContext, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

const OrderSuccessScreen = () => {
  const { clearCart } = useContext(CartContext);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (sessionId) {
      const fetchOrder = async () => {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/orders/session/${sessionId}`, {
            withCredentials: true,
          });
          setOrder(data);
        } catch (err) {
          setError('Could not fetch your order details. Please check "My Orders" for confirmation.');
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    } else {
      setLoading(false);
      setError('No session ID found.');
    }
  }, [sessionId]);

  const OrderDetailsSkeleton = () => (
    <div className="w-full animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const renderOrderDetails = () => {
    if (loading) return <OrderDetailsSkeleton />;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!order) return null;

    return (
      <div className="w-full text-left border-t pt-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
        <p className="text-sm text-gray-600 mb-2"><strong>Order ID:</strong> {order._id}</p>
        <p className="text-sm text-gray-600 mb-4"><strong>Total Paid:</strong> ${order.totalPrice.toFixed(2)}</p>
        <div className="space-y-2">
          {order.orderItems.map(item => (
            <div key={item.product} className="flex justify-between items-center text-sm">
              <span>{item.name} (x{item.qty})</span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center text-center bg-white p-8 sm:p-12 rounded-lg shadow-lg max-w-2xl mx-auto">
      <svg className="w-24 h-24 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Payment Successful!</h1>
      <p className="text-gray-600 mb-6">Thank you for your purchase. Your order is being processed.</p>

      {renderOrderDetails()}

      <p className="text-gray-600 mb-8">You will receive an email confirmation shortly.</p>
      <Link to="/" className="inline-block bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccessScreen;