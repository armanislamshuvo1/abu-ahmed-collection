import React, { useState, useEffect, useCallback } from 'react';
import {
  Crown, LayoutDashboard, ShoppingBag, Layers, Settings, CreditCard,
  Plus, Edit, Trash2, CheckCircle2, Clock, Truck, Eye, RefreshCw,
  Search, ExternalLink, MessageCircle, AlertTriangle, ChevronRight, X, Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getAdminStats, getOrdersAdmin, updateOrderStatusAdmin, getOrderByIdAdmin } from '../../services/orderService';
import {
  getProducts, createProduct, updateProduct, deleteProduct, toggleStock,
  getAllCategoriesAdmin, createCategory, deleteCategory
} from '../../services/productService';
import {
  getAdminSettings, updateDeliverySettings, updateGeneralSettings,
  getPaymentMethodsAdmin, createPaymentMethod, updatePaymentMethod, deletePaymentMethod
} from '../../services/settingsService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const AdminDashboard = ({ onNavigate }) => {
  const { admin, adminLogout, refreshSettings } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // overview, orders, products, categories, delivery, payments
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Orders Tab State
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Products Tab State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Dhakai Jamdani',
    fabric: 'Jamdani Cotton',
    regularPrice: '',
    discountPrice: '',
    stock: '10',
    inStock: true,
    isFeatured: false,
    isNewArrival: true,
    blousePiece: true,
    colors: '',
    description: '',
    careInstructions: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [savingProduct, setSavingProduct] = useState(false);

  // Categories Tab State
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImg, setNewCatImg] = useState('');

  // Delivery Settings Tab State
  const [deliverySettings, setDeliverySettings] = useState(null);
  const [insideDhakaFee, setInsideDhakaFee] = useState(80);
  const [outsideDhakaFee, setOutsideDhakaFee] = useState(150);
  const [freeThreshold, setFreeThreshold] = useState(5000);
  const [storePhone, setStorePhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [savingDelivery, setSavingDelivery] = useState(false);

  // Payment Methods Tab State
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [newPayMethod, setNewPayMethod] = useState({
    name: '',
    code: '',
    type: 'mobile_banking',
    accountNumber: '',
    accountType: 'Personal',
    instructions: '',
    requiresTransactionId: true,
    isActive: true
  });

  // Check auth
  useEffect(() => {
    if (!admin) {
      onNavigate('/admin/login');
    }
  }, [admin, onNavigate]);

  // Load Overview Stats
  const loadStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Load Orders
  const loadOrders = useCallback(async () => {
    try {
      setLoadingOrders(true);
      const data = await getOrdersAdmin({
        status: orderStatusFilter !== 'All' ? orderStatusFilter : undefined,
        search: orderSearch || undefined
      });
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  }, [orderStatusFilter, orderSearch]);

  // Load Products
  const loadProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // Load Categories
  const loadCategories = useCallback(async () => {
    try {
      const data = await getAllCategoriesAdmin();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Load Settings
  const loadSettingsData = useCallback(async () => {
    try {
      const data = await getAdminSettings();
      setDeliverySettings(data);
      const inZone = data.deliveryZones?.find(z => z.key === 'inside_dhaka');
      const outZone = data.deliveryZones?.find(z => z.key === 'outside_dhaka');
      if (inZone) setInsideDhakaFee(inZone.fee);
      if (outZone) setOutsideDhakaFee(outZone.fee);
      if (data.freeShippingThreshold !== undefined) setFreeThreshold(data.freeShippingThreshold);
      if (data.storePhone) setStorePhone(data.storePhone);
      if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
      if (data.storeEmail) setStoreEmail(data.storeEmail);
      if (data.storeAddress) setStoreAddress(data.storeAddress);
      if (data.facebookUrl) setFacebookUrl(data.facebookUrl);

      const methods = await getPaymentMethodsAdmin();
      setPaymentMethods(methods);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (admin) {
      loadStats();
      loadOrders();
      loadProducts();
      loadCategories();
      loadSettingsData();
    }
  }, [admin, loadStats, loadOrders, loadProducts, loadCategories, loadSettingsData]);

  if (!admin) return null;

  // ---------------- Handlers ----------------

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusAdmin(orderId, newStatus, `Status updated to ${newStatus}`);
      addToast(`Order #${orderId} updated to ${newStatus}`, 'success');
      loadOrders();
      loadStats();
      if (selectedOrderDetails?.order?._id === orderId) {
        const refreshed = await getOrderByIdAdmin(orderId);
        setSelectedOrderDetails(refreshed);
      }
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleToggleProductStock = async (id) => {
    try {
      await toggleStock(id);
      addToast('Product stock status updated', 'success');
      loadProducts();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete saree: "${name}"?`)) return;
    try {
      await deleteProduct(id);
      addToast('Product deleted', 'info');
      loadProducts();
      loadStats();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const openProductModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      setProductForm({
        name: product.name,
        category: product.category,
        fabric: product.fabric,
        regularPrice: product.regularPrice,
        discountPrice: product.discountPrice || '',
        stock: product.stock,
        inStock: product.inStock,
        isFeatured: product.isFeatured,
        isNewArrival: product.isNewArrival,
        blousePiece: product.blousePiece,
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
        description: product.description,
        careInstructions: product.careInstructions || ''
      });
    } else {
      setProductForm({
        name: '',
        category: categories[0]?.name || 'Dhakai Jamdani',
        fabric: 'Jamdani Cotton',
        regularPrice: '',
        discountPrice: '',
        stock: '10',
        inStock: true,
        isFeatured: false,
        isNewArrival: true,
        blousePiece: true,
        colors: 'Gold, Black',
        description: '',
        careInstructions: 'Dry clean recommended.'
      });
    }
    setUploadedFiles([]);
    setProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const formData = new FormData();
      Object.entries(productForm).forEach(([k, v]) => {
        formData.append(k, v);
      });

      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append('images', uploadedFiles[i]);
      }

      if (editingProduct) {
        if (editingProduct.images) {
          editingProduct.images.forEach(img => formData.append('keptImages', img));
        }
        await updateProduct(editingProduct._id, formData);
        addToast('Saree details updated successfully!', 'success');
      } else {
        await createProduct(formData);
        addToast('New saree created and added to storefront!', 'success');
      }

      setProductModalOpen(false);
      loadProducts();
      loadStats();
    } catch (err) {
      addToast(err.message || 'Failed to save product', 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleSaveDeliverySettings = async (e) => {
    e.preventDefault();
    setSavingDelivery(true);
    try {
      const updatedZones = [
        {
          key: 'inside_dhaka',
          name: 'Inside Dhaka',
          fee: Number(insideDhakaFee),
          estimatedDays: '1-2 Days',
          isActive: true
        },
        {
          key: 'outside_dhaka',
          name: 'Outside Dhaka',
          fee: Number(outsideDhakaFee),
          estimatedDays: '3-5 Days',
          isActive: true
        }
      ];

      await updateDeliverySettings({
        deliveryZones: updatedZones,
        freeShippingThreshold: Number(freeThreshold)
      });

      await updateGeneralSettings({
        storePhone: storePhone.trim(),
        whatsappNumber: whatsappNumber.trim(),
        storeEmail: storeEmail.trim(),
        storeAddress: storeAddress.trim(),
        facebookUrl: facebookUrl.trim()
      });

      refreshSettings();
      addToast('Delivery rates and store contacts updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update delivery settings', 'error');
    } finally {
      setSavingDelivery(false);
    }
  };

  const handleCreatePaymentMethod = async (e) => {
    e.preventDefault();
    try {
      await createPaymentMethod(newPayMethod);
      addToast(`Payment method "${newPayMethod.name}" created!`, 'success');
      setPaymentModalOpen(false);
      setNewPayMethod({
        name: '',
        code: '',
        type: 'mobile_banking',
        accountNumber: '',
        accountType: 'Personal',
        instructions: '',
        requiresTransactionId: true,
        isActive: true
      });
      loadSettingsData();
    } catch (err) {
      addToast(err.message || 'Failed to create payment method', 'error');
    }
  };

  const handleTogglePaymentMethod = async (method) => {
    try {
      await updatePaymentMethod(method._id, { isActive: !method.isActive });
      addToast(`Status changed for ${method.name}`, 'info');
      loadSettingsData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeletePaymentMethod = async (id, name) => {
    if (!window.confirm(`Delete payment method "${name}"?`)) return;
    try {
      await deletePaymentMethod(id);
      addToast('Payment method deleted', 'info');
      loadSettingsData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await createCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim(),
        image: newCatImg.trim() || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
      });
      addToast(`Category "${newCatName}" created!`, 'success');
      setNewCatName('');
      setNewCatDesc('');
      setNewCatImg('');
      loadCategories();
    } catch (err) {
      addToast(err.message || 'Failed to create category', 'error');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteCategory(id);
      addToast('Category deleted', 'info');
      loadCategories();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-royal-black text-white px-6 py-4 border-b border-gold/30 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-gold overflow-hidden bg-black shrink-0">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-gold" />
              <h1 className="font-serif font-bold text-base text-gold-light">
                Abu Ahmed Collection • Admin
              </h1>
            </div>
            <p className="text-[11px] text-zinc-400">Signed in as {admin.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-zinc-300 hover:text-gold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-gold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Website</span>
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={adminLogout}
            className="text-xs text-red-400 border-red-500/30 hover:bg-red-950/40"
          >
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar Tabs */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-zinc-200 p-3 shadow-soft space-y-1 sticky top-24">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-royal-black text-gold shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-royal-black'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'orders'
                  ? 'bg-royal-black text-gold shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-royal-black'
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4" />
                <span>Orders & Deliveries</span>
              </div>
              {stats?.pendingOrders > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {stats.pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'products'
                  ? 'bg-royal-black text-gold shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-royal-black'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Saree Inventory</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'categories'
                  ? 'bg-royal-black text-gold shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-royal-black'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Saree Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'delivery'
                  ? 'bg-royal-black text-gold shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-royal-black'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Delivery Fee Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'payments'
                  ? 'bg-royal-black text-gold shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-royal-black'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payment Methods</span>
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-soft">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Total Revenue
                  </span>
                  <span className="font-serif text-2xl font-bold text-royal-black mt-1 block">
                    ৳{stats?.totalRevenue?.toLocaleString() || 0}
                  </span>
                  <span className="text-[11px] text-emerald-600 mt-1 block">From confirmed sales</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-soft">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Total Orders
                  </span>
                  <span className="font-serif text-2xl font-bold text-royal-black mt-1 block">
                    {stats?.totalOrders || 0}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">{stats?.deliveredOrders || 0} delivered</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-soft">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Pending Orders
                  </span>
                  <span className="font-serif text-2xl font-bold text-amber-600 mt-1 block">
                    {stats?.pendingOrders || 0}
                  </span>
                  <span className="text-[11px] text-amber-700 mt-1 block">Requires phone call</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-soft">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Sarees in Catalog
                  </span>
                  <span className="font-serif text-2xl font-bold text-royal-black mt-1 block">
                    {stats?.totalProducts || 0}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">Active online</span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-soft p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-royal-black">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-gold-deep hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider">
                        <th className="py-2.5">Order ID</th>
                        <th className="py-2.5">Customer</th>
                        <th className="py-2.5">Phone</th>
                        <th className="py-2.5">Amount</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {stats?.recentOrders?.map(ord => (
                        <tr key={ord._id} className="hover:bg-zinc-50">
                          <td className="py-3 font-mono font-bold text-royal-black">#{ord.orderId}</td>
                          <td className="py-3 font-medium">{ord.customer.name}</td>
                          <td className="py-3 text-zinc-600">{ord.customer.phone}</td>
                          <td className="py-3 font-bold text-royal-black">৳{ord.total.toLocaleString()}</td>
                          <td className="py-3">
                            <Badge variant={ord.status.toLowerCase()}>{ord.status}</Badge>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrderDetails({ order: ord });
                              }}
                              className="text-gold-deep hover:underline font-bold"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-soft p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-royal-black">
                    Customer Orders Management
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    View full customer contact details, delivery addresses, update statuses & send WhatsApp invoices.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search ID, phone, name..."
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                      className="bg-zinc-50 border border-zinc-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-royal-black focus:border-gold focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    onClick={loadOrders}
                    className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
                    title="Refresh Orders"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="flex flex-wrap gap-2 text-xs">
                {['All', 'Pending Payment', 'Verifying Payment', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-royal-black text-gold'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              {loadingOrders ? (
                <div className="py-12 text-center text-zinc-400 animate-pulse">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center text-zinc-400">No orders found matching criteria.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider">
                        <th className="py-3">Order ID</th>
                        <th className="py-3">Customer & Contact</th>
                        <th className="py-3">Delivery Zone</th>
                        <th className="py-3">Payment</th>
                        <th className="py-3">Total</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {orders.map(order => (
                        <tr key={order._id} className="hover:bg-zinc-50">
                          <td className="py-3.5 font-mono font-bold text-royal-black">
                            #{order.orderId}
                          </td>
                          <td className="py-3.5">
                            <p className="font-semibold text-royal-black">{order.customer.name}</p>
                            <p className="text-zinc-500 font-mono">{order.customer.phone}</p>
                            <p className="text-[11px] text-zinc-400 truncate max-w-xs">{order.customer.email}</p>
                          </td>
                          <td className="py-3.5 text-zinc-600">
                            {order.customer.deliveryZoneName}
                          </td>
                          <td className="py-3.5">
                            <span className="font-medium text-royal-black">{order.paymentMethod?.name}</span>
                            {order.paymentMethod?.transactionId && (
                              <span className="block font-mono text-[10px] text-emerald-700">
                                Trx: {order.paymentMethod.transactionId}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 font-bold text-royal-black">
                            ৳{order.total.toLocaleString()}
                          </td>
                          <td className="py-3.5">
                            <select
                              value={order.status}
                              onChange={e => handleStatusChange(order._id, e.target.value)}
                              className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs font-semibold text-royal-black focus:border-gold focus:outline-none"
                            >
                              <option value="Pending Payment">Pending Payment</option>
                              <option value="Verifying Payment">Verifying Payment</option>
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3.5 text-right space-x-2">
                            <button
                              onClick={() => {
                                getOrderByIdAdmin(order._id).then(setSelectedOrderDetails);
                              }}
                              className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-royal-black font-semibold"
                              title="View Full Order Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS INVENTORY */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-soft p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-royal-black">
                    Saree Catalog & Stock Manager
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Add new sarees with multiple photos, set prices, discount deals, and toggle stock.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openProductModal(null)}
                  className="flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Saree</span>
                </Button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider">
                      <th className="py-3">Photo</th>
                      <th className="py-3">Saree Title</th>
                      <th className="py-3">Category / Fabric</th>
                      <th className="py-3">Regular / Discount</th>
                      <th className="py-3">Stock Status</th>
                      <th className="py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {products.map(product => (
                      <tr key={product._id} className="hover:bg-zinc-50">
                        <td className="py-3">
                          <img
                            src={(product.images && product.images[0]) || '/logo.jpg'}
                            alt={product.name}
                            className="w-12 h-14 object-cover rounded-lg bg-zinc-100 border border-zinc-200"
                            onError={e => { e.target.src = '/logo.jpg'; }}
                          />
                        </td>
                        <td className="py-3 max-w-xs">
                          <p className="font-serif font-bold text-royal-black truncate">{product.name}</p>
                          <p className="text-[11px] text-zinc-400">Slug: {product.slug}</p>
                        </td>
                        <td className="py-3">
                          <span className="font-medium text-royal-black block">{product.category}</span>
                          <span className="text-[11px] text-zinc-500">{product.fabric}</span>
                        </td>
                        <td className="py-3">
                          <span className="font-bold text-royal-black block">৳{product.regularPrice.toLocaleString()}</span>
                          {product.discountPrice && (
                            <span className="text-emerald-700 font-semibold text-[11px]">
                              Discount: ৳{product.discountPrice.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => handleToggleProductStock(product._id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              product.inStock
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => openProductModal(product)}
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                            title="Edit Saree"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                            title="Delete Saree"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-soft p-6 space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-royal-black">
                  Saree Categories Management
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Organize sarees by weaving region and design types (Jamdani, Silk, Cotton, etc.).
                </p>
              </div>

              {/* Add category form */}
              <form onSubmit={handleCreateCategory} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-royal-black">Create New Category</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Category Name (e.g. Dhakai Jamdani)"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-xs bg-white text-royal-black focus:border-gold focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Short Description"
                    value={newCatDesc}
                    onChange={e => setNewCatDesc(e.target.value)}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-xs bg-white text-royal-black focus:border-gold focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Cover Photo URL (optional)"
                    value={newCatImg}
                    onChange={e => setNewCatImg(e.target.value)}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-xs bg-white text-royal-black focus:border-gold focus:outline-none"
                  />
                </div>
                <Button type="submit" variant="primary" size="sm">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Save Category</span>
                </Button>
              </form>

              {/* Categories List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <div key={cat._id} className="p-4 rounded-xl border border-zinc-200 bg-white flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-royal-black">{cat.name}</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{cat.slug}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat._id, cat.name)}
                      className="p-1.5 text-zinc-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DELIVERY FEE SETTINGS */}
          {activeTab === 'delivery' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-soft p-6 space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-royal-black">
                  Delivery Charges & Store Settings
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Update shipping fees for Inside Dhaka, Outside Dhaka, and free delivery thresholds as you wish.
                </p>
              </div>

              <form onSubmit={handleSaveDeliverySettings} className="space-y-5 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                      Inside Dhaka Delivery Fee (৳)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={insideDhakaFee}
                      onChange={e => setInsideDhakaFee(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
                    />
                    <span className="text-[10px] text-zinc-400">Standard ৳80</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                      Outside Dhaka Delivery Fee (৳)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={outsideDhakaFee}
                      onChange={e => setOutsideDhakaFee(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
                    />
                    <span className="text-[10px] text-zinc-400">Standard ৳150</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                    Free Delivery Threshold (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={freeThreshold}
                    onChange={e => setFreeThreshold(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
                  />
                  <span className="text-[10px] text-zinc-400">
                    Orders with subtotal at or above this amount receive 100% Free Shipping.
                  </span>
                </div>

                <div className="pt-4 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                      Store Helpline Phone Number
                    </label>
                    <input
                      type="text"
                      value={storePhone}
                      onChange={e => setStorePhone(e.target.value)}
                      placeholder="+880 1806-732097"
                      className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                      Store Owner WhatsApp Number (e.g. 8801806732097)
                    </label>
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={e => setWhatsappNumber(e.target.value)}
                      placeholder="8801806732097"
                      className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                      Store Email
                    </label>
                    <input
                      type="email"
                      value={storeEmail}
                      onChange={e => setStoreEmail(e.target.value)}
                      placeholder="mabuahmedsons786@gmail.com"
                      className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                      Official Facebook Page URL
                    </label>
                    <input
                      type="url"
                      value={facebookUrl}
                      onChange={e => setFacebookUrl(e.target.value)}
                      placeholder="https://www.facebook.com/people/Abu-Ahmed-Collection/..."
                      className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                      Store Physical Address
                    </label>
                    <input
                      type="text"
                      value={storeAddress}
                      onChange={e => setStoreAddress(e.target.value)}
                      placeholder="Shop No. 106, RS Road, Reazuddin Bazar, Chittagong, Bangladesh"
                      className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={savingDelivery}
                  className="py-2.5 px-6"
                >
                  Save Delivery Settings
                </Button>
              </form>
            </div>
          )}

          {/* TAB 6: PAYMENT METHODS MANAGER */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-soft p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-royal-black">
                    Payment Methods Configuration
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Create and manage payment options (Cash on Delivery, bKash, Nagad, Rocket, Bank Transfer).
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setPaymentModalOpen(true)}
                  className="flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Payment Method</span>
                </Button>
              </div>

              {/* Methods list */}
              <div className="divide-y divide-zinc-200">
                {paymentMethods.map(method => (
                  <div key={method._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-royal-black">{method.name}</h4>
                        <span className="font-mono text-[10px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                          {method.code}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            method.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-500'
                          }`}
                        >
                          {method.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      {method.accountNumber && (
                        <p className="text-xs text-zinc-600 mt-1">
                          Account: <strong>{method.accountNumber}</strong> ({method.accountType})
                        </p>
                      )}
                      {method.instructions && (
                        <p className="text-[11px] text-zinc-500 mt-0.5 max-w-xl">{method.instructions}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePaymentMethod(method)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${
                          method.isActive
                            ? 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                            : 'border-emerald-500 text-emerald-700 bg-emerald-50'
                        }`}
                      >
                        {method.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDeletePaymentMethod(method._id, method.name)}
                        className="p-1.5 text-zinc-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Saree Add / Edit with Multi-image upload */}
      <Modal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title={editingProduct ? 'Edit Saree' : 'Add New Saree to Catalog'}
        subtitle="Upload saree images, set regular & discount price, category & stock"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-royal-black mb-1">
              Saree Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={productForm.name}
              onChange={e => setProductForm({ ...productForm, name: e.target.value })}
              placeholder="e.g. Royal Maroon & Gold Zari Dhakai Jamdani"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">Category</label>
              <select
                value={productForm.category}
                onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
              >
                {categories.map(c => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">Fabric Type</label>
              <input
                type="text"
                required
                value={productForm.fabric}
                onChange={e => setProductForm({ ...productForm, fabric: e.target.value })}
                placeholder="e.g. Dhakai Jamdani Cotton"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">
                Regular Price (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={productForm.regularPrice}
                onChange={e => setProductForm({ ...productForm, regularPrice: e.target.value })}
                placeholder="3500"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">
                Discount Price (৳)
              </label>
              <input
                type="number"
                min={0}
                value={productForm.discountPrice}
                onChange={e => setProductForm({ ...productForm, discountPrice: e.target.value })}
                placeholder="2950 (optional)"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">Stock Quantity</label>
              <input
                type="number"
                min={0}
                value={productForm.stock}
                onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Multiple Image Uploads */}
          <div>
            <label className="block text-xs font-semibold text-royal-black mb-1">
              Upload Saree Photos (Multiple allowed)
            </label>
            <div className="border-2 border-dashed border-zinc-300 rounded-xl p-4 text-center hover:border-gold transition-colors">
              <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={e => setUploadedFiles(e.target.files)}
                className="text-xs text-zinc-600 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-royal-black file:text-gold"
              />
              <p className="text-[11px] text-zinc-400 mt-1">JPEG, PNG, WEBP up to 10MB each.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">Colors (comma separated)</label>
              <input
                type="text"
                value={productForm.colors}
                onChange={e => setProductForm({ ...productForm, colors: e.target.value })}
                placeholder="Gold, Black, Maroon"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 text-xs font-medium text-royal-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={productForm.blousePiece}
                  onChange={e => setProductForm({ ...productForm, blousePiece: e.target.checked })}
                  className="rounded border-zinc-300 text-gold focus:ring-gold"
                />
                <span>Includes Blouse Piece</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-royal-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={productForm.isFeatured}
                  onChange={e => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                  className="rounded border-zinc-300 text-gold focus:ring-gold"
                />
                <span>Featured Saree</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-royal-black mb-1">Saree Craft Description</label>
            <textarea
              rows={3}
              required
              value={productForm.description}
              onChange={e => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Describe the weaving technique, anchol details, and aesthetics..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none resize-none"
            />
          </div>

          <Button type="submit" variant="primary" loading={savingProduct} className="w-full py-3">
            <span>{editingProduct ? 'Save Saree Changes' : 'Publish Saree to Website'}</span>
          </Button>
        </form>
      </Modal>

      {/* MODAL: Create Payment Method */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Create New Payment Method"
        subtitle="Add bKash, Nagad, Rocket, Bank Transfer, or Custom option"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreatePaymentMethod} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-royal-black mb-1">Method Name</label>
            <input
              type="text"
              required
              placeholder="e.g. bKash Merchant or Rocket Personal"
              value={newPayMethod.name}
              onChange={e => setNewPayMethod({ ...newPayMethod, name: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">Unique Code</label>
              <input
                type="text"
                required
                placeholder="bkash_merchant"
                value={newPayMethod.code}
                onChange={e => setNewPayMethod({ ...newPayMethod, code: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none lowercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">Payment Type</label>
              <select
                value={newPayMethod.type}
                onChange={e => setNewPayMethod({ ...newPayMethod, type: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
              >
                <option value="mobile_banking">Mobile Banking (bKash/Nagad/Rocket)</option>
                <option value="cod">Cash on Delivery</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">Account Number</label>
              <input
                type="text"
                placeholder="01XXXXXXXXX"
                value={newPayMethod.accountNumber}
                onChange={e => setNewPayMethod({ ...newPayMethod, accountNumber: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">Account Type</label>
              <input
                type="text"
                placeholder="Personal / Merchant"
                value={newPayMethod.accountType}
                onChange={e => setNewPayMethod({ ...newPayMethod, accountType: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-royal-black mb-1">Instructions for Customer</label>
            <textarea
              rows={2}
              value={newPayMethod.instructions}
              onChange={e => setNewPayMethod({ ...newPayMethod, instructions: e.target.value })}
              placeholder="e.g. Send Money to this number and provide TrxID"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none resize-none"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full py-2.5">
            <span>Save Payment Method</span>
          </Button>
        </form>
      </Modal>

      {/* MODAL: Full Order Inspector */}
      {selectedOrderDetails && (
        <Modal
          isOpen={!!selectedOrderDetails}
          onClose={() => setSelectedOrderDetails(null)}
          title={`Order #${selectedOrderDetails.order.orderId}`}
          subtitle={`Placed on ${new Date(selectedOrderDetails.order.createdAt).toLocaleString()}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Customer Details */}
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-1 text-zinc-600">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-royal-black uppercase tracking-wider text-[11px]">
                  Customer Contact
                </span>
                {selectedOrderDetails.customerWhatsAppUrl && (
                  <a
                    href={selectedOrderDetails.customerWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg text-[11px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Invoice</span>
                  </a>
                )}
              </div>
              <p><strong className="text-royal-black">Name:</strong> {selectedOrderDetails.order.customer.name}</p>
              <p><strong className="text-royal-black">Phone:</strong> {selectedOrderDetails.order.customer.phone}</p>
              <p><strong className="text-royal-black">Email:</strong> {selectedOrderDetails.order.customer.email}</p>
              <p><strong className="text-royal-black">Delivery Address:</strong> {selectedOrderDetails.order.customer.address}</p>
              <p><strong className="text-royal-black">Zone:</strong> {selectedOrderDetails.order.customer.deliveryZoneName}</p>
              {selectedOrderDetails.order.customer.notes && (
                <p><strong className="text-royal-black">Notes:</strong> {selectedOrderDetails.order.customer.notes}</p>
              )}
            </div>

            {/* Saree items */}
            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-royal-black">Ordered Sarees</h4>
              <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-xl overflow-hidden bg-white">
                {selectedOrderDetails.order.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt={it.name} className="w-10 h-12 object-cover rounded bg-zinc-100" />
                      <div>
                        <p className="font-semibold text-royal-black">{it.name}</p>
                        <p className="text-zinc-500">Qty: {it.quantity} × ৳{it.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="font-bold text-royal-black">৳{(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-sm text-royal-black pt-2 border-t">
              <span>Total Payable:</span>
              <span className="text-gold-deep text-base">৳{selectedOrderDetails.order.total.toLocaleString()}</span>
            </div>

            {/* Quick Status Update */}
            <div className="pt-2 border-t">
              <label className="block font-bold text-royal-black mb-1">Update Status</label>
              <div className="flex gap-2">
                <select
                  defaultValue={selectedOrderDetails.order.status}
                  onChange={e => handleStatusChange(selectedOrderDetails.order._id, e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold"
                >
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Verifying Payment">Verifying Payment</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
