import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';

interface ProductDetailProps {
  params: { id: string };
}

const ProductDetailPage: React.FC<ProductDetailProps> = ({ params }) => {
  const { id } = params;
  const [selectedVariation, setSelectedVariation] = useState<number | null>(null);
  const { addToCart } = useCart();

  // Mock product data (replace with actual API call later)
  const product = {
    id: parseInt(id),
    name: `Product ${id}`,
    description: `This is a detailed description for Product ${id}. It's an amazing item with many features and benefits. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget consectetur tempor, nisl nunc euismod nisi, eu consectetur nisl nisi euismod nisi.`, 
    longDescription: `This is a longer, more detailed description for Product ${id}. It covers all the intricate details, specifications, and use cases. It's designed to provide a comprehensive understanding of the product, ensuring customers have all the information they need before making a purchase.`, 
    images: [
      `https://via.placeholder.com/600x400?text=Product+${id}+Image+1`,
      `https://via.placeholder.com/600x400?text=Product+${id}+Image+2`,
      `https://via.placeholder.com/600x400?text=Product+${id}+Image+3`,
    ],
    variations: [
      { id: 1, name: 'Small', price: 10.00, stock: 50 },
      { id: 2, name: 'Medium', price: 12.00, stock: 75 },
      { id: 3, name: 'Large', price: 15.00, stock: 30 },
    ],
    sellers: [
      { id: 1, name: 'Shop A', price: 11.00, stock: 20 },
      { id: 2, name: 'Shop B', price: 10.50, stock: 40 },
    ],
    reviews: [
      { id: 1, author: 'Alice', rating: 5, comment: 'Great product, highly recommend!' },
      { id: 2, author: 'Bob', rating: 4, comment: 'Good quality, but a bit pricey.' },
    ],
    relatedProducts: [
      { id: 101, name: 'Related Product 1', image: 'https://via.placeholder.com/100', price: '25.00' },
      { id: 102, name: 'Related Product 2', image: 'https://via.placeholder.com/100', price: '35.00' },
    ],
  };

  if (!product) {
    return <div className="text-white">Product not found.</div>;
  }

  const handleAddToCart = (sellerId: number) => {
    const seller = product.sellers.find(s => s.id === sellerId);
    let itemToAdd = null;

    if (product.variations.length > 0) {
      const variation = product.variations.find(v => v.id === selectedVariation);
      if (!variation) {
        alert('Please select a variation.');
        return;
      }
      itemToAdd = {
        id: product.id,
        name: `${product.name} (${variation.name})`,
        price: variation.price,
        image: product.images[0],
        variationId: variation.id,
        sellerId: sellerId,
      };
    } else {
      itemToAdd = {
        id: product.id,
        name: product.name,
        price: seller ? seller.price : parseFloat(product.sellers[0].price.toString()), // Use seller price if available, otherwise default to first seller's price
        image: product.images[0],
        sellerId: sellerId,
      };
    }

    if (itemToAdd) {
      addToCart(itemToAdd, 1);
      alert(`Added ${itemToAdd.name} to cart!`);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

      <div className="w-full max-w-5xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        {/* Product Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} Image ${index + 1}`}
              className="w-full h-64 object-cover rounded-xl shadow-lg border border-gray-700"
            />
          ))}
        </div>

        {/* Product Description */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Description</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">{product.description}</p>
          <p className="text-gray-400 leading-relaxed">{product.longDescription}</p>
        </div>

        {/* Product Variations */}
        {product.variations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Variations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {product.variations.map((variation) => (
                <div
                  key={variation.id}
                  className={`bg-gray-800 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700 ${selectedVariation === variation.id ? 'border-2 border-blue-500 shadow-md' : 'border border-gray-700'}`}
                  onClick={() => setSelectedVariation(variation.id)}
                >
                  <p className="font-bold text-white text-lg">{variation.name}</p>
                  <p className="text-green-400 font-semibold text-xl">${variation.price.toFixed(2)}</p>
                  <p className="text-gray-400 text-sm">Stock: {variation.stock}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sellers Offering This Product */}
        {product.sellers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Sellers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.sellers.map((seller) => (
                <div key={seller.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700">
                  <div>
                    <p className="font-bold text-white text-lg">{seller.name}</p>
                    <p className="text-gray-400 text-sm">Stock: {seller.stock}</p>
                  </div>
                  <p className="text-green-400 text-2xl font-bold">${seller.price.toFixed(2)}</p>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full transition-all duration-200 hover:scale-105"
                    onClick={() => handleAddToCart(seller.id)}
                    disabled={product.variations.length > 0 && selectedVariation === null}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
            {product.variations.length > 0 && selectedVariation === null && (
              <p className="text-red-400 text-sm mt-4 text-center">Please select a variation before adding to cart.</p>
            )}
          </div>
        )}

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Customer Reviews</h2>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <p className="font-bold text-white mb-1">{review.author} - Rating: <span className="text-yellow-400">{review.rating}/5</span></p>
                  <p className="text-gray-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products Section */}
        {product.relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.relatedProducts.map((related) => (
                <div key={related.id} className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700 transition-all duration-200 hover:shadow-lg">
                  <img src={related.image} alt={related.name} className="w-full h-32 object-cover mb-3 rounded-lg shadow-md" />
                  <p className="font-bold text-white mb-1">{related.name}</p>
                  <p className="text-green-400 font-semibold">${related.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
