import React from 'react';
import { Link } from 'react-router-dom';

const OrderFailedScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-white p-8 sm:p-12 rounded-lg shadow-lg max-w-2xl mx-auto">
      <svg className="w-24 h-24 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Payment Canceled</h1>
      <p className="text-gray-600 mb-8">Your order was not completed. You can return to your cart to try again.</p>
      <Link to="/cart" className="inline-block bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
        Return to Cart
      </Link>
    </div>
  );
};

export default OrderFailedScreen;
