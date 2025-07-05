"use client";

import React, { useState, useEffect } from 'react';
import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';
import ProductCard from '../components/ProductCard';
import { getPosts, getNewArrivals, getPromotions, getPopularProducts } from '../services/api';

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

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  originalPrice?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');

  const fetchPosts = async () => {
    setLoadingPosts(true);
    setErrorPosts(null);
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts as Post[]);
    } catch (err: any) {
      setErrorPosts(err.message || 'Failed to fetch posts.');
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchProductSections = async () => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      const [arrivals, promos, popular] = await Promise.all([
        getNewArrivals(),
        getPromotions(),
        getPopularProducts(),
      ]);
      setNewArrivals(arrivals as Product[]);
      setPromotions(promos as Product[]);
      setPopularProducts(popular as Product[]);
    } catch (err: any) {
      setErrorProducts(err.message || 'Failed to fetch product sections.');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchProductSections();
  }, []);

  const handlePostCreated = () => {
    fetchPosts();
  };

  if (loadingPosts && loadingProducts) {
    return (
      <div className="min-h-screen">
        {/* Header Skeleton */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800/50 p-4">
          <div className="skeleton h-6 w-24 rounded"></div>
        </div>
        
        {/* Post Composer Skeleton */}
        <div className="border-b border-gray-800/50 p-4">
          <div className="flex space-x-4">
            <div className="skeleton w-12 h-12 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="skeleton h-4 w-3/4 rounded"></div>
              <div className="skeleton h-4 w-1/2 rounded"></div>
            </div>
          </div>
        </div>

        {/* Posts Skeleton */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b border-gray-800/50 p-4">
            <div className="flex space-x-3">
              <div className="skeleton w-12 h-12 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="skeleton h-4 w-1/3 rounded"></div>
                <div className="skeleton h-4 w-full rounded"></div>
                <div className="skeleton h-4 w-2/3 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (errorPosts && errorProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-4">We're having trouble loading the content</p>
          <button
            onClick={() => {
              fetchPosts();
              fetchProductSections();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800/50 z-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-white">Home</h1>
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800/50">
          <button
            onClick={() => setActiveTab('for-you')}
            className={`flex-1 py-4 text-center font-medium transition-all duration-200 relative ${
              activeTab === 'for-you'
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            For you
            {activeTab === 'for-you' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-4 text-center font-medium transition-all duration-200 relative ${
              activeTab === 'following'
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Following
            {activeTab === 'following' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Post Composer */}
      <PostComposer onPostCreated={handlePostCreated} />

      {/* Content based on active tab */}
      {activeTab === 'for-you' ? (
        <>
          {/* Social Feed */}
          <div>
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌟</div>
                <h2 className="text-xl font-bold text-white mb-2">Welcome to IJIDeals!</h2>
                <p className="text-gray-500">Be the first to share something amazing</p>
              </div>
            ) : (
              posts.map((post) => (
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

          {/* Product Sections */}
          {!loadingProducts && (
            <>
              {/* New Arrivals */}
              {newArrivals.length > 0 && (
                <div className="border-b border-gray-800/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <span className="mr-2">✨</span>
                      New Arrivals
                    </h2>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      See all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {newArrivals.slice(0, 2).map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        category={product.category}
                        price={product.price}
                        image={product.image}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Promotions */}
              {promotions.length > 0 && (
                <div className="border-b border-gray-800/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <span className="mr-2">🔥</span>
                      Hot Deals
                    </h2>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      See all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {promotions.slice(0, 2).map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        category={product.category}
                        price={product.price}
                        image={product.image}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Products */}
              {popularProducts.length > 0 && (
                <div className="border-b border-gray-800/50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <span className="mr-2">📈</span>
                      Trending
                    </h2>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      See all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {popularProducts.slice(0, 2).map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        category={product.category}
                        price={product.price}
                        image={product.image}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        /* Following Tab */
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-white mb-2">Follow some accounts</h2>
          <p className="text-gray-500 mb-6">
            When you follow accounts, you'll see their posts here.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full transition-all duration-200 hover:scale-105">
            Find people to follow
          </button>
        </div>
      )}

      {/* Load More Button */}
      {posts.length > 0 && activeTab === 'for-you' && (
        <div className="p-6 text-center">
          <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Show more posts
          </button>
        </div>
      )}
    </div>
  );
}