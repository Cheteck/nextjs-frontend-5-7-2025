import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getLoyaltyStatus, getShopLoyaltyStatus } from '../../services/api';

interface LoyaltyStatus {
  points: number;
  tier: string;
  benefits: string[];
}

interface ShopLoyaltyStatus {
  shopName: string;
  points: number;
  tier: string;
  benefits: string[];
}

const LoyaltyPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [globalLoyalty, setGlobalLoyalty] = useState<LoyaltyStatus | null>(null);
  const [shopLoyalties, setShopLoyalties] = useState<ShopLoyaltyStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const globalStatus = await getLoyaltyStatus(user.username);
        setGlobalLoyalty(globalStatus as LoyaltyStatus);

        const shopStatuses = await getShopLoyaltyStatus(user.username);
        setShopLoyalties(shopStatuses as ShopLoyaltyStatus[]);

      } catch (err: any) {
        setError(err.message || 'Failed to fetch loyalty data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoyaltyData();
  }, [isAuthenticated, user]);

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading loyalty data...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-full text-white">Please log in to view your loyalty status.</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">My Loyalty Programs</h1>

      {globalLoyalty && (
        <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Global Loyalty Status</h2>
          <p className="text-gray-300 mb-2 text-lg">Points: <span className="font-bold text-green-400">{globalLoyalty.points}</span></p>
          <p className="text-gray-300 mb-2 text-lg">Tier: <span className="font-bold text-blue-400">{globalLoyalty.tier}</span></p>
          <h3 className="font-bold mt-6 mb-3 text-white">Benefits:</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {globalLoyalty.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        <h2 className="text-2xl font-bold mb-4 text-white">Shop Specific Loyalties</h2>
        {shopLoyalties.length === 0 ? (
          <p className="text-gray-500">No shop specific loyalty programs yet.</p>
        ) : (
          <div className="space-y-6">
            {shopLoyalties.map((shopLoyalty) => (
              <div key={shopLoyalty.shopName} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold mb-2 text-white">{shopLoyalty.shopName}</h3>
                <p className="text-gray-300 mb-1">Points: <span className="font-bold text-green-400">{shopLoyalty.points}</span></p>
                <p className="text-gray-300 mb-1">Tier: <span className="font-bold text-blue-400">{shopLoyalty.tier}</span></p>
                <h4 className="font-bold mt-4 mb-2 text-white">Benefits:</h4>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  {shopLoyalty.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyPage;
