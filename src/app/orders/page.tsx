import React, { useEffect, useState } from 'react';
import { getOrders } from '../../services/api'; // Assuming you'll add this to api.ts
import { useAuth } from '../../context/AuthContext';

interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders as Order[]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading orders...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-full text-white">Please log in to view your orders.</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
          {orders.map((order) => (
            <div key={order.id} className="border-b border-gray-700/50 pb-6 mb-6 last:border-b-0 last:mb-0">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-white">Order #{order.id}</h2>
                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${order.status === 'Delivered' ? 'bg-green-600 text-white' : order.status === 'Pending' ? 'bg-yellow-600 text-white' : 'bg-blue-600 text-white'}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">Date: {order.date}</p>
              <p className="text-gray-400 text-sm mb-3">Total: <span className="font-bold text-green-400">${order.total.toFixed(2)}</span></p>
              <h3 className="font-bold text-white mb-2">Items:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {order.items.map((item) => (
                  <li key={item.productId}>{item.name} (x{item.quantity}) - <span className="text-green-400">${item.price.toFixed(2)}</span> each</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
