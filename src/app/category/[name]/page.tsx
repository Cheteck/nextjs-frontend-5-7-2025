import React, { useEffect, useState } from 'react';
import { getProductsByCategory } from '../../../services/api';
import ProductCard from '../../../components/ProductCard';

interface CategoryPageProps {
  params: { name: string };
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
  const { name } = params;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductsByCategory(name);
        setProducts(data as Product[]);
      } catch (err) {
        setError(`Failed to fetch products for category: ${name}.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [name]);

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading products...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Category: {decodeURIComponent(name)}</h1>

      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700/50">
        <h2 className="text-2xl font-bold mb-4 text-white">Products in this Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No products found in this category.</p>
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
    </div>
  );
};

export default CategoryPage;
