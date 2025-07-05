import React from 'react';
import { useCart } from '../../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-700/50">
          <p className="mb-6 text-lg">Your cart is empty. Time to fill it with amazing deals!</p>
          <Link href="/explore" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.variationId || 'no-var'}-${item.sellerId || 'no-seller'}`} className="flex items-center justify-between border-b border-gray-700/50 py-6 last:border-b-0">
              <div className="flex items-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-lg mr-6 object-cover shadow-md border border-gray-700"
                />
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{item.name}</h2>
                  <p className="text-green-400 font-semibold text-lg">${item.price.toFixed(2)}</p>
                  {item.variationId && <p className="text-gray-400 text-sm">Variation ID: {item.variationId}</p>}
                  {item.sellerId && <p className="text-gray-400 text-sm">Seller ID: {item.sellerId}</p>}
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value), item.variationId, item.sellerId)}
                  className="w-20 p-2 rounded-lg bg-gray-800 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4 border border-gray-700"
                />
                <button
                  onClick={() => removeFromCart(item.id, item.variationId, item.sellerId)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full transition-all duration-200 hover:scale-105"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700/50">
            <h2 className="text-3xl font-bold text-white">Total:</h2>
            <p className="text-green-400 text-3xl font-bold">${getTotalPrice().toFixed(2)}</p>
          </div>
          <div className="mt-8 text-right">
            <Link href="/checkout" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 hover:scale-105">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
