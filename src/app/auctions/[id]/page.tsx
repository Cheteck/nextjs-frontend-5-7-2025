import React, { useEffect, useState } from 'react';
import { getAuctionDetails, placeBid } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

interface AuctionDetailProps {
  params: { id: string };
}

interface Auction {
  id: number;
  name: string;
  description: string;
  currentBid: number;
  endTime: string;
  image: string;
  bidHistory: { bidder: string; amount: number; time: string }[];
}

const AuctionDetailPage: React.FC<AuctionDetailProps> = ({ params }) => {
  const { id } = params;
  const { isAuthenticated, user } = useAuth();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');

  useEffect(() => {
    const fetchAuction = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedAuction = await getAuctionDetails(parseInt(id));
        setAuction(fetchedAuction as Auction);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch auction details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id]);

  const handlePlaceBid = async () => {
    if (!isAuthenticated || !user) {
      alert('You must be logged in to place a bid.');
      return;
    }
    if (!bidAmount || parseFloat(bidAmount) <= (auction?.currentBid || 0)) {
      alert('Please enter a valid bid amount higher than the current bid.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await placeBid(auction!.id, parseFloat(bidAmount), user.username);
      alert('Bid placed successfully!');
      // Refresh auction details to show new bid
      const updatedAuction = await getAuctionDetails(auction!.id);
      setAuction(updatedAuction as Auction);
      setBidAmount('');
    } catch (err: any) {
      setError(err.message || 'Failed to place bid.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading auction details...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;
  }

  if (!auction) {
    return <div className="text-white">Auction not found.</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">{auction.name}</h1>

      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        <img src={auction.image} alt={auction.name} className="w-full h-96 object-cover rounded-xl shadow-lg mb-8 border border-gray-700" />

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Description</h2>
          <p className="text-gray-300 leading-relaxed">{auction.description}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Current Bid: <span className="text-green-400">${auction.currentBid.toFixed(2)}</span></h2>
          <p className="text-gray-400 text-sm">Ends: {new Date(auction.endTime).toLocaleString()}</p>
        </div>

        {isAuthenticated && (
          <div className="mb-8 p-6 border border-gray-700/50 rounded-xl bg-gray-800/50">
            <h2 className="text-xl font-bold mb-4 text-white">Place a Bid</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="number"
                step="0.01"
                placeholder="Your bid amount"
                className="w-full sm:flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                disabled={loading}
              />
              <button
                onClick={handlePlaceBid}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105"
                disabled={loading}
              >
                Place Bid
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Bid History</h2>
          {auction.bidHistory.length === 0 ? (
            <p className="text-gray-500">No bids yet.</p>
          ) : (
            <ul className="space-y-4">
              {auction.bidHistory.map((bid, index) => (
                <li key={index} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700">
                  <p className="text-white"><span className="font-bold text-blue-400">{bid.bidder}</span> bid <span className="text-green-400 font-bold">${bid.amount.toFixed(2)}</span></p>
                  <p className="text-gray-400 text-sm">{new Date(bid.time).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailPage;
