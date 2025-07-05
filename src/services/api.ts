import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product-related API calls
export const getProducts = async (filters?: { searchTerm?: string; category?: string; minPrice?: number; maxPrice?: number; }) => {
  try {
    const allProducts = [
      { id: 1, name: 'Smartphone X', category: 'Electronics', brand: 'BrandA', price: '799.99', image: 'https://via.placeholder.com/150?text=Smartphone' },
      { id: 2, name: 'Designer Dress', category: 'Fashion', brand: 'BrandB', price: '199.50', image: 'https://via.placeholder.com/150?text=Dress' },
      { id: 3, name: 'Smart Home Hub', category: 'Electronics', brand: 'BrandA', price: '120.00', image: 'https://via.placeholder.com/150?text=Smart+Hub' },
      { id: 4, name: 'Novel Book', category: 'Books', brand: 'BrandC', price: '25.00', image: 'https://via.placeholder.com/150?text=Book' },
    ];

    let filteredProducts = allProducts;

    if (filters?.searchTerm) {
      const lowerCaseSearchTerm = filters.searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.category.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.brand.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (filters?.category) {
      filteredProducts = filteredProducts.filter(product => product.category === filters.category);
    }

    if (filters?.minPrice) {
      filteredProducts = filteredProducts.filter(product => parseFloat(product.price) >= filters.minPrice!);
    }

    if (filters?.maxPrice) {
      filteredProducts = filteredProducts.filter(product => parseFloat(product.price) <= filters.maxPrice!);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(filteredProducts);
      }, 500);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryName: string) => {
  return getProducts({ category: categoryName });
};

export const getProductsByBrand = async (brandName: string) => {
  return getProducts({ brand: brandName });
};

export const getNewArrivals = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 5, name: 'New Wireless Earbuds', category: 'Electronics', brand: 'BrandD', price: '79.99', image: 'https://via.placeholder.com/150?text=Earbuds' },
        { id: 6, name: 'Summer Collection T-Shirt', category: 'Fashion', brand: 'BrandE', price: '29.99', image: 'https://via.placeholder.com/150?text=T-Shirt' },
      ]);
    }, 500);
  });
};

export const getPromotions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 7, name: 'Limited Edition Watch', category: 'Accessories', brand: 'BrandF', price: '149.99', originalPrice: '199.99', image: 'https://via.placeholder.com/150?text=Watch' },
        { id: 8, name: 'Gaming Keyboard', category: 'Electronics', brand: 'BrandG', price: '59.99', originalPrice: '89.99', image: 'https://via.placeholder.com/150?text=Keyboard' },
      ]);
    }, 500);
  });
};

export const getPopularProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 9, name: 'Best-selling Coffee Maker', category: 'Home & Garden', brand: 'BrandH', price: '89.00', image: 'https://via.placeholder.com/150?text=Coffee+Maker' },
        { id: 10, name: 'Top Rated Backpack', category: 'Fashion', brand: 'BrandI', price: '45.00', image: 'https://via.placeholder.com/150?text=Backpack' },
      ]);
    }, 500);
  });
};

// Authentication API calls
export const login = async (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'user@example.com' && password === 'password') {
        resolve({ token: 'mock-jwt-token', user: { email, username: 'MockUser' } });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

export const register = async (username: string, email: string, password: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Registration successful', user: { username, email } });
    }, 500);
  });
};

// Social API calls
export const createPost = async (content: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Post created successfully', post: { id: Date.now(), content, createdAt: new Date().toISOString() } });
    }, 500);
  });
};

export const getPosts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, username: "User Name", handle: "username", time: "2h", content: "Check out this amazing new product! #ecommerce #deal", avatarSrc: "https://via.placeholder.com/40", product: { name: "Awesome Product Name", price: "$99.99", imageSrc: "https://via.placeholder.com/80", link: "#" }, comments: 12, reposts: 5, likes: 23 },
        { id: 2, username: "Another User", handle: "anotheruser", time: "5h", content: "Just got this amazing gadget! Highly recommend it. #tech #gadget", avatarSrc: "https://via.placeholder.com/40", comments: 8, reposts: 3, likes: 15 },
      ]);
    }, 500);
  });
};

export const getUserPosts = async (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 101, username: "User Name", handle: "username", time: "1d", content: "My latest thoughts on e-commerce trends! #ecommerce #trends", avatarSrc: "https://via.placeholder.com/40", comments: 5, reposts: 2, likes: 10 },
        { id: 102, username: "User Name", handle: "username", time: "3d", content: "Just listed a new product! Check it out!", avatarSrc: "https://via.placeholder.com/40", product: { name: "Vintage Camera", price: "$250.00", imageSrc: "https://via.placeholder.com/80?text=Camera", link: "#" }, comments: 3, reposts: 1, likes: 8 },
      ]);
    }, 500);
  });
};

export const likePost = async (postId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Post ${postId} liked.`);
      resolve({ message: 'Post liked successfully!' });
    }, 200);
  });
};

export const commentOnPost = async (postId: number, commentContent: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Commented on post ${postId}: ${commentContent}`);
      resolve({ message: 'Comment added successfully!' });
    }, 300);
  });
};

export const followUser = async (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Following user ${userId}.`);
      resolve({ message: 'User followed successfully!' });
    }, 200);
  });
};

export const unfollowUser = async (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Unfollowing user ${userId}.`);
      resolve({ message: 'User unfollowed successfully!' });
    }, 200);
  });
};

// Order and Return API calls
export const placeOrder = async (orderDetails: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Order placed:', orderDetails);
      resolve({ message: 'Order placed successfully!', orderId: Date.now() });
    }, 1000);
  });
};

export const getOrders = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1001, date: '2025-07-01', total: 120.00, status: 'Delivered', items: [{ productId: 1, name: 'Smartphone X', quantity: 1, price: 799.99 }, { productId: 3, name: 'Smart Home Hub', quantity: 1, price: 120.00 }] },
        { id: 1002, date: '2025-07-03', total: 29.99, status: 'Pending', items: [{ productId: 6, name: 'Summer Collection T-Shirt', quantity: 1, price: 29.99 }] },
      ]);
    }, 500);
  });
};

export const requestReturn = async (orderId: number, productId: number, reason: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Return request submitted:', { orderId, productId, reason });
      resolve({ message: 'Return request submitted successfully!', requestId: Date.now() });
    }, 500);
  });
};

export const getReturns = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 2001, orderId: 1001, productId: 1, productName: 'Smartphone X', reason: 'Defective item', status: 'Pending', dateRequested: '2025-07-05' },
        { id: 2002, orderId: 1002, productId: 6, productName: 'Summer Collection T-Shirt', reason: 'Wrong size', status: 'Approved', dateRequested: '2025-07-04' },
      ]);
    }, 500);
  });
};

// User Profile API calls
export const updateUserProfile = async (userId: string, profileData: { bio?: string; location?: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Updating profile for user ${userId}:`, profileData);
      resolve({ message: 'Profile updated successfully!' });
    }, 500);
  });
};

// Shop Management API calls
export const getShopInfo = async (shopId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: `Mock Shop for ${shopId}`,
        description: `This is the official shop of ${shopId}. We sell high-quality products.`,
        logo: 'https://via.placeholder.com/100?text=ShopLogo',
      });
    }, 500);
  });
};

export const updateShopInfo = async (shopId: string, shopInfo: { name: string; description: string; logo: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Updating shop info for ${shopId}:`, shopInfo);
      resolve({ message: 'Shop info updated successfully!' });
    }, 500);
  });
};

export const getShopProducts = async (shopId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Shop Product 1', price: 10.00, stock: 100, image: 'https://via.placeholder.com/150?text=ShopProd1' },
        { id: 2, name: 'Shop Product 2', price: 25.50, stock: 50, image: 'https://via.placeholder.com/150?text=ShopProd2' },
      ]);
    }, 500);
  });
};

export const addShopProduct = async (shopId: string, product: { name: string; price: number; stock: number; image: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct = { id: Date.now(), ...product };
      console.log(`Adding product for ${shopId}:`, newProduct);
      resolve(newProduct);
    }, 500);
  });
};

export const updateShopProduct = async (shopId: string, productId: number, product: { name?: string; price?: number; stock?: number; image?: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Updating product ${productId} for ${shopId}:`, product);
      resolve({ message: 'Product updated successfully!' });
    }, 500);
  });
};

export const deleteShopProduct = async (shopId: string, productId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Deleting product ${productId} for ${shopId}.`);
      resolve({ message: 'Product deleted successfully!' });
    }, 500);
  });
};

export const getShopOrders = async (shopId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, customerName: 'Customer A', total: 35.50, status: 'Pending', items: [{ name: 'Shop Product 1', quantity: 1 }] },
        { id: 2, customerName: 'Customer B', total: 100.00, status: 'Shipped', items: [{ name: 'Shop Product 2', quantity: 2 }] },
      ]);
    }, 500);
  });
};

export const updateShopOrderStatus = async (shopId: string, orderId: number, newStatus: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Updating order ${orderId} status for ${shopId} to ${newStatus}.`);
      resolve({ message: 'Order status updated successfully!' });
    }, 500);
  });
};

// Admin API calls
export const getAllUsers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'user1', username: 'Alice', email: 'alice@example.com', role: 'customer', isBanned: false },
        { id: 'user2', username: 'Bob', email: 'bob@example.com', role: 'seller', isBanned: false },
        { id: 'user3', username: 'Charlie', email: 'charlie@example.com', role: 'admin', isBanned: false },
        { id: 'user4', username: 'David', email: 'david@example.com', role: 'customer', isBanned: true },
      ]);
    }, 500);
  });
};

export const banUser = async (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Banning user ${userId}.`);
      resolve({ message: 'User banned successfully!' });
    }, 500);
  });
};

export const getAllShops = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'shop1', name: 'Electronics Hub', owner: 'Bob', status: 'Approved' },
        { id: 'shop2', name: 'Fashion Trends', owner: 'Eve', status: 'Pending' },
        { id: 'shop3', name: 'Home Goods Store', owner: 'Frank', status: 'Suspended' },
      ]);
    }, 500);
  });
};

export const approveShop = async (shopId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Approving shop ${shopId}.`);
      resolve({ message: 'Shop approved successfully!' });
    }, 500);
  });
};

export const suspendShop = async (shopId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Suspending shop ${shopId}.`);
      resolve({ message: 'Shop suspended successfully!' });
    }, 500);
  });
};

export const getMasterProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Master Product A', category: 'Electronics', brand: 'GlobalTech' },
        { id: 2, name: 'Master Product B', category: 'Fashion', brand: 'StyleCo' },
        { id: 3, name: 'Master Product C', category: 'Home & Garden', brand: 'HomeEssentials' },
      ]);
    }, 500);
  });
};

export const addMasterProduct = async (product: { name: string; category: string; brand: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct = { id: Date.now(), ...product };
      console.log('Adding master product:', newProduct);
      resolve(newProduct);
    }, 500);
  });
};

export const updateMasterProduct = async (productId: number, product: { name?: string; category?: string; brand?: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Updating master product ${productId}:`, product);
      resolve({ message: 'Master product updated successfully!' });
    }, 500);
  });
};

export const deleteMasterProduct = async (productId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Deleting master product ${productId}.`);
      resolve({ message: 'Master product deleted successfully!' });
    }, 500);
  });
};

export const getCategories = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'cat1', name: 'Electronics' },
        { id: 'cat2', name: 'Fashion' },
        { id: 'cat3', name: 'Home & Garden' },
        { id: 'cat4', name: 'Books' },
      ]);
    }, 500);
  });
};

export const addCategory = async (categoryName: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCategory = { id: `cat${Date.now()}`, name: categoryName };
      console.log('Adding category:', newCategory);
      resolve(newCategory);
    }, 500);
  });
};

export const getBrands = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'brand1', name: 'GlobalTech' },
        { id: 'brand2', name: 'StyleCo' },
        { id: 'brand3', name: 'HomeEssentials' },
      ]);
    }, 500);
  });
};

export const addBrand = async (brandName: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBrand = { id: `brand${Date.now()}`, name: brandName };
      console.log('Adding brand:', newBrand);
      resolve(newBrand);
    }, 500);
  });
};

// Auction API calls
export const getAuctions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Vintage Comic Book', currentBid: 50.00, endTime: new Date(Date.now() + 3600000).toISOString(), image: 'https://via.placeholder.com/300?text=ComicBook' },
        { id: 2, name: 'Rare Collectible Coin', currentBid: 120.00, endTime: new Date(Date.now() + 7200000).toISOString(), image: 'https://via.placeholder.com/300?text=Coin' },
        { id: 3, name: 'Antique Vase', currentBid: 300.00, endTime: new Date(Date.now() + 10800000).toISOString(), image: 'https://via.placeholder.com/300?text=Vase' },
      ]);
    }, 500);
  });
};

export const getAuctionDetails = async (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const auctions = [
        { id: 1, name: 'Vintage Comic Book', description: 'A rare first edition comic book in excellent condition.', currentBid: 50.00, endTime: new Date(Date.now() + 3600000).toISOString(), image: 'https://via.placeholder.com/600x400?text=ComicBookDetail', bidHistory: [{ bidder: 'User1', amount: 45.00, time: new Date(Date.now() - 1000000).toISOString() }, { bidder: 'User2', amount: 50.00, time: new Date(Date.now() - 500000).toISOString() }] },
        { id: 2, name: 'Rare Collectible Coin', description: 'A very rare coin from the 18th century.', currentBid: 120.00, endTime: new Date(Date.now() + 7200000).toISOString(), image: 'https://via.placeholder.com/600x400?text=CoinDetail', bidHistory: [{ bidder: 'UserA', amount: 110.00, time: new Date(Date.now() - 1500000).toISOString() }, { bidder: 'UserB', amount: 120.00, time: new Date(Date.now() - 800000).toISOString() }] },
        { id: 3, name: 'Antique Vase', description: 'A beautiful antique vase from the Ming Dynasty.', currentBid: 300.00, endTime: new Date(Date.now() + 10800000).toISOString(), image: 'https://via.placeholder.com/600x400?text=VaseDetail', bidHistory: [{ bidder: 'UserX', amount: 280.00, time: new Date(Date.now() - 2000000).toISOString() }, { bidder: 'UserY', amount: 300.00, time: new Date(Date.now() - 1000000).toISOString() }] },
      ]);
      const auction = auctions.find(a => a.id === id);
      if (auction) {
        resolve(auction);
      } else {
        reject(new Error('Auction not found'));
      }
    }, 500);
  });
};

export const placeBid = async (auctionId: number, amount: number, bidder: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Bid placed on auction ${auctionId}: Amount ${amount} by ${bidder}.`);
      resolve({ message: 'Bid placed successfully!' });
    }, 500);
  });
};

// Loyalty API calls
export const getLoyaltyStatus = async (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        points: 1250,
        tier: 'Gold',
        benefits: ['Free shipping', 'Exclusive discounts', 'Early access to sales'],
      });
    }, 500);
  });
};

export const getShopLoyaltyStatus = async (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          shopName: 'Electronics Hub',
          points: 300,
          tier: 'Silver',
          benefits: ['5% off on all electronics'],
        },
        {
          shopName: 'Fashion Trends',
          points: 700,
          tier: 'Gold',
          benefits: ['10% off on all fashion items', 'Personal stylist'],
        },
      ]);
    }, 500);
  });
};

// Virtual Coin API calls
export const getVirtualCoinBalance = async (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ balance: 500.75 }); // Mock balance
    }, 300);
  });
};

// Stock Alerts API calls
export const subscribeToStockAlerts = async (productId: number, userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`User ${userId} subscribed to stock alerts for product ${productId}.`);
      resolve({ message: 'Subscribed to stock alerts successfully!' });
    }, 500);
  });
};

export const getSubscribedStockAlerts = async (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, productId: 1, productName: 'Smartphone X', status: 'Active' },
        { id: 2, productId: 4, productName: 'Novel Book', status: 'Active' },
      ]);
    }, 500);
  });
};

// Notification API calls
export const getNotifications = async (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, type: 'social', message: 'User A liked your post.', read: false, timestamp: '2025-07-05T10:00:00Z' },
        { id: 2, type: 'order', message: 'Your order #1001 has been shipped.', read: false, timestamp: '2025-07-05T09:30:00Z' },
        { id: 3, type: 'promotion', message: 'New flash sale on electronics!', read: true, timestamp: '2025-07-04T18:00:00Z' },
      ]);
    }, 500);
  });
};

export const markNotificationAsRead = async (notificationId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Notification ${notificationId} marked as read.`);
      resolve({ message: 'Notification marked as read.' });
    }, 200);
  });
};

// Subscription API calls
export const getAvailableSubscriptionPlans = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Basic Plan', price: 9.99, features: ['Access to basic features', 'Ad-supported'] },
        { id: 2, name: 'Premium Plan', price: 19.99, features: ['Access to all features', 'Ad-free', 'Priority support'] },
      ]);
    }, 500);
  });
};

export const getSubscriptions = async (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, planName: 'Basic Plan', status: 'Active', startDate: '2025-06-01', endDate: '2026-06-01' },
      ]);
    }, 500);
  });
};

export const subscribeToPlan = async (userId: string, planId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`User ${userId} subscribed to plan ${planId}.`);
      resolve({ message: 'Subscribed successfully!' });
    }, 500);
  });
};

export const cancelSubscription = async (userId: string, subscriptionId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`User ${userId} cancelled subscription ${subscriptionId}.`);
      resolve({ message: 'Subscription cancelled successfully!' });
    }, 500);
  });
};

// Message API calls
export const getConversations = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, participant: 'User X', lastMessage: 'Hey, how are you?', lastMessageTime: '10:30 AM', avatar: 'https://via.placeholder.com/40' },
        { id: 2, participant: 'User Y', lastMessage: 'Looking for a product.', lastMessageTime: 'Yesterday', avatar: 'https://via.placeholder.com/40' },
      ]);
    }, 500);
  });
};

export const getMessages = async (conversationId: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, sender: 'User X', content: 'Hi there! How can I help you?', timestamp: '10:30 AM' },
        { id: 2, sender: 'MockUser', content: 'I\'m looking for a specific product.', timestamp: '10:35 AM' },
      ]);
    }, 500);
  });
};

export const sendMessage = async (conversationId: number, sender: string, content: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Message sent in conversation ${conversationId} by ${sender}: ${content}`);
      resolve({ message: 'Message sent successfully!' });
    }, 300);
  });
};

export default api;