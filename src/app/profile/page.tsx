import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserPosts, updateUserProfile, followUser, unfollowUser, getVirtualCoinBalance } from '../../services/api';
import PostCard from '../../components/PostCard';

interface Post {
  id: number;
  content: string;
  username: string;
  handle: string;
  time: string;
  avatarSrc: string;
  comments: number;
  reposts: number;
  likes: number;
  product?: {
    name: string;
    price: string;
    imageSrc: string;
    link: string;
  };
}

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || 'This is a placeholder bio for the user. I love e-commerce and social interactions!');
  const [location, setLocation] = useState(user?.location || '📍 Location');
  const [isFollowing, setIsFollowing] = useState(false); // Mock state for follow status
  const [virtualCoinBalance, setVirtualCoinBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchedPosts = await getUserPosts(user.username);
        setUserPosts(fetchedPosts as Post[]);
        setIsFollowing(false); 

        const coinBalance = await getVirtualCoinBalance(user.username);
        setVirtualCoinBalance(coinBalance.balance);

      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateUserProfile(user?.username || '', { bio, location });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!isAuthenticated || !user) {
      alert('You must be logged in to follow/unfollow.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (isFollowing) {
        await unfollowUser(user.username); // Mock unfollow
        alert(`Unfollowed ${user.username}`);
      } else {
        await followUser(user.username); // Mock follow
        alert(`Following ${user.username}`);
      }
      setIsFollowing(!isFollowing);
    } catch (err: any) {
      setError(err.message || 'Failed to update follow status.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading profile...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-full text-white">Please log in to view your profile.</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto">
      {/* Profile Header (Banner and Avatar) */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl mb-8 border border-gray-700/50">
        <div className="relative h-48 bg-gray-700">
          {/* Banner Image */}
          <img
            src="https://via.placeholder.com/1200x300?text=Profile+Banner"
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
          {/* Avatar */}
          <img
            src="https://via.placeholder.com/150"
            alt="Profile Avatar"
            className="absolute -bottom-20 left-6 w-36 h-36 rounded-full border-4 border-black object-cover shadow-lg"
          />
        </div>
        <div className="p-6 pt-24">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{user?.username || 'User Name'}</h1>
              <p className="text-gray-400 text-lg">@{user?.username.toLowerCase() || 'username'}</p>
            </div>
            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-full text-sm transition-all duration-200 hover:scale-105"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                <button
                  onClick={handleFollowToggle}
                  className={`font-bold py-2 px-5 rounded-full text-sm transition-all duration-200 hover:scale-105 ${isFollowing ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  disabled={loading}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            )}
          </div>
          {isEditing ? (
            <textarea
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 mt-4"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          ) : (
            <p className="mt-4 text-gray-200 leading-relaxed">{bio}</p>
          )}
          <div className="flex flex-wrap gap-x-6 mt-4 text-gray-400 text-sm">
            {isEditing ? (
              <input
                type="text"
                className="p-2 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 mr-4"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            ) : (
              <p className="mr-4">📍 {location}</p>
            )}
            <p>🗓️ Joined July 2025</p>
          </div>
          <div className="flex gap-x-6 mt-4 text-white">
            <p><span className="font-bold">123</span> Following</p>
            <p><span className="font-bold">456</span> Followers</p>
          </div>
          {virtualCoinBalance !== null && (
            <div className="mt-4">
              <p className="text-gray-300 text-lg">Virtual Coin Balance: <span className="font-bold text-yellow-400">{virtualCoinBalance.toFixed(2)} VC</span></p>
            </div>
          )}
          {isEditing && (
            <div className="mt-6">
              <button
                onClick={handleSaveProfile}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-full text-sm transition-all duration-200 hover:scale-105"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Posts/Products Feed */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        <h2 className="text-2xl font-bold mb-6 text-white">Posts & Products</h2>
        {userPosts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet.</p>
        ) : (
          userPosts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              username={post.username}
              handle={post.handle}
              time={post.time}
              content={post.content}
              avatarSrc={post.avatarSrc}
              product={post.product}
              comments={post.comments}
              reposts={post.reposts}
              likes={post.likes}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
