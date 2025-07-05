"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Sidebar = () => {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart();

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠', active: pathname === '/' },
    { name: 'Explore', href: '/explore', icon: '🔍', active: pathname === '/explore' },
    { name: 'Notifications', href: '/notifications', icon: '🔔', active: pathname === '/notifications', badge: true },
    { name: 'Messages', href: '/messages', icon: '✉️', active: pathname === '/messages' },
    { name: 'Profile', href: '/profile', icon: '👤', active: pathname === '/profile' },
    { name: 'My Shop', href: '/shop', icon: '🛍️', active: pathname === '/shop' },
    { name: 'Cart', href: '/cart', icon: '🛒', active: pathname === '/cart', count: getTotalItems() },
    { name: 'Orders', href: '/orders', icon: '📦', active: pathname === '/orders' },
    { name: 'Auctions', href: '/auctions', icon: '⚡', active: pathname === '/auctions' },
    { name: 'Loyalty', href: '/loyalty', icon: '⭐', active: pathname === '/loyalty' },
  ];

  const secondaryNav = [
    { name: 'Subscriptions', href: '/subscriptions', icon: '💳' },
    { name: 'Stock Alerts', href: '/stock-alerts', icon: '🚨' },
    { name: 'Returns', href: '/returns', icon: '↩️' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-black border-r border-gray-800/50 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-lg">IJ</span>
          </div>
          <span className="text-2xl font-black text-gradient">IJIDeals</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all duration-200 group relative ${
                  item.active
                    ? 'bg-blue-500/10 text-blue-400 font-semibold'
                    : 'text-gray-300 hover:bg-gray-900/50 hover:text-white'
                }`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-lg">{item.name}</span>
                
                {/* Badge for notifications */}
                {item.badge && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
                )}
                
                {/* Count for cart */}
                {item.count && item.count > 0 && (
                  <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full ml-auto min-w-[20px] text-center">
                    {item.count}
                  </div>
                )}
                
                {/* Active indicator */}
                {item.active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"></div>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Secondary Navigation */}
        <div className="mt-8 pt-6 border-t border-gray-800/50">
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider px-4 mb-3">
            More
          </h3>
          <ul className="space-y-1">
            {secondaryNav.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-4 px-4 py-2 rounded-2xl text-gray-400 hover:bg-gray-900/50 hover:text-white transition-all duration-200 group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Admin Link (if admin) */}
        {user?.role === 'admin' && (
          <div className="mt-6 pt-4 border-t border-gray-800/50">
            <Link
              href="/admin"
              className="flex items-center space-x-4 px-4 py-2 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">⚙️</span>
              <span className="text-sm font-medium">Admin Panel</span>
            </Link>
          </div>
        )}
      </nav>

      {/* User Profile / Auth */}
      <div className="p-4 border-t border-gray-800/50">
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-900/50 transition-all duration-200 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center relative">
              <span className="text-white font-semibold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </span>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user.username}</p>
              <p className="text-gray-500 text-xs truncate">@{user.username.toLowerCase()}</p>
            </div>
            <button
              onClick={logout}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all duration-200"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              href="/login"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-2xl text-center transition-all duration-200 hover:scale-105"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="block w-full border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-2.5 px-4 rounded-2xl text-center transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Post Button */}
      <div className="p-4">
        <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-blue-500/25">
          <span className="text-lg">✨ Post</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;