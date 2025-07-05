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
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">{auction.name}</h1>

      <div className="w-full max-w-4xl bg-gray-900 p-6 rounded-lg shadow-lg">
        <img src={auction.image} alt={auction.name} className="w-full h-80 object-cover rounded-lg mb-6" />

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Description</h2>
          <p className="text-gray-300">{auction.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Current Bid: <span className="text-green-400">${auction.currentBid.toFixed(2)}</span></h2>
          <p className="text-gray-400">Ends: {new Date(auction.endTime).toLocaleString()}</p>
        </div>

        {isAuthenticated && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Place a Bid</h2>
            <div className="flex">
              <input
                type="number"
                step="0.01"
                placeholder="Your bid amount"
                className="input-field flex-1 mr-2"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                disabled={loading}
              />
              <button
                onClick={handlePlaceBid}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
                disabled={loading}
              >
                Place Bid
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Bid History</h2>
          {auction.bidHistory.length === 0 ? (
            <p className="text-gray-500">No bids yet.</p>
          ) : (
            <ul className="space-y-2">
              {auction.bidHistory.map((bid, index) => (
                <li key={index} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                  <p><span className="font-bold">{bid.bidder}</span> bid <span className="text-green-400">${bid.amount.toFixed(2)}</span></p>
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
