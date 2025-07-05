import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getAllUsers, banUser, 
  getAllShops, approveShop, suspendShop, 
  getMasterProducts, addMasterProduct, updateMasterProduct, deleteMasterProduct,
  getCategories, addCategory, 
  getBrands, addBrand
} from '../../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isBanned: boolean;
}

interface Shop {
  id: string;
  name: string;
  owner: string;
  status: string; // e.g., 'Pending', 'Approved', 'Suspended'
}

interface MasterProduct {
  id: number;
  name: string;
  category: string;
  brand: string;
}

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

const AdminDashboardPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [masterProducts, setMasterProducts] = useState<MasterProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [newMasterProductName, setNewMasterProductName] = useState('');
  const [newMasterProductCategory, setNewMasterProductCategory] = useState('');
  const [newMasterProductBrand, setNewMasterProductBrand] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || user?.role !== 'admin') {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const [fetchedUsers, fetchedShops, fetchedMasterProducts, fetchedCategories, fetchedBrands] = await Promise.all([
          getAllUsers(),
          getAllShops(),
          getMasterProducts(),
          getCategories(),
          getBrands(),
        ]);
        setUsers(fetchedUsers as User[]);
        setShops(fetchedShops as Shop[]);
        setMasterProducts(fetchedMasterProducts as MasterProduct[]);
        setCategories(fetchedCategories as Category[]);
        setBrands(fetchedBrands as Brand[]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch admin data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, user]);

  const handleBanUser = async (userId: string) => {
    if (!confirm('Are you sure you want to ban this user?')) return;
    setLoading(true);
    try {
      await banUser(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, isBanned: true } : u));
      alert('User banned successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to ban user.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveShop = async (shopId: string) => {
    if (!confirm('Are you sure you want to approve this shop?')) return;
    setLoading(true);
    try {
      await approveShop(shopId);
      setShops(shops.map(s => s.id === shopId ? { ...s, status: 'Approved' } : s));
      alert('Shop approved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to approve shop.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendShop = async (shopId: string) => {
    if (!confirm('Are you sure you want to suspend this shop?')) return;
    setLoading(true);
    try {
      await suspendShop(shopId);
      setShops(shops.map(s => s.id === shopId ? { ...s, status: 'Suspended' } : s));
      alert('Shop suspended successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to suspend shop.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMasterProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newProduct = await addMasterProduct({
        name: newMasterProductName,
        category: newMasterProductCategory,
        brand: newMasterProductBrand,
      });
      setMasterProducts((prev) => [...prev, newProduct as MasterProduct]);
      setNewMasterProductName('');
      setNewMasterProductCategory('');
      setNewMasterProductBrand('');
      alert('Master product added successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to add master product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMasterProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this master product?')) return;
    setLoading(true);
    try {
      await deleteMasterProduct(productId);
      setMasterProducts((prev) => prev.filter((p) => p.id !== productId));
      alert('Master product deleted successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to delete master product.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newCat = await addCategory(newCategoryName);
      setCategories((prev) => [...prev, newCat as Category]);
      setNewCategoryName('');
      alert('Category added successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to add category.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newBrand = await addBrand(newBrandName);
      setBrands((prev) => [...prev, newBrand as Brand]);
      setNewBrandName('');
      alert('Brand added successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to add brand.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading admin dashboard...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div className="flex justify-center items-center h-full text-red-500">Access Denied: You must be an administrator to view this page.</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Admin Dashboard</h1>

      {/* User Management Section */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-white">User Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="py-3 px-5 text-left">Username</th>
                <th className="py-3 px-5 text-left">Email</th>
                <th className="py-3 px-5 text-left">Role</th>
                <th className="py-3 px-5 text-left">Status</th>
                <th className="py-3 px-5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors duration-200">
                  <td className="py-3 px-5 text-gray-300">{u.username}</td>
                  <td className="py-3 px-5 text-gray-300">{u.email}</td>
                  <td className="py-3 px-5 text-gray-300">{u.role}</td>
                  <td className="py-3 px-5 text-gray-300">{u.isBanned ? 'Banned' : 'Active'}</td>
                  <td className="py-3 px-5">
                    {!u.isBanned && (
                      <button
                        onClick={() => handleBanUser(u.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-200 hover:scale-105"
                        disabled={loading}
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shop Management Section */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Shop Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="py-3 px-5 text-left">Shop Name</th>
                <th className="py-3 px-5 text-left">Owner</th>
                <th className="py-3 px-5 text-left">Status</th>
                <th className="py-3 px-5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((s) => (
                <tr key={s.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors duration-200">
                  <td className="py-3 px-5 text-gray-300">{s.name}</td>
                  <td className="py-3 px-5 text-gray-300">{s.owner}</td>
                  <td className="py-3 px-5 text-gray-300">{s.status}</td>
                  <td className="py-3 px-5">
                    {s.status === 'Pending' && (
                      <button
                        onClick={() => handleApproveShop(s.id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full text-sm mr-2 transition-all duration-200 hover:scale-105"
                        disabled={loading}
                      >
                        Approve
                      </button>
                    )}
                    {s.status !== 'Suspended' && (
                      <button
                        onClick={() => handleSuspendShop(s.id)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-200 hover:scale-105"
                        disabled={loading}
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Catalog Management Section */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Master Product Catalog Management</h2>
        <form onSubmit={handleAddMasterProduct} className="space-y-6 mb-8 p-6 border border-gray-700/50 rounded-xl bg-gray-800/50">
          <h3 className="text-xl font-bold mb-4 text-white">Add New Master Product</h3>
          <div>
            <label htmlFor="newMasterProductName" className="block text-gray-300 text-sm font-bold mb-2">Product Name</label>
            <input type="text" id="newMasterProductName" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" value={newMasterProductName} onChange={(e) => setNewMasterProductName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="newMasterProductCategory" className="block text-gray-300 text-sm font-bold mb-2">Category</label>
            <input type="text" id="newMasterProductCategory" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" value={newMasterProductCategory} onChange={(e) => setNewMasterProductCategory(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="newMasterProductBrand" className="block text-gray-300 text-sm font-bold mb-2">Brand</label>
            <input type="text" id="newMasterProductBrand" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" value={newMasterProductBrand} onChange={(e) => setNewMasterProductBrand(e.target.value)} required />
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105" disabled={loading}>
            {loading ? 'Adding...' : 'Add Master Product'}
          </button>
        </form>

        <h3 className="text-xl font-bold mb-4 text-white">Existing Master Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="py-3 px-5 text-left">Name</th>
                <th className="py-3 px-5 text-left">Category</th>
                <th className="py-3 px-5 text-left">Brand</th>
                <th className="py-3 px-5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {masterProducts.map((p) => (
                <tr key={p.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors duration-200">
                  <td className="py-3 px-5 text-gray-300">{p.name}</td>
                  <td className="py-3 px-5 text-gray-300">{p.category}</td>
                  <td className="py-3 px-5 text-gray-300">{p.brand}</td>
                  <td className="py-3 px-5">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm mr-2 transition-all duration-200 hover:scale-105">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMasterProduct(p.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-200 hover:scale-105"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Management Section */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-white">Category Management</h2>
        <form onSubmit={handleAddCategory} className="space-y-6 mb-8 p-6 border border-gray-700/50 rounded-xl bg-gray-800/50">
          <h3 className="text-xl font-bold mb-4 text-white">Add New Category</h3>
          <div>
            <label htmlFor="newCategoryName" className="block text-gray-300 text-sm font-bold mb-2">Category Name</label>
            <input type="text" id="newCategoryName" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required />
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105" disabled={loading}>
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </form>

        <h3 className="text-xl font-bold mb-4 text-white">Existing Categories</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="py-3 px-5 text-left">Name</th>
                <th className="py-3 px-5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors duration-200">
                  <td className="py-3 px-5 text-gray-300">{cat.name}</td>
                  <td className="py-3 px-5">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm mr-2 transition-all duration-200 hover:scale-105">
                      Edit
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-200 hover:scale-105">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Brand Management Section */}
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        <h2 className="text-2xl font-bold mb-6 text-white">Brand Management</h2>
        <form onSubmit={handleAddBrand} className="space-y-6 mb-8 p-6 border border-gray-700/50 rounded-xl bg-gray-800/50">
          <h3 className="text-xl font-bold mb-4 text-white">Add New Brand</h3>
          <div>
            <label htmlFor="newBrandName" className="block text-gray-300 text-sm font-bold mb-2">Brand Name</label>
            <input type="text" id="newBrandName" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} required />
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105" disabled={loading}>
            {loading ? 'Adding...' : 'Add Brand'}
          </button>
        </form>

        <h3 className="text-xl font-bold mb-4 text-white">Existing Brands</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="py-3 px-5 text-left">Name</th>
                <th className="py-3 px-5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors duration-200">
                  <td className="py-3 px-5 text-gray-300">{brand.name}</td>
                  <td className="py-3 px-5">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm mr-2 transition-all duration-200 hover:scale-105">
                      Edit
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm transition-all duration-200 hover:scale-105">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
