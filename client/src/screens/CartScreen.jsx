import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function CartScreen() {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
          <Link to="/" className="mt-4 inline-block bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover object-center" />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link to={`/product/${item.id}`}>{item.title}</Link>
                        </h3>
                        <p className="ml-4">${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button onClick={() => updateQuantity(item, item.qty - 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100">-</button>
                        <span className="w-12 text-center text-sm">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item, item.qty + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          disabled={item.qty >= item.stock}
                        >+</button>
                      </div>

                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item)}
                          className="font-medium text-indigo-500 hover:text-indigo-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <p className="text-base font-medium text-gray-900">Order total</p>
                  <p className="text-base font-medium text-gray-900">${subtotal.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-600"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartScreen