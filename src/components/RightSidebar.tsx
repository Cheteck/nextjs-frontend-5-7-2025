"use client";

import { useState } from 'react';

const RightSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const trends = [
    { tag: '#PopularProduct', posts: '12.5K posts', trending: true },
    { tag: '#NewSeller', posts: '8.2K posts', trending: false },
    { tag: '#FlashSale', posts: '25.1K posts', trending: true },
    { tag: '#TechDeals', posts: '15.7K posts', trending: false },
    { tag: '#FashionWeek', posts: '32.4K posts', trending: true },
  ];

  const suggestions = [
    {
      name: 'TechStore Pro',
      handle: '@techstore_pro',
      avatar: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      verified: true,
      followers: '125K'
    },
    {
      name: 'Fashion Hub',
      handle: '@fashion_hub',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      verified: false,
      followers: '89K'
    },
    {
      name: 'Home Essentials',
      handle: '@home_essentials',
      avatar: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      verified: true,
      followers: '67K'
    },
  ];

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-black border-l border-gray-800/50 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search IJIDeals"
            className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* What's Happening */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">🔥</span>
            What's happening
          </h2>
          <div className="space-y-3">
            {trends.map((trend, index) => (
              <div
                key={index}
                className="p-3 rounded-xl hover:bg-gray-800/30 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                        {trend.tag}
                      </span>
                      {trend.trending && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          Trending
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{trend.posts}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-300 transition-all duration-200">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            Show more
          </button>
        </div>

        {/* Who to Follow */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">👥</span>
            Who to follow
          </h2>
          <div className="space-y-4">
            {suggestions.map((user, index) => (
              <div key={index} className="flex items-center space-x-3 group">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-700 group-hover:ring-gray-600 transition-all duration-200"
                  />
                  {user.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                    {user.verified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs truncate">{user.handle}</p>
                  <p className="text-gray-600 text-xs">{user.followers} followers</p>
                </div>
                <button className="bg-white text-black font-semibold px-4 py-1.5 rounded-full text-sm hover:bg-gray-200 transition-all duration-200 hover:scale-105">
                  Follow
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            Show more
          </button>
        </div>

        {/* Quick Stats */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Quick Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-800/30 rounded-xl">
              <p className="text-2xl font-bold text-blue-400">1.2M</p>
              <p className="text-gray-500 text-xs">Active Users</p>
            </div>
            <div className="text-center p-3 bg-gray-800/30 rounded-xl">
              <p className="text-2xl font-bold text-green-400">50K</p>
              <p className="text-gray-500 text-xs">Products</p>
            </div>
            <div className="text-center p-3 bg-gray-800/30 rounded-xl">
              <p className="text-2xl font-bold text-purple-400">25K</p>
              <p className="text-gray-500 text-xs">Shops</p>
            </div>
            <div className="text-center p-3 bg-gray-800/30 rounded-xl">
              <p className="text-2xl font-bold text-yellow-400">99.9%</p>
              <p className="text-gray-500 text-xs">Uptime</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 text-gray-600 text-xs">
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Cookies</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Ads</a>
            <a href="#" className="hover:text-gray-400 transition-colors">More</a>
          </div>
          <p>© 2025 IJIDeals, Inc.</p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;