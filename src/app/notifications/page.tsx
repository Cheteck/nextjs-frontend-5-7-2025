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
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No new notifications.</p>
      ) : (
        <div className="w-full max-w-2xl bg-gray-900 rounded-lg">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 border-b border-gray-800 flex items-center justify-between ${notif.read ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-bold">{notif.message}</p>
                  <p className="text-gray-500 text-sm">{new Date(notif.timestamp).toLocaleString()}</p>
                </div>
              </div>
              {!notif.read && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full text-sm"
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
