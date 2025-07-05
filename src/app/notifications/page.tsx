import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markNotificationAsRead } from '../../services/api';

interface Notification {
  id: number;
  type: string;
  message: string;
  read: boolean;
  timestamp: string;
}

const NotificationsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedNotifications = await getNotifications(user.username);
      setNotifications(fetchedNotifications as Notification[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isAuthenticated, user]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to mark as read.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading notifications...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-full text-white">Please log in to view your notifications.</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No new notifications.</p>
      ) : (
        <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-6 border-b border-gray-700/50 flex items-center justify-between last:border-b-0 ${notif.read ? 'opacity-60' : 'hover:bg-gray-800/50 transition-colors duration-200'}`}
            >
              <div className="flex items-center">
                <img
                  src="https://via.placeholder.com/48"
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full mr-4 object-cover ring-1 ring-gray-600"
                />
                <div>
                  <p className="font-bold text-white text-lg">{notif.message}</p>
                  <p className="text-gray-400 text-sm">{new Date(notif.timestamp).toLocaleString()}</p>
                </div>
              </div>
              {!notif.read && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full text-sm transition-all duration-200 hover:scale-105"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
