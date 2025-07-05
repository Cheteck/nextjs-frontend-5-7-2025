import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAuctions } from '../../services/api';

interface Auction {
  id: number;
  name: string;
  currentBid: number;
  endTime: string;
  image: string;
}

const AuctionsPage = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedAuctions = await getAuctions();
        setAuctions(fetchedAuctions as Auction[]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch auctions.');
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading auctions...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Live Auctions</h1>

      {auctions.length === 0 ? (
        <p className="text-center text-gray-500">No active auctions at the moment.</p>
      ) : (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <Link href={`/auctions/${auction.id}`} key={auction.id}>
              <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300">
                <img src={auction.image} alt={auction.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{auction.name}</h2>
                  <p className="text-gray-400">Current Bid: <span className="text-green-400 font-bold">${auction.currentBid.toFixed(2)}</span></p>
                  <p className="text-gray-400 text-sm">Ends: {new Date(auction.endTime).toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuctionsPage;
