import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getShopInfo, updateShopInfo, getShopProducts, addShopProduct, updateShopProduct, deleteShopProduct, getShopOrders, updateShopOrderStatus } from '../../services/api';

interface ShopInfo {
  name: string;
  description: string;
  logo: string;
}

interface ShopProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
}

interface ShopOrder {
  id: number;
  customerName: string;
  total: number;
  status: string;
  items: { name: string; quantity: number }[];
}

const ShopDashboardPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>([]);
  const [shopOrders, setShopOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingShopInfo, setIsEditingShopInfo] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductImage, setNewProductImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const info = await getShopInfo(user.username);
        setShopInfo(info as ShopInfo);
        const products = await getShopProducts(user.username);
        setShopProducts(products as ShopProduct[]);
        const orders = await getShopOrders(user.username);
        setShopOrders(orders as ShopOrder[]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch shop data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, user]);

  const handleUpdateShopInfo = async () => {
    if (!shopInfo || !user) return;
    setLoading(true);
    setError(null);
    try {
      await updateShopInfo(user.username, shopInfo);
      setIsEditingShopInfo(false);
      alert('Shop info updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update shop info.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const newProduct = await addShopProduct(user.username, {
        name: newProductName,
        price: parseFloat(newProductPrice),
        stock: parseInt(newProductStock),
        image: newProductImage,
      });
      setShopProducts((prev) => [...prev, newProduct as ShopProduct]);
      setNewProductName('');
      setNewProductPrice('');
      setNewProductStock('');
      setNewProductImage('');
      alert('Product added successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!user || !confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    setError(null);
    try {
      await deleteShopProduct(user.username, productId);
      setShopProducts((prev) => prev.filter((p) => p.id !== productId));
      alert('Product deleted successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to delete product.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await updateShopOrderStatus(user.username, orderId, newStatus);
      setShopOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
      alert('Order status updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update order status.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading shop dashboard...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-full text-white">Please log in to manage your shop.</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Shop Dashboard: {shopInfo?.name || 'Your Shop'}</h1>

      {/* Shop Information Section */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Shop Information</h2>
        {isEditingShopInfo ? (
          <div className="space-y-6">
            <div>
              <label htmlFor="shopName" className="block text-gray-300 text-sm font-bold mb-2">Shop Name</label>
              <input
                type="text"
                id="shopName"
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                value={shopInfo?.name || ''}
                onChange={(e) => setShopInfo({ ...shopInfo!, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="shopDescription" className="block text-gray-300 text-sm font-bold mb-2">Description</label>
              <textarea
                id="shopDescription"
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                rows={4}
                value={shopInfo?.description || ''}
                onChange={(e) => setShopInfo({ ...shopInfo!, description: e.target.value })}
              ></textarea>
            </div>
            <div>
              <label htmlFor="shopLogo" className="block text-gray-300 text-sm font-bold mb-2">Logo URL</label>
              <input
                type="text"
                id="shopLogo"
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
                value={shopInfo?.logo || ''}
                onChange={(e) => setShopInfo({ ...shopInfo!, logo: e.target.value })}
              />
            </div>
            <button
              onClick={handleUpdateShopInfo}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full mr-2 transition-all duration-200 hover:scale-105"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => setIsEditingShopInfo(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105"
            >
              Cancel
            </button>
          </div>
        ) : ( 
          <div>
            <p className="text-gray-300 mb-2 text-lg"><strong>Description:</strong> {shopInfo?.description}</p>
            <p className="text-gray-300 mb-4 text-lg"><strong>Logo:</strong> <img src={shopInfo?.logo} alt="Shop Logo" className="w-24 h-24 object-cover inline-block ml-2 rounded-lg shadow-md" /></p>
            <button
              onClick={() => setIsEditingShopInfo(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105"
            >
              Edit Shop Info
            </button>
          </div>
        )}
      </div>

      {/* Product Management Section */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Product Management</h2>
        <form onSubmit={handleAddProduct} className="space-y-6 mb-8 p-6 border border-gray-700/50 rounded-xl bg-gray-800/50">
          <h3 className="text-xl font-bold mb-4 text-white">Add New Product</h3>
          <div>
            <label htmlFor="newProductName" className="block text-gray-300 text-sm font-bold mb-2">Product Name</label>
            <input type="text" id="newProductName" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="newProductPrice" className="block text-gray-300 text-sm font-bold mb-2">Price</label>
            <input type="number" id="newProductPrice" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} required step="0.01" />
          </div>
          <div>
            <label htmlFor="newProductStock" className="block text-gray-300 text-sm font-bold mb-2">Stock</label>
            <input type="number" id="newProductStock" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" value={newProductStock} onChange={(e) => setNewProductStock(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="newProductImage" className="block text-gray-300 text-sm font-bold mb-2">Image URL</label>
            <input type="text" id="newProductImage" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" value={newProductImage} onChange={(e) => setNewProductImage(e.target.value)} />
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>

        <h3 className="text-xl font-bold mb-4 text-white">Your Products</h3>
        {shopProducts.length === 0 ? (
          <p className="text-gray-500">No products listed yet.</p>
        ) : (
          <div className="space-y-4">
            {shopProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg mr-4 shadow-md" />
                  <div>
                    <p className="font-bold text-white text-lg">{product.name}</p>
                    <p className="text-green-400 font-semibold">${product.price.toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">Stock: {product.stock}</p>
                  </div>
                </div>
                <div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm mr-2 transition-all duration-200 hover:scale-105">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-200 hover:scale-105"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders Management Section */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        <h2 className="text-2xl font-bold mb-6 text-white">Orders Management</h2>
        {shopOrders.length === 0 ? (
          <p className="text-gray-500">No orders received yet.</p>
        ) : (
          <div className="space-y-4">
            {shopOrders.map((order) => (
              <div key={order.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-white">Order #{order.id}</h3>
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${order.status === 'Completed' ? 'bg-green-600 text-white' : order.status === 'Pending' ? 'bg-yellow-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-300 mb-1">Customer: {order.customerName}</p>
                <p className="text-gray-300 mb-2">Total: <span className="font-bold text-green-400">${order.total.toFixed(2)}</span></p>
                <ul className="list-disc list-inside text-gray-400 text-sm mb-3">
                  {order.items.map((item, idx) => (
                    <li key={idx}>{item.name} (x{item.quantity})</li>
                  ))}
                </ul>
                <div className="flex justify-end items-center">
                  <select
                    className="w-auto p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 mr-3"
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    disabled={loading}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => handleUpdateOrderStatus(order.id, order.status)} // Trigger update on button click as well
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-200 hover:scale-105"
                    disabled={loading}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDashboardPage;
