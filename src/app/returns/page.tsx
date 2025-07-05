import React, { useState, useEffect } from 'react';
import { requestReturn, getReturns } from '../../services/api'; // Assuming you'll add this to api.ts
import { useAuth } from '../../context/AuthContext';

interface ReturnRequest {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  reason: string;
  status: string;
  dateRequested: string;
}

const ReturnsPage = () => {
  const { isAuthenticated } = useAuth();
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReturnOrderId, setNewReturnOrderId] = useState('');
  const [newReturnProductId, setNewReturnProductId] = useState('');
  const [newReturnReason, setNewReturnReason] = useState('');

  const fetchReturns = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedReturns = await getReturns();
      setReturnRequests(fetchedReturns as ReturnRequest[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch return requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [isAuthenticated]);

  const handleRequestReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('You must be logged in to request a return.');
      return;
    }
    if (!newReturnOrderId || !newReturnProductId || !newReturnReason) {
      setError('Please fill in all fields for the return request.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await requestReturn(parseInt(newReturnOrderId), parseInt(newReturnProductId), newReturnReason);
      setNewReturnOrderId('');
      setNewReturnProductId('');
      setNewReturnReason('');
      fetchReturns(); // Refresh the list
      alert('Return request submitted successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to submit return request.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading returns...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-full text-white">Please log in to manage your returns.</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Returns Management</h1>

      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Request a New Return</h2>
        <form onSubmit={handleRequestReturn} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="orderId" className="block text-gray-300 text-sm font-bold mb-2">Order ID</label>
            <input
              type="number"
              id="orderId"
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
              value={newReturnOrderId}
              onChange={(e) => setNewReturnOrderId(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="productId" className="block text-gray-300 text-sm font-bold mb-2">Product ID</label>
            <input
              type="number"
              id="productId"
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
              value={newReturnProductId}
              onChange={(e) => setNewReturnProductId(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="reason" className="block text-gray-300 text-sm font-bold mb-2">Reason for Return</label>
            <textarea
              id="reason"
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
              rows={3}
              value={newReturnReason}
              onChange={(e) => setNewReturnReason(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Return Request'}
          </button>
        </form>
      </div>

      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        <h2 className="text-2xl font-bold mb-6 text-white">My Return Requests</h2>
        {returnRequests.length === 0 ? (
          <p className="text-center text-gray-500">No return requests found.</p>
        ) : (
          <div className="space-y-4">
            {returnRequests.map((request) => (
              <div key={request.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">Request #{request.id}</h3>
                  <p className="text-gray-400 text-sm">Order ID: {request.orderId}</p>
                  <p className="text-gray-400 text-sm">Product: {request.productName}</p>
                  <p className="text-gray-400 text-sm">Reason: {request.reason}</p>
                  <p className="text-gray-400 text-sm">Date: {request.dateRequested}</p>
                </div>
                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${request.status === 'Approved' ? 'bg-green-600 text-white' : request.status === 'Pending' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'}`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnsPage;
