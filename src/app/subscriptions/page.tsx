import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSubscriptions, subscribeToPlan, cancelSubscription } from '../../services/api';

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  features: string[];
}

interface UserSubscription {
  id: number;
  planName: string;
  status: string; // e.g., 'Active', 'Cancelled', 'Expired'
  startDate: string;
  endDate: string;
}

const SubscriptionsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [plans, subscriptions] = await Promise.all([
          getAvailableSubscriptionPlans(),
          getSubscriptions(user.username),
        ]);
        setAvailablePlans(plans as SubscriptionPlan[]);
        setUserSubscriptions(subscriptions as UserSubscription[]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch subscription data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const handleSubscribe = async (planId: number) => {
    if (!isAuthenticated || !user) {
      alert('Please log in to subscribe.');
      return;
    }
    if (!confirm('Are you sure you want to subscribe to this plan?')) return;

    setLoading(true);
    setError(null);
    try {
      await subscribeToPlan(user.username, planId);
      alert('Subscription successful!');
      // Refresh data
      const [plans, subscriptions] = await Promise.all([
        getAvailableSubscriptionPlans(),
        getSubscriptions(user.username),
      ]);
      setAvailablePlans(plans as SubscriptionPlan[]);
      setUserSubscriptions(subscriptions as UserSubscription[]);
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: number) => {
    if (!isAuthenticated || !user) {
      alert('Please log in to manage subscriptions.');
      return;
    }
    if (!confirm('Are you sure you want to cancel this subscription?')) return;

    setLoading(true);
    setError(null);
    try {
      await cancelSubscription(user.username, subscriptionId);
      alert('Subscription cancelled successfully!');
      // Refresh data
      const [plans, subscriptions] = await Promise.all([
        getAvailableSubscriptionPlans(),
        getSubscriptions(user.username),
      ]);
      setAvailablePlans(plans as SubscriptionPlan[]);
      setUserSubscriptions(subscriptions as UserSubscription[]);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading subscriptions...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-full text-white">Please log in to manage your subscriptions.</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>

      {/* Available Plans */}
      <div className="w-full max-w-4xl bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        {availablePlans.length === 0 ? (
          <p className="text-gray-500">No subscription plans available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePlans.map((plan) => (
              <div key={plan.id} className="bg-gray-800 p-4 rounded-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-green-400 text-2xl font-bold mb-2">${plan.price.toFixed(2)}/month</p>
                  <ul className="list-disc list-inside text-gray-300 text-sm mb-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full mt-4"
                  disabled={loading}
                >
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Your Current Subscriptions */}
      <div className="w-full max-w-4xl bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Your Subscriptions</h2>
        {userSubscriptions.length === 0 ? (
          <p className="text-gray-500">You have no active subscriptions.</p>
        ) : (
          <div className="space-y-4">
            {userSubscriptions.map((sub) => (
              <div key={sub.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{sub.planName}</h3>
                  <p className="text-gray-300">Status: <span className={`font-bold ${sub.status === 'Active' ? 'text-green-400' : 'text-red-400'}`}>{sub.status}</span></p>
                  <p className="text-gray-400 text-sm">From: {sub.startDate} To: {sub.endDate}</p>
                </div>
                {sub.status === 'Active' && (
                  <button
                    onClick={() => handleCancelSubscription(sub.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
                    disabled={loading}
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
