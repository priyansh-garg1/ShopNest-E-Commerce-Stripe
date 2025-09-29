import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const renderStars = (rating) => {
    const roundedRating = Math.round(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<span key={i} className="text-yellow-400">&#9733;</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">&#9734;</span>);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      <Link to={`/product/${product.id}`} className="block">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          <Link to={`/product/${product.id}`} className="hover:text-indigo-500">
            {product.title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mt-1 capitalize">{product.category}</p>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <Link
            to={`/product/${product.id}`}
            className="bg-indigo-500 text-white text-sm text-center px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
