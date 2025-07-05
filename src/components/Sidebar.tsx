import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-1/5 border-r border-gray-800 p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-400">IJIDeals</h1>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl">🏠</span> Home
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/explore" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl">🔍</span> Explore
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/notifications" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl">🔔</span> Notifications
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/messages" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl">✉️</span> Messages
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/profile" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl">👤</span> Profile
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/shop" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl">🛍️</span> My Shop
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/admin" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl">⚙️</span> Admin
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/login" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl">🔑</span> Login
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/register" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl">📝</span> Register
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/cart" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl">🛒</span> Cart
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/orders" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl">📦</span> Orders
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/auctions" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl"> gavel</span> Auctions
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/loyalty" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl">⭐</span> Loyalty
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/subscriptions" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl">💳</span> Subscriptions
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/stock-alerts" className="flex items-center text-white hover:bg-gray-800 p-2 rounded-full transition-colors">
              <span className="mr-3 text-xl">🚨</span> Stock Alerts
            </Link>
          </li>
        </ul>
      </nav>
      <button className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition-colors">
        Post
      </button>
    </aside>
  );
};

export default Sidebar;
