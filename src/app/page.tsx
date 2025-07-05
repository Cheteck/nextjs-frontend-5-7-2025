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
  originalPrice?: string; // For promotions
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
    fetchPosts(); // Refresh posts after a new one is created
  };

  if (loadingPosts || loadingProducts) {
    return <div className="flex justify-center items-center h-full text-white">Loading content...</div>;
  }

  if (errorPosts || errorProducts) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {errorPosts || errorProducts}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <PostComposer onPostCreated={handlePostCreated} />

      {/* Social Feed */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-xl font-bold mb-4">Your Feed</h2>
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet. Be the first to post!</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
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

      {/* New Arrivals Section */}
      <div className="w-full max-w-2xl bg-gray-900 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-3">New Arrivals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newArrivals.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No new arrivals at the moment.</p>
          ) : (
            newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
              />
            ))
          )}
        </div>
      </div>

      {/* Promotions Section */}
      <div className="w-full max-w-2xl bg-gray-900 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-3">Promotions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promotions.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No promotions available.</p>
          ) : (
            promotions.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
              />
            ))
          )}
        </div>
      </div>

      {/* Popular Products Section */}
      <div className="w-full max-w-2xl bg-gray-900 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-3">Popular Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularProducts.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No popular products at the moment.</p>
          ) : (
            popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

