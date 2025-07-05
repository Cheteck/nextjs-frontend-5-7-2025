import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSubscribedStockAlerts, subscribeToStockAlerts } from '../../services/api';

interface StockAlert {
  id: number;
  productId: number;
  productName: string;
  status: string;
}

const StockAlertsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAlertProductId, setNewAlertProductId] = useState('');

  const fetchStockAlerts = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedAlerts = await getSubscribedStockAlerts(user.username);
      setAlerts(fetchedAlerts as StockAlert[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stock alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockAlerts();
  }, [isAuthenticated, user]);

  const handleSubscribeToAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert('You must be logged in to subscribe to stock alerts.');
      return;
    }
    if (!newAlertProductId) {
      setError('Please enter a product ID.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await subscribeToStockAlerts(parseInt(newAlertProductId), user.username);
      setNewAlertProductId('');
      fetchStockAlerts(); // Refresh the list
      alert('Subscribed to stock alerts successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe to stock alerts.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading stock alerts...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-full text-white">Please log in to manage your stock alerts.</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Stock Alerts</h1>

      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Subscribe to New Alert</h2>
        <form onSubmit={handleSubscribeToAlert}>
          <div className="mb-4">
            <label htmlFor="productId" className="block text-gray-300 text-sm font-bold mb-2">Product ID</label>
            <input
              type="number"
              id="productId"
              className="input-field"
              value={newAlertProductId}
              onChange={(e) => setNewAlertProductId(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
            disabled={loading}
          >
            {loading ? 'Subscribing...' : 'Subscribe to Alert'}
          </button>
        </form>
      </div>

      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">My Subscribed Alerts</h2>
        {alerts.length === 0 ? (
          <p className="text-center text-gray-500">You have no active stock alerts.</p>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{alert.productName}</h3>
                  <p className="text-gray-300">Product ID: {alert.productId}</p>
                  <p className="text-gray-400">Status: {alert.status}</p>
                </div>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full">
                  Unsubscribe
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAlertsPage;
