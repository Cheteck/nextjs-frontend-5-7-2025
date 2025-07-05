"use client";

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../services/api';

interface PostComposerProps {
  onPostCreated: () => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ onPostCreated }) => {
  const { isAuthenticated, user } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 280;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    if (content.length <= maxChars) {
      setPostContent(content);
      setCharCount(content.length);
    }
  };

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
      await createPost(postContent);
      setPostContent('');
      setCharCount(0);
      onPostCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="border-b border-gray-800/50 p-4">
        <div className="text-center py-8">
          <h2 className="text-xl font-bold text-white mb-2">Welcome to IJIDeals</h2>
          <p className="text-gray-500 mb-4">Join the conversation and discover amazing deals!</p>
          <div className="space-x-3">
            <a
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium px-6 py-2 rounded-full transition-all duration-200"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-800/50 p-4">
      <div className="flex space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {user?.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Composer */}
        <div className="flex-1">
          <textarea
            placeholder="What's happening?"
            className="w-full bg-transparent text-white placeholder-gray-500 text-xl resize-none focus:outline-none min-h-[120px]"
            value={postContent}
            onChange={handleContentChange}
            disabled={loading}
          />

          {/* Media Options */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-4 text-blue-400">
              <button className="hover:bg-blue-500/10 p-2 rounded-full transition-all duration-200 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="hover:bg-blue-500/10 p-2 rounded-full transition-all duration-200 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </button>
              <button className="hover:bg-blue-500/10 p-2 rounded-full transition-all duration-200 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button className="hover:bg-blue-500/10 p-2 rounded-full transition-all duration-200 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {/* Character Count */}
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8">
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-gray-700"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${(charCount / maxChars) * 87.96} 87.96`}
                      className={`transition-all duration-200 ${
                        charCount > maxChars * 0.8
                          ? charCount >= maxChars
                            ? 'text-red-500'
                            : 'text-yellow-500'
                          : 'text-blue-500'
                      }`}
                    />
                  </svg>
                  {charCount > maxChars * 0.8 && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {maxChars - charCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Post Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !postContent.trim() || charCount > maxChars}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-full transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Posting...</span>
                  </div>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostComposer;