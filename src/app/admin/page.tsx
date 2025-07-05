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
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* User Management Section */}
      <div className="w-full max-w-4xl bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-2 px-4 text-left">Username</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Role</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-700 last:border-b-0">
                  <td className="py-2 px-4">{u.username}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4">{u.role}</td>
                  <td className="py-2 px-4">{u.isBanned ? 'Banned' : 'Active'}</td>
                  <td className="py-2 px-4">
                    {!u.isBanned && (
                      <button
                        onClick={() => handleBanUser(u.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-sm"
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
      <div className="w-full max-w-4xl bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Shop Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-2 px-4 text-left">Shop Name</th>
                <th className="py-2 px-4 text-left">Owner</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((s) => (
                <tr key={s.id} className="border-b border-gray-700 last:border-b-0">
                  <td className="py-2 px-4">{s.name}</td>
                  <td className="py-2 px-4">{s.owner}</td>
                  <td className="py-2 px-4">{s.status}</td>
                  <td className="py-2 px-4">
                    {s.status === 'Pending' && (
                      <button
                        onClick={() => handleApproveShop(s.id)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-full text-sm mr-2"
                        disabled={loading}
                      >
                        Approve
                      </button>
                    )}
                    {s.status !== 'Suspended' && (
                      <button
                        onClick={() => handleSuspendShop(s.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-full text-sm"
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
      <div className="w-full max-w-4xl bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Master Product Catalog Management</h2>
        <form onSubmit={handleAddMasterProduct} className="space-y-4 mb-6 p-4 border border-gray-800 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Add New Master Product</h3>
          <div>
            <label htmlFor="newMasterProductName" className="block text-gray-300 text-sm font-bold mb-2">Product Name</label>
            <input type="text" id="newMasterProductName" className="input-field" value={newMasterProductName} onChange={(e) => setNewMasterProductName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="newMasterProductCategory" className="block text-gray-300 text-sm font-bold mb-2">Category</label>
            <input type="text" id="newMasterProductCategory" className="input-field" value={newMasterProductCategory} onChange={(e) => setNewMasterProductCategory(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="newMasterProductBrand" className="block text-gray-300 text-sm font-bold mb-2">Brand</label>
            <input type="text" id="newMasterProductBrand" className="input-field" value={newMasterProductBrand} onChange={(e) => setNewMasterProductBrand(e.target.value)} required />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Master Product'}
          </button>
        </form>

        <h3 className="text-xl font-bold mb-2">Existing Master Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Brand</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {masterProducts.map((p) => (
                <tr key={p.id} className="border-b border-gray-700 last:border-b-0">
                  <td className="py-2 px-4">{p.name}</td>
                  <td className="py-2 px-4">{p.category}</td>
                  <td className="py-2 px-4">{p.brand}</td>
                  <td className="py-2 px-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full text-sm mr-2">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMasterProduct(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-sm"
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
      <div className="w-full max-w-4xl bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Category Management</h2>
        <form onSubmit={handleAddCategory} className="space-y-4 mb-6 p-4 border border-gray-800 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Add New Category</h3>
          <div>
            <label htmlFor="newCategoryName" className="block text-gray-300 text-sm font-bold mb-2">Category Name</label>
            <input type="text" id="newCategoryName" className="input-field" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </form>

        <h3 className="text-xl font-bold mb-2">Existing Categories</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-700 last:border-b-0">
                  <td className="py-2 px-4">{cat.name}</td>
                  <td className="py-2 px-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full text-sm mr-2">
                      Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-sm">
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
      <div className="w-full max-w-4xl bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Brand Management</h2>
        <form onSubmit={handleAddBrand} className="space-y-4 mb-6 p-4 border border-gray-800 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Add New Brand</h3>
          <div>
            <label htmlFor="newBrandName" className="block text-gray-300 text-sm font-bold mb-2">Brand Name</label>
            <input type="text" id="newBrandName" className="input-field" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} required />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add Brand'}
          </button>
        </form>

        <h3 className="text-xl font-bold mb-2">Existing Brands</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} className="border-b border-gray-700 last:border-b-0">
                  <td className="py-2 px-4">{brand.name}</td>
                  <td className="py-2 px-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full text-sm mr-2">
                      Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-sm">
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
