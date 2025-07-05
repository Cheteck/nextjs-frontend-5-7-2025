"use client";

import React, { useState, useEffect } from 'react';
import PostComposer from '../components/PostComposer';
import EnhancedPostCard from '../components/EnhancedPostCard';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import FloatingActionButton from '../components/FloatingActionButton';
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
  const [showComposer, setShowComposer] = useState(false);

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
    setShowComposer(false);
  };

  if (loadingPosts && loadingProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" color="blue" text="Loading your feed..." />
      </div>
    );
  }

  if (errorPosts && errorProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-bounce-in">
          <div className="text-6xl mb-4 animate-float">😵</div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-4">We're having trouble loading the content</p>
          <button
            onClick={() => {
              fetchPosts();
              fetchProductSections();
            }}
            className="btn-primary px-6 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Enhanced Header */}
      <div className="sticky top-0 glass-strong border-b border-gray-800/50 z-20">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-white">Home</h1>
          <div className="flex items-center space-x-2">
            <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button 
              onClick={() => setShowComposer(!showComposer)}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex border-b border-gray-800/50">
          <button
            onClick={() => setActiveTab('for-you')}
            className={`flex-1 py-4 text-center font-medium transition-all duration-300 relative group ${
              activeTab === 'for-you'
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="relative z-10">For you</span>
            {activeTab === 'for-you' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-slide-up"></div>
            )}
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-4 text-center font-medium transition-all duration-300 relative group ${
              activeTab === 'following'
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="relative z-10">Following</span>
            {activeTab === 'following' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-slide-up"></div>
            )}
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
        </div>
      </div>

      {/* Collapsible Post Composer */}
      {showComposer && (
        <div className="animate-slide-up">
          <PostComposer onPostCreated={handlePostCreated} />
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'for-you' ? (
        <>
          {/* Social Feed */}
          <div>
            {posts.length === 0 ? (
              <div className="text-center py-12 animate-bounce-in">
                <div className="text-6xl mb-4 animate-float">🌟</div>
                <h2 className="text-xl font-bold text-white mb-2">Welcome to IJIDeals!</h2>
                <p className="text-gray-500 mb-6">Be the first to share something amazing</p>
                <button 
                  onClick={() => setShowComposer(true)}
                  className="btn-primary px-6 py-2"
                >
                  Create your first post
                </button>
              </div>
            ) : (
              posts.map((post, index) => (
                <div key={post.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <EnhancedPostCard
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
                </div>
              ))
            )}
          </div>

          {/* Enhanced Product Sections */}
          {!loadingProducts && (
            <>
              {/* New Arrivals */}
              {newArrivals.length > 0 && (
                <div className="border-b border-gray-800/50 p-6 animate-slide-up">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <span className="mr-2 animate-bounce">✨</span>
                      New Arrivals
                      <span className="ml-2 bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                        {newArrivals.length}
                      </span>
                    </h2>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors hover:scale-105">
                      See all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {newArrivals.slice(0, 2).map((product, index) => (
                      <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                        <ProductCard
                          id={product.id}
                          name={product.name}
                          category={product.category}
                          price={product.price}
                          image={product.image}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Promotions */}
              {promotions.length > 0 && (
                <div className="border-b border-gray-800/50 p-6 animate-slide-up">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <span className="mr-2 animate-pulse">🔥</span>
                      Hot Deals
                      <span className="ml-2 bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full animate-pulse">
                        Limited Time
                      </span>
                    </h2>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors hover:scale-105">
                      See all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {promotions.slice(0, 2).map((product, index) => (
                      <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                        <ProductCard
                          id={product.id}
                          name={product.name}
                          category={product.category}
                          price={product.price}
                          image={product.image}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Products */}
              {popularProducts.length > 0 && (
                <div className="border-b border-gray-800/50 p-6 animate-slide-up">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <span className="mr-2">📈</span>
                      Trending
                      <span className="ml-2 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                        Popular
                      </span>
                    </h2>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors hover:scale-105">
                      See all
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {popularProducts.slice(0, 2).map((product, index) => (
                      <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                        <ProductCard
                          id={product.id}
                          name={product.name}
                          category={product.category}
                          price={product.price}
                          image={product.image}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        /* Following Tab */
        <div className="text-center py-12 animate-bounce-in">
          <div className="text-6xl mb-4 animate-float">👥</div>
          <h2 className="text-xl font-bold text-white mb-2">Follow some accounts</h2>
          <p className="text-gray-500 mb-6">
            When you follow accounts, you'll see their posts here.
          </p>
          <button className="btn-primary px-6 py-2">
            Find people to follow
          </button>
        </div>
      )}

      {/* Load More Button */}
      {posts.length > 0 && activeTab === 'for-you' && (
        <div className="p-6 text-center">
          <button className="text-blue-400 hover:text-blue-300 font-medium transition-all duration-200 hover:scale-105 flex items-center mx-auto space-x-2">
            <span>Show more posts</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setShowComposer(!showComposer)}
        tooltip="Create new post"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }
      />
    </div>
  );
}