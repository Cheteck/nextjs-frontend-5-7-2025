import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import { placeOrder } from '../../services/api'; // Assuming you'll add this to api.ts

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const router = useRouter();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingInfo((prevInfo) => ({
      ...prevInfo,
      [id]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    // Basic validation
    const { fullName, address, city, zipCode, country } = shippingInfo;
    if (!fullName || !address || !city || !zipCode || !country) {
      setError('Please fill in all shipping information fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderDetails = {
        items: cartItems,
        shippingInfo,
        total: getTotalPrice(),
      };
      await placeOrder(orderDetails);
      clearCart();
      alert('Order placed successfully!');
      router.push('/'); // Redirect to home or order confirmation page
    } catch (err: any) {
      setError(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Checkout</h1>

      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        <h2 className="text-2xl font-bold mb-6 text-white">Shipping Information</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="fullName" className="block text-gray-300 text-sm font-bold mb-2">Full Name</label>
            <input type="text" id="fullName" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" value={shippingInfo.fullName} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-300 text-sm font-bold mb-2">Address</label>
            <input type="text" id="address" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" value={shippingInfo.address} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="city" className="block text-gray-300 text-sm font-bold mb-2">City</label>
            <input type="text" id="city" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" value={shippingInfo.city} onChange={handleInputChange} required />
          </div>
          <div>
            <label htmlFor="zipCode" className="block text-gray-300 text-sm font-bold mb-2">Zip Code</label>
            <input type="text" id="zipCode" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" value={shippingInfo.zipCode} onChange={handleInputChange} required />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="country" className="block text-gray-300 text-sm font-bold mb-2">Country</label>
            <input type="text" id="country" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" value={shippingInfo.country} onChange={handleInputChange} required />
          </div>
        </form>

        <h2 className="text-2xl font-bold mb-4 text-white">Order Summary</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">No items in cart.</p>
        ) : (
          <div className="mb-8">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.variationId || 'no-var'}-${item.sellerId || 'no-seller'}`} className="flex justify-between items-center py-3 border-b border-gray-700/50 last:border-b-0">
                <p className="text-white text-lg">{item.name} (x{item.quantity})</p>
                <p className="text-green-400 text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-700/50">
              <p className="text-white text-2xl font-bold">Total:</p>
              <p className="text-green-400 text-3xl font-bold">${getTotalPrice().toFixed(2)}</p>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105"
          disabled={loading || cartItems.length === 0}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
