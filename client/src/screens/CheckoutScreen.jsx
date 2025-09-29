import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function CheckoutScreen() {
  const { cartItems } = useContext(CartContext);
  const { userInfo } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userInfo) {
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required to proceed.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/orders/create-checkout-session',
        { cartItems, email },
        { withCredentials: true }
      );

      window.location.href = data.url;
    } catch (err) {
      const message = err.response?.data?.message || 'Could not initiate payment. Please try again.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded-md mr-4" />
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-6 pt-6">
            <div className="flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Information</h2>
          <form onSubmit={handleCheckout}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="you@example.com" />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <p className="text-sm text-gray-500 mb-4">You will be redirected to Stripe to complete your payment securely.</p>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:bg-indigo-300 transition-colors">
              {loading ? 'Processing...' : `Pay $${subtotal.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutScreen
