"use client";

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../services/api'; // Assuming you'll add this to api.ts

interface PostComposerProps {
  onPostCreated: () => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ onPostCreated }) => {
  const { isAuthenticated, user } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setError('You must be logged in to post.');
      return;
    }
    if (!postContent.trim()) {
      setError('Post content cannot be empty.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real app, you'd send the user ID with the post
      await createPost(postContent);
      setPostContent('');
      onPostCreated(); // Notify parent component to refresh feed
    } catch (err: any) {
      setError(err.message || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-gray-900 p-4 rounded-lg mb-4 border border-gray-800">
      <textarea
        className="w-full p-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        placeholder={isAuthenticated ? "What's happening? Share a product or a thought!" : "Log in to post..."}
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        disabled={!isAuthenticated || loading}
      ></textarea>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <div className="flex justify-end mt-2">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
          onClick={handleSubmit}
          disabled={!isAuthenticated || loading || !postContent.trim()}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
