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
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">My Loyalty Programs</h1>

      {globalLoyalty && (
        <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Global Loyalty Status</h2>
          <p className="text-gray-300 mb-2">Points: <span className="font-bold text-green-400">{globalLoyalty.points}</span></p>
          <p className="text-gray-300 mb-2">Tier: <span className="font-bold text-blue-400">{globalLoyalty.tier}</span></p>
          <h3 className="font-bold mt-4 mb-2">Benefits:</h3>
          <ul className="list-disc list-inside text-gray-300">
            {globalLoyalty.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Shop Specific Loyalties</h2>
        {shopLoyalties.length === 0 ? (
          <p className="text-gray-500">No shop specific loyalty programs yet.</p>
        ) : (
          <div className="space-y-6">
            {shopLoyalties.map((shopLoyalty) => (
              <div key={shopLoyalty.shopName} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{shopLoyalty.shopName}</h3>
                <p className="text-gray-300 mb-1">Points: <span className="font-bold text-green-400">{shopLoyalty.points}</span></p>
                <p className="text-gray-300 mb-1">Tier: <span className="font-bold text-blue-400">{shopLoyalty.tier}</span></p>
                <h4 className="font-bold mt-2 mb-1">Benefits:</h4>
                <ul className="list-disc list-inside text-gray-300 text-sm">
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
