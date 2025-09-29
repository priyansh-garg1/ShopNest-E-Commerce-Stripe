import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import CategorySkeleton from '../components/CategorySkeleton';

function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categorySlugs } = await axios.get('https://dummyjson.com/products/category-list');
        
        const categoryData = await Promise.all(
          categorySlugs.map(async (slug) => {
            const { data: productData } = await axios.get(`https://dummyjson.com/products/category/${slug}?limit=1`);
            return {
              slug,
              name: slug.replace(/-/g, ' '),
              image: productData.products[0]?.thumbnail || 'https://via.placeholder.com/100',
            };
          })
        );
        setCategories(categoryData);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = selectedCategory
          ? `https://dummyjson.com/products/category/${selectedCategory}`
          : 'https://dummyjson.com/products';
        const { data } = await axios.get(url);
        setProducts(data.products);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Featured Products</h1>
      <div className="flex items-center justify-center mb-8">
        <button onClick={() => scroll('left')} className="flex-shrink-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <div ref={scrollContainerRef} className="flex-1 flex items-center space-x-4 overflow-x-auto py-2 scrollbar-hide mx-2">
          {categoriesLoading ? (
            Array.from({ length: 10 }).map((_, index) => <CategorySkeleton key={index} />)
          ) : (
            <>
              <div className="flex flex-col items-center space-y-1 flex-shrink-0 text-center w-16">
                <button onClick={() => setSelectedCategory(null)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${!selectedCategory ? 'bg-indigo-500 text-white ring-2 ring-offset-2 ring-indigo-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                  All
                </button>
                <span className="text-xs font-medium text-gray-600 capitalize truncate w-full">All</span>
              </div>
              {categories.map((category) => (
                <div key={category.slug} className="flex flex-col items-center space-y-1 flex-shrink-0 text-center w-16">
                  <button 
                    onClick={() => setSelectedCategory(category.slug)} 
                    className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${selectedCategory === category.slug ? 'border-indigo-500 ring-2 ring-offset-2 ring-indigo-500' : 'border-transparent'}`}
                  >
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <span className="text-xs font-medium text-gray-600 capitalize truncate w-full">{category.name}</span>
                </div>
              ))}
            </>
          )}
        </div>
        <button onClick={() => scroll('right')} className="flex-shrink-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomeScreen;