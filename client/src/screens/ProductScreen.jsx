import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CartContext } from '../context/CartContext';

const StarRating = ({ rating }) => {
  const stars = [];
  const roundedRating = Math.round(rating);

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
    stars.push(<span key={`full_${i}`} className="text-yellow-400 text-xl">&#9733;</span>);
    } else {
      stars.push(<span key={`empty_${i}`} className="text-gray-300 text-xl">&#9734;</span>);
    }
  }

  return <div className="flex items-center">{stars}</div>;
};

function ProductScreen() {
  const { addToCart } = useContext(CartContext);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`https://dummyjson.com/products/${id}`);
        setProduct(data);
        setSelectedImage(data.thumbnail);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Loading product...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-20">Product not found.</div>;
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          <div className="mb-4 overflow-hidden rounded-lg">
            <img src={selectedImage} alt={product.title} className="w-full h-96 object-cover rounded-lg transform hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="flex space-x-2">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.title} - view ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer ring-2 ${selectedImage === img ? 'ring-indigo-500' : 'ring-transparent'}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <p className="text-indigo-500 font-semibold uppercase tracking-wide">{product.brand}</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-1 mb-3">{product.title}</h1>
          <div className="mb-4">
            <StarRating rating={product.rating} />
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-900">${discountedPrice.toFixed(2)}</span>
            <span className="text-xl text-gray-500 line-through ml-3">${product.price.toFixed(2)}</span>
            <span className="ml-3 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {product.discountPercentage.toFixed(0)}% OFF
            </span>
          </div>

          <div className="mb-6">
            <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.availabilityStatus} ({product.stock} left)
            </span>
          </div>

          {/* Add to Cart */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50" disabled={quantity <= 1}>-</button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-16 text-center border-l border-r focus:outline-none"
              />
              <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-50" disabled={quantity >= product.stock}>+</button>
            </div>
            <button
              onClick={() => {
                addToCart(product, quantity);
              }}
              className="flex-grow flex items-center justify-center bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-600 transition-colors duration-300 text-lg"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;