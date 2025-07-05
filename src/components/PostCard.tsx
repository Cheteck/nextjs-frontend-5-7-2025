"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import { likePost, commentOnPost } from '../services/api';

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

const PostCard: React.FC<PostCardProps> = ({
  id,
  username,
  handle,
  time,
  content,
  avatarSrc,
  product,
  comments: initialComments,
  reposts,
  likes: initialLikes,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [commentContent, setCommentContent] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      await likePost(id);
      setLikes(isLiked ? likes - 1 : likes + 1);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;
    try {
      await commentOnPost(id, commentContent);
      setComments(comments + 1);
      setCommentContent('');
      setShowCommentInput(false);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
      <div className="flex items-start">
        <Image
          src={avatarSrc}
          alt={`${username} Avatar`}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full mr-3"
        />
        <div className="flex-1">
          <div className="flex items-center">
            <p className="font-bold mr-2">{username}</p>
            <p className="text-gray-500 text-sm">@{handle} · {time}</p>
          </div>
          <p className="mt-1 mb-3 text-gray-800 dark:text-gray-200">{content}</p>

          {product && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-3">
              <div className="flex">
                <Image
                  src={product.imageSrc}
                  alt={product.name}
                  width={120}
                  height={120}
                  className="w-24 h-24 object-cover"
                />
                <div className="p-3">
                  <p className="font-bold text-sm">{product.name}</p>
                  <p className="text-green-500 text-sm">{product.price}</p>
                  <a href={product.link} className="text-blue-500 hover:underline text-xs">
                    View Product
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between max-w-md text-gray-500">
            <button
              className="flex items-center hover:text-blue-500 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
              onClick={() => setShowCommentInput(!showCommentInput)}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{comments}</span>
            </button>
            <button className="flex items-center hover:text-green-500 p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>{reposts}</span>
            </button>
            <button
              className={`flex items-center ${isLiked ? 'text-red-500' : ''} hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20`}
              onClick={handleLike}
            >
              <svg className="w-5 h-5 mr-1" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likes}</span>
            </button>
            <button className="flex items-center hover:text-blue-500 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>

          {showCommentInput && (
            <div className="mt-3 flex items-start">
              <Image
                src={avatarSrc}
                alt={`${username} Avatar`}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full mr-2 mt-1"
              />
              <div className="flex-1 flex">
                <input
                  type="text"
                  placeholder="Tweet your reply"
                  className="flex-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:border-blue-500"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
                <button
                  className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full text-sm"
                  onClick={handleCommentSubmit}
                >
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;