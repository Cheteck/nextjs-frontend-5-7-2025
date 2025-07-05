import React, { useEffect, useState } from 'react';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/ProductCard';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
}

const ExplorePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Garden', 'Books'];

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts({
        searchTerm,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      });
      setProducts(data as Product[]);
    } catch (err) {
      setError('Failed to fetch products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, minPrice, maxPrice]);

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading products...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Explore Products</h1>

      {/* Search and Filter Bar */}
      <div className="w-full bg-gray-900 p-6 rounded-xl shadow-xl mb-8 border border-gray-700">
        <input
          type="text"
          placeholder="Search products, categories, brands..."
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="category" className="block text-gray-300 text-sm font-bold mb-2">Category</label>
            <select
              id="category"
              className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="minPrice" className="block text-gray-300 text-sm font-bold mb-2">Min Price</label>
            <input
              type="number"
              id="minPrice"
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-gray-300 text-sm font-bold mb-2">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="w-full bg-gray-900 p-6 rounded-xl shadow-xl mb-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No products found matching your criteria.</p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
              />
            ))
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="w-full bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.filter(cat => cat !== 'All').map((category) => (
            <div key={category} className="bg-gray-800 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg">
              <p className="font-bold text-white">{category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
