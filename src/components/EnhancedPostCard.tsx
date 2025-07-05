"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import { likePost, commentOnPost } from '../services/api';
import AnimatedCounter from './AnimatedCounter';
import LoadingSpinner from './LoadingSpinner';

interface PostCardProps {
  id: number;
  username: string;
  handle: string;
  time: string;
  content: string;
  avatarSrc: string;
  product?: {
    name: string;
    price: string;
    imageSrc: string;
    link: string;
  };
  comments: number;
  reposts: number;
  likes: number;
}

const EnhancedPostCard: React.FC<PostCardProps> = ({
  id,
  username,
  handle,
  time,
  content,
  avatarSrc,
  product,
  comments: initialComments,
  reposts: initialReposts,
  likes: initialLikes,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [reposts, setReposts] = useState(initialReposts);
  const [commentContent, setCommentContent] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await likePost(id);
      setLikes(isLiked ? likes - 1 : likes + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepost = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Add repost API call here
      setReposts(isReposted ? reposts - 1 : reposts + 1);
      setIsReposted(!isReposted);
    } catch (error) {
      console.error('Failed to repost:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      await commentOnPost(id, commentContent);
      setComments(comments + 1);
      setCommentContent('');
      setShowCommentInput(false);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <article className="border-b border-gray-800/50 hover:bg-gray-950/30 transition-all duration-300 cursor-pointer group">
      <div className="p-4">
        <div className="flex space-x-3">
          {/* Avatar with status */}
          <div className="flex-shrink-0 relative">
            <Image
              src={avatarSrc}
              alt={`${username} Avatar`}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-800 group-hover:ring-gray-700 transition-all duration-200"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full status-online"></div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header with enhanced info */}
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-white hover:underline cursor-pointer flex items-center">
                {username}
                <svg className="w-4 h-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </h3>
              <span className="text-gray-500 text-sm">@{handle}</span>
              <span className="text-gray-500 text-sm">·</span>
              <span className="text-gray-500 text-sm hover:underline cursor-pointer tooltip" data-tooltip={new Date().toLocaleString()}>
                {time}
              </span>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-500 hover:text-gray-300 hover:bg-gray-800 p-1.5 rounded-full transition-all duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Post Content with enhanced formatting */}
            <div className="text-white text-[15px] leading-6 mb-3">
              {content.split(' ').map((word, index) => {
                if (word.startsWith('#')) {
                  return (
                    <span key={index} className="text-blue-400 hover:text-blue-300 cursor-pointer">
                      {word}{' '}
                    </span>
                  );
                }
                if (word.startsWith('@')) {
                  return (
                    <span key={index} className="text-blue-400 hover:text-blue-300 cursor-pointer">
                      {word}{' '}
                    </span>
                  );
                }
                return word + ' ';
              })}
            </div>

            {/* Enhanced Product Card */}
            {product && (
              <div className="card-hover border border-gray-700 rounded-2xl overflow-hidden mb-3 hover:border-gray-600 transition-all duration-300">
                <div className="flex">
                  <div className="flex-shrink-0 relative overflow-hidden">
                    <Image
                      src={product.imageSrc}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="w-24 h-24 object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4 flex-1">
                    <h4 className="font-semibold text-white text-sm mb-1 line-clamp-2 hover:text-blue-400 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-green-400 font-bold text-lg mb-2 animate-pulse">{product.price}</p>
                    <a 
                      href={product.link} 
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-all duration-200 hover:scale-105"
                    >
                      View Product
                      <svg className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="flex items-center justify-between max-w-md mt-3">
              {/* Comment */}
              <button
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-400 transition-colors group"
                onClick={() => setShowCommentInput(!showCommentInput)}
                disabled={isLoading}
              >
                <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-all duration-200 relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LoadingSpinner size="sm" color="blue" />
                    </div>
                  )}
                </div>
                <AnimatedCounter value={comments} className="text-sm" />
              </button>

              {/* Repost */}
              <button
                className={`flex items-center space-x-2 transition-colors group ${
                  isReposted ? 'text-green-500' : 'text-gray-500 hover:text-green-400'
                }`}
                onClick={handleRepost}
                disabled={isLoading}
              >
                <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <AnimatedCounter value={reposts} className="text-sm" />
              </button>

              {/* Like */}
              <button
                className={`flex items-center space-x-2 transition-colors group ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
                }`}
                onClick={handleLike}
                disabled={isLoading}
              >
                <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-all duration-200">
                  <svg 
                    className={`w-5 h-5 transition-all duration-200 ${isLiked ? 'scale-110' : ''}`}
                    fill={isLiked ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <AnimatedCounter value={likes} className="text-sm" />
              </button>

              {/* Bookmark */}
              <button 
                className={`flex items-center space-x-2 transition-colors group ${
                  isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-400'
                }`}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-all duration-200">
                  <svg 
                    className="w-5 h-5" 
                    fill={isBookmarked ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
              </button>

              {/* Share */}
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-400 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Enhanced Comment Input */}
            {showCommentInput && (
              <div className="mt-4 animate-slide-up">
                <div className="flex space-x-3">
                  <Image
                    src={avatarSrc}
                    alt="Your Avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      placeholder="Post your reply"
                      className="w-full bg-transparent text-white placeholder-gray-500 text-lg resize-none focus:outline-none dark-input rounded-xl p-3"
                      rows={2}
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      disabled={isLoading}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex space-x-4 text-blue-400">
                        <button className="hover:bg-blue-500/10 p-2 rounded-full transition-all duration-200 group">
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className="hover:bg-blue-500/10 p-2 rounded-full transition-all duration-200 group">
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={handleCommentSubmit}
                        disabled={!commentContent.trim() || isLoading}
                        className="btn-primary px-4 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <LoadingSpinner size="sm" color="white" />
                        ) : (
                          'Reply'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default EnhancedPostCard;