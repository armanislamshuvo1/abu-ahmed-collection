import React, { useState, useEffect, useCallback } from 'react';
import {
  Crown, LayoutDashboard, ShoppingBag, Layers, Settings, CreditCard,
  Plus, Edit, Trash2, CheckCircle2, Clock, Truck, Eye, RefreshCw,
  Search, ExternalLink, MessageCircle, AlertTriangle, ChevronRight, X, Upload, MapPin
} from 'lucide-react';
import { getAllDistricts } from '../../data/bangladeshLocations';
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

const statusBanglaMap = {
  'All': 'সবগুলো',
  'Pending Payment': 'পেমেন্ট বাকি',
  'Verifying Payment': 'পেমেন্ট যাচাই চলছে',
  'Pending': 'অপেক্ষমাণ',
  'Confirmed': 'নিশ্চিত',
  'Processing': 'প্রস্তুত হচ্ছে',
  'Shipped': 'কুরিয়ারে আছে',
  'Delivered': 'ডেলিভারি সম্পন্ন',
  'Cancelled': 'বাতিল'
};

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
  const [districtOverrides, setDistrictOverrides] = useState([]);
  const [newDistrictName, setNewDistrictName] = useState('Chattogram');
  const [newDistrictFee, setNewDistrictFee] = useState('100');
  const [newDistrictDays, setNewDistrictDays] = useState('2-3 Days');

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
      if (data.districtOverrides) setDistrictOverrides(data.districtOverrides);

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
      addToast(`অর্ডার #${orderId}-এর স্ট্যাটাস পরিবর্তন: ${statusBanglaMap[newStatus] || newStatus}`, 'success');
      loadOrders();
      loadStats();
      if (selectedOrderDetails?.order?._id === orderId) {
        const refreshed = await getOrderByIdAdmin(orderId);
        setSelectedOrderDetails(refreshed);
      }
    } catch (err) {
      addToast(err.message || 'স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleToggleProductStock = async (id) => {
    try {
      await toggleStock(id);
      addToast('পণ্যের স্টক স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে', 'success');
      loadProducts();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে এই শাড়িটি মুছে ফেলতে চান: "${name}"?`)) return;
    try {
      await deleteProduct(id);
      addToast('শাড়িটি মুছে ফেলা হয়েছে', 'info');
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
        addToast('শাড়ির তথ্য সফলভাবে আপডেট করা হয়েছে!', 'success');
      } else {
        await createProduct(formData);
        addToast('নতুন শাড়ি তৈরি হয়েছে এবং ওয়েবসাইটে যোগ করা হয়েছে!', 'success');
      }

      setProductModalOpen(false);
      loadProducts();
      loadStats();
    } catch (err) {
      addToast(err.message || 'শাড়ি সংরক্ষণ করতে ব্যর্থ হয়েছে', 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleAddDistrictOverride = (e) => {
    e?.preventDefault();
    if (!newDistrictName) return;
    if (districtOverrides.some(d => d.district.toLowerCase() === newDistrictName.toLowerCase())) {
      addToast(`${newDistrictName} জেলাটি ইতিমধ্যে জেলাভিত্তিক ডেলিভারি তালিকায় যোগ করা আছে।`, 'error');
      return;
    }
    setDistrictOverrides(prev => [
      ...prev,
      {
        district: newDistrictName,
        fee: Math.max(0, Number(newDistrictFee) || 0),
        estimatedDays: newDistrictDays || '2-3 Days',
        isActive: true
      }
    ]);
    addToast(`${newDistrictName} জেলার ডেলিভারি চার্জ (৳${newDistrictFee}) যোগ করা হয়েছে। সংরক্ষণ করতে নিচের বাটনে ক্লিক করুন।`, 'success');
  };

  const handleRemoveDistrictOverride = (districtName) => {
    setDistrictOverrides(prev => prev.filter(d => d.district !== districtName));
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
        districtOverrides,
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
      addToast('ডেলিভারি চার্জ ও যোগাযোগের তথ্য সফলভাবে আপডেট করা হয়েছে!', 'success');
    } catch (err) {
      addToast(err.message || 'ডেলিভারি সেটিংস আপডেট করতে ব্যর্থ হয়েছে', 'error');
    } finally {
      setSavingDelivery(false);
    }
  };

  const handleCreatePaymentMethod = async (e) => {
    e.preventDefault();
    try {
      await createPaymentMethod(newPayMethod);
      addToast(`পেমেন্ট পদ্ধতি "${newPayMethod.name}" তৈরি হয়েছে!`, 'success');
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
      addToast(err.message || 'পেমেন্ট পদ্ধতি তৈরি করতে ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleTogglePaymentMethod = async (method) => {
    try {
      await updatePaymentMethod(method._id, { isActive: !method.isActive });
      addToast(`${method.name}-এর স্ট্যাটাস পরিবর্তন করা হয়েছে`, 'info');
      loadSettingsData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeletePaymentMethod = async (id, name) => {
    if (!window.confirm(`আপনি কি "${name}" পেমেন্ট পদ্ধতিটি মুছে ফেলতে চান?`)) return;
    try {
      await deletePaymentMethod(id);
      addToast('পেমেন্ট পদ্ধতিটি মুছে ফেলা হয়েছে', 'info');
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
      addToast(`ক্যাটাগরি "${newCatName}" তৈরি হয়েছে!`, 'success');
      setNewCatName('');
      setNewCatDesc('');
      setNewCatImg('');
      loadCategories();
    } catch (err) {
      addToast(err.message || 'ক্যাটাগরি তৈরি করতে ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`আপনি কি ক্যাটাগরি "${name}" মুছে ফেলতে চান?`)) return;
    try {
      await deleteCategory(id);
      addToast('ক্যাটাগরি মুছে ফেলা হয়েছে', 'info');
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
                আবু আহমেদ কালেকশন • অ্যাডমিন
              </h1>
            </div>
            <p className="text-[11px] text-zinc-400">লগইন আছেন: {admin.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-zinc-300 hover:text-gold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-gold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>ওয়েবসাইট দেখুন</span>
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={adminLogout}
            className="text-xs text-red-400 border-red-500/30 hover:bg-red-950/40"
          >
            লগআউট
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
              <span>ওভারভিউ ও অ্যানালিটিক্স</span>
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
                <span>অর্ডার ও ডেলিভারি</span>
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
              <span>শাড়ির ইনভেন্টরি</span>
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
              <span>শাড়ির ক্যাটাগরি</span>
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
              <span>ডেলিভারি চার্জ ও সেটিংস</span>
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
              <span>পেমেন্ট মেথড</span>
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
                    মোট বিক্রি
                  </span>
                  <span className="font-serif text-2xl font-bold text-royal-black mt-1 block">
                    ৳{stats?.totalRevenue?.toLocaleString() || 0}
                  </span>
                  <span className="text-[11px] text-emerald-600 mt-1 block">নিশ্চিতকৃত অর্ডার থেকে</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-soft">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    মোট অর্ডার
                  </span>
                  <span className="font-serif text-2xl font-bold text-royal-black mt-1 block">
                    {stats?.totalOrders || 0}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">{stats?.deliveredOrders || 0}টি ডেলিভারি সম্পন্ন</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-soft">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    অপেক্ষমাণ অর্ডার
                  </span>
                  <span className="font-serif text-2xl font-bold text-amber-600 mt-1 block">
                    {stats?.pendingOrders || 0}
                  </span>
                  <span className="text-[11px] text-amber-700 mt-1 block">কল করে নিশ্চিতকরণ প্রয়োজন</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-soft">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    ক্যাটালগে মোট শাড়ি
                  </span>
                  <span className="font-serif text-2xl font-bold text-royal-black mt-1 block">
                    {stats?.totalProducts || 0}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">ওয়েবসাইটে সক্রিয়</span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-soft p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-royal-black">সাম্প্রতিক অর্ডারসমূহ</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-gold-deep hover:underline"
                  >
                    সব অর্ডার দেখুন →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider">
                        <th className="py-2.5">অর্ডার আইডি</th>
                        <th className="py-2.5">গ্রাহক</th>
                        <th className="py-2.5">মোবাইল</th>
                        <th className="py-2.5">মূল্য</th>
                        <th className="py-2.5">স্ট্যাটাস</th>
                        <th className="py-2.5 text-right">অ্যাকশন</th>
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
                            <Badge variant={ord.status.toLowerCase()}>{statusBanglaMap[ord.status] || ord.status}</Badge>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrderDetails({ order: ord });
                              }}
                              className="text-gold-deep hover:underline font-bold"
                            >
                              বিস্তারিত
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
                    গ্রাহকদের অর্ডার ব্যবস্থাপনা
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    গ্রাহকের যোগাযোগের তথ্য ও ডেলিভারি ঠিকানা দেখুন, স্ট্যাটাস আপডেট করুন এবং সরাসরি হোয়াটসঅ্যাপ ইনভয়েস পাঠান।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="আইডি, মোবাইল বা নাম খুঁজুন..."
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                      className="bg-zinc-50 border border-zinc-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-royal-black focus:border-gold focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    onClick={loadOrders}
                    className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
                    title="অর্ডার রিফ্রেশ করুন"
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
                    {statusBanglaMap[st] || st}
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              {loadingOrders ? (
                <div className="py-12 text-center text-zinc-400 animate-pulse">অর্ডার লোড হচ্ছে...</div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center text-zinc-400">কোনো অর্ডার পাওয়া যায়নি।</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider">
                        <th className="py-3">অর্ডার আইডি</th>
                        <th className="py-3">গ্রাহকের নাম ও যোগাযোগ</th>
                        <th className="py-3">ডেলিভারি এলাকা</th>
                        <th className="py-3">পেমেন্ট মাধ্যম</th>
                        <th className="py-3">মোট</th>
                        <th className="py-3">স্ট্যাটাস</th>
                        <th className="py-3 text-right">অ্যাকশন</th>
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
                              <option value="Pending Payment">{statusBanglaMap['Pending Payment']}</option>
                              <option value="Verifying Payment">{statusBanglaMap['Verifying Payment']}</option>
                              <option value="Pending">{statusBanglaMap['Pending']}</option>
                              <option value="Confirmed">{statusBanglaMap['Confirmed']}</option>
                              <option value="Processing">{statusBanglaMap['Processing']}</option>
                              <option value="Shipped">{statusBanglaMap['Shipped']}</option>
                              <option value="Delivered">{statusBanglaMap['Delivered']}</option>
                              <option value="Cancelled">{statusBanglaMap['Cancelled']}</option>
                            </select>
                          </td>
                          <td className="py-3.5 text-right space-x-2">
                            <button
                              onClick={() => {
                                getOrderByIdAdmin(order._id).then(setSelectedOrderDetails);
                              }}
                              className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-royal-black font-semibold"
                              title="অর্ডারের পূর্ণ বিবরণ দেখুন"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>বিস্তারিত</span>
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
                    শাড়ির ক্যাটালগ ও স্টক ম্যানেজার
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    একাধিক ছবি সহ নতুন শাড়ি যোগ করুন, মূল্য ও ছাড় নির্ধারণ করুন এবং স্টক নিয়ন্ত্রণ করুন।
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openProductModal(null)}
                  className="flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন শাড়ি যোগ করুন</span>
                </Button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider">
                      <th className="py-3">ছবি</th>
                      <th className="py-3">শাড়ির নাম</th>
                      <th className="py-3">ক্যাটাগরি / ফেব্রিক</th>
                      <th className="py-3">নিয়মিত / ছাড় মূল্য</th>
                      <th className="py-3">স্টক স্ট্যাটাস</th>
                      <th className="py-3 text-right">অ্যাকশন</th>
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
                          <p className="text-[11px] text-zinc-400">স্লাগ: {product.slug}</p>
                        </td>
                        <td className="py-3">
                          <span className="font-medium text-royal-black block">{product.category}</span>
                          <span className="text-[11px] text-zinc-500">{product.fabric}</span>
                        </td>
                        <td className="py-3">
                          <span className="font-bold text-royal-black block">৳{product.regularPrice.toLocaleString()}</span>
                          {product.discountPrice && (
                            <span className="text-emerald-700 font-semibold text-[11px]">
                              ছাড় মূল্য: ৳{product.discountPrice.toLocaleString()}
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
                            {product.inStock ? 'স্টকে আছে' : 'স্টক শেষ'}
                          </button>
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => openProductModal(product)}
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                            title="শাড়ি এডিট করুন"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                            title="শাড়ি মুছুন"
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
                  শাড়ির ক্যাটাগরি ব্যবস্থাপনা
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  তাঁতের অঞ্চল ও ডিজাইনের ধরন অনুযায়ী শাড়ি সাজান (যেমন: ঢাকাই জামদানি, কাতান, তসর সিল্ক ইত্যাদি)।
                </p>
              </div>

              {/* Add category form */}
              <form onSubmit={handleCreateCategory} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-royal-black">নতুন ক্যাটাগরি তৈরি করুন</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="ক্যাটাগরির নাম (যেমন: ঢাকাই জামদানি)"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-xs bg-white text-royal-black focus:border-gold focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="সংক্ষিপ্ত বিবরণ"
                    value={newCatDesc}
                    onChange={e => setNewCatDesc(e.target.value)}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-xs bg-white text-royal-black focus:border-gold focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="কভার ছবির লিংক (ঐচ্ছিক)"
                    value={newCatImg}
                    onChange={e => setNewCatImg(e.target.value)}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-xs bg-white text-royal-black focus:border-gold focus:outline-none"
                  />
                </div>
                <Button type="submit" variant="primary" size="sm">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>ক্যাটাগরি সংরক্ষণ করুন</span>
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
                  ডেলিভারি চার্জ ও স্টোর সেটিংস
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  ঢাকার ভেতরে ও বাইরের ডেলিভারি চার্জ এবং ফ্রি ডেলিভারির সীমা আপনার সুবিধাজনকভাবে নির্ধারণ করুন।
                </p>
              </div>

              <form onSubmit={handleSaveDeliverySettings} className="space-y-5 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                      ঢাকার ভেতরের ডেলিভারি চার্জ (৳)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={insideDhakaFee}
                      onChange={e => setInsideDhakaFee(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
                    />
                    <span className="text-[10px] text-zinc-400">সাধারণত ৳৮০</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                      ঢাকার বাইরের ডেলিভারি চার্জ (৳)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={outsideDhakaFee}
                      onChange={e => setOutsideDhakaFee(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
                    />
                    <span className="text-[10px] text-zinc-400">সাধারণত ৳১৫০</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                    ফ্রি ডেলিভারির সর্বনিম্ন অর্ডার মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={freeThreshold}
                    onChange={e => setFreeThreshold(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
                  />
                  <span className="text-[10px] text-zinc-400">
                    এই মূল্যের সমান বা বেশি অর্ডারে গ্রাহক সম্পূর্ণ ফ্রি ডেলিভারি পাবেন।
                  </span>
                </div>

                {/* District-Specific Delivery Rates (e.g. Chattogram) */}
                <div className="pt-4 border-t border-zinc-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gold-dark" />
                    <h3 className="text-sm font-bold text-royal-black">
                      জেলাভিত্তিক ডেলিভারি চার্জ নির্ধারণ (যেমন: চট্টগ্রাম)
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 mb-3">
                    নির্দিষ্ট জেলার জন্য আলাদা ডেলিভারি চার্জ নির্ধারণ করুন। গ্রাহক জেলাটি সিলেক্ট করলে সাধারণ বাইরের চার্জের বদলে এই চার্জ প্রযোজ্য হবে।
                  </p>

                  {/* Add District Override Row */}
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-600 mb-1">জেলা</label>
                        <select
                          value={newDistrictName}
                          onChange={e => setNewDistrictName(e.target.value)}
                          className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-royal-black bg-white focus:border-gold focus:outline-none"
                        >
                          {getAllDistricts().map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-600 mb-1">চার্জ (৳)</label>
                        <input
                          type="number"
                          min={0}
                          value={newDistrictFee}
                          onChange={e => setNewDistrictFee(e.target.value)}
                          placeholder="যেমন: ১০০"
                          className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-royal-black bg-white focus:border-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-600 mb-1">আনুমানিক সময়</label>
                        <input
                          type="text"
                          value={newDistrictDays}
                          onChange={e => setNewDistrictDays(e.target.value)}
                          placeholder="যেমন: ২-৩ দিন"
                          className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-royal-black bg-white focus:border-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddDistrictOverride}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-royal-black text-gold text-xs font-bold rounded-lg hover:bg-zinc-800 transition-colors shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        জেলা চার্জ যোগ করুন
                      </button>
                    </div>
                  </div>

                  {/* Configured Overrides List */}
                  {districtOverrides.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                        সক্রিয় জেলাভিত্তিক চার্জ ({districtOverrides.length})
                      </span>
                      <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-xl overflow-hidden bg-white">
                        {districtOverrides.map((item) => (
                          <div key={item.district} className="flex items-center justify-between px-3 py-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-royal-black">{item.district}</span>
                              <span className="text-zinc-400">|</span>
                              <span className="font-semibold text-emerald-700">৳{item.fee}</span>
                              <span className="text-zinc-400 text-[11px]">({item.estimatedDays || '২-৩ দিন'})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveDistrictOverride(item.district)}
                              className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 transition-colors"
                              title="চার্জ মুছুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-[11px] text-zinc-400 italic">
                      এখনও কোনো বিশেষ জেলা চার্জ যোগ করা হয়নি। ঢাকার বাইরের সব জেলায় সাধারণ ৳{outsideDhakaFee} প্রযোজ্য হবে।
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-royal-black/80 mb-1">
                      স্টোর হেল্পলাইন মোবাইল নম্বর
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
                      স্টোর মালিকের হোয়াটসঅ্যাপ নম্বর (যেমন: 8801806732097)
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
                      স্টোর ইমেইল
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
                      অফিসিয়াল ফেসবুক পেজের লিংক
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
                      শোরুম/দোকানের ঠিকানা
                    </label>
                    <input
                      type="text"
                      value={storeAddress}
                      onChange={e => setStoreAddress(e.target.value)}
                      placeholder="দোকান নং ১০৬, আর এস রোড, রিয়াজউদ্দিন বাজার, চট্টগ্রাম, বাংলাদেশ"
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
                  ডেলিভারি সেটিংস সংরক্ষণ করুন
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
                    পেমেন্ট মাধ্যম কনফিগারেশন
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    পেমেন্ট অপশন তৈরি ও পরিচালনা করুন (ক্যাশ অন ডেলিভারি, বিকাশ, নগদ, রকেট, ব্যাংক ট্রান্সফার)।
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setPaymentModalOpen(true)}
                  className="flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন পেমেন্ট মাধ্যম যোগ করুন</span>
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
                          {method.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                      </div>
                      {method.accountNumber && (
                        <p className="text-xs text-zinc-600 mt-1">
                          অ্যাকাউন্ট: <strong>{method.accountNumber}</strong> ({method.accountType})
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
                        {method.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
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
        title={editingProduct ? 'শাড়ির তথ্য পরিবর্তন' : 'ক্যাটালগে নতুন শাড়ি যোগ করুন'}
        subtitle="শাড়ির ছবি আপলোড করুন, নিয়মিত ও ছাড় মূল্য, ক্যাটাগরি ও স্টক নির্ধারণ করুন"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-royal-black mb-1">
              শাড়ির নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={productForm.name}
              onChange={e => setProductForm({ ...productForm, name: e.target.value })}
              placeholder="যেমন: রয়েল মেরুন ও গোল্ডেন জরি ঢাকাই জামদানি"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">ক্যাটাগরি</label>
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
              <label className="block text-xs font-semibold text-royal-black mb-1">ফেব্রিকের ধরন</label>
              <input
                type="text"
                required
                value={productForm.fabric}
                onChange={e => setProductForm({ ...productForm, fabric: e.target.value })}
                placeholder="যেমন: ঢাকাই জামদানি কটন"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">
                নিয়মিত মূল্য (৳) <span className="text-red-500">*</span>
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
                ছাড় মূল্য (৳)
              </label>
              <input
                type="number"
                min={0}
                value={productForm.discountPrice}
                onChange={e => setProductForm({ ...productForm, discountPrice: e.target.value })}
                placeholder="2950 (ঐচ্ছিক)"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">স্টক সংখ্যা</label>
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
              শাড়ির ছবি আপলোড করুন (একাধিক দেওয়া যাবে)
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
              <p className="text-[11px] text-zinc-400 mt-1">JPEG, PNG, WEBP প্রতি ফাইল সর্বোচ্চ ১০ মেগাবাইট।</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">রং (কমা দিয়ে লিখুন)</label>
              <input
                type="text"
                value={productForm.colors}
                onChange={e => setProductForm({ ...productForm, colors: e.target.value })}
                placeholder="সোনালী, কালো, মেরুন"
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
                <span>ব্লাউজ পিস সহ</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-royal-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={productForm.isFeatured}
                  onChange={e => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                  className="rounded border-zinc-300 text-gold focus:ring-gold"
                />
                <span>ফিচার্ড শাড়ি</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-royal-black mb-1">শাড়ির বিস্তারিত বর্ণনা</label>
            <textarea
              rows={3}
              required
              value={productForm.description}
              onChange={e => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="শাড়ির বুনন শৈলী, আঁচল ও পাড়ের কারুকাজ এবং আভিজাত্যের বর্ণনা দিন..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none resize-none"
            />
          </div>

          <Button type="submit" variant="primary" loading={savingProduct} className="w-full py-3">
            <span>{editingProduct ? 'পরিবর্তন সংরক্ষণ করুন' : 'ওয়েবসাইটে শাড়িটি প্রকাশ করুন'}</span>
          </Button>
        </form>
      </Modal>

      {/* MODAL: Create Payment Method */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="নতুন পেমেন্ট মাধ্যম তৈরি করুন"
        subtitle="বিকাশ, নগদ, রকেট, ব্যাংক ট্রান্সফার বা কাস্টম অপশন যোগ করুন"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreatePaymentMethod} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-royal-black mb-1">পদ্ধতির নাম</label>
            <input
              type="text"
              required
              placeholder="যেমন: বিকাশ মার্চেন্ট বা রকেট পার্সোনাল"
              value={newPayMethod.name}
              onChange={e => setNewPayMethod({ ...newPayMethod, name: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">ইউনিক কোড</label>
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
              <label className="block text-xs font-semibold text-royal-black mb-1">পেমেন্টের ধরন</label>
              <select
                value={newPayMethod.type}
                onChange={e => setNewPayMethod({ ...newPayMethod, type: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
              >
                <option value="mobile_banking">মোবাইল ব্যাংকিং (বিকাশ/নগদ/রকেট)</option>
                <option value="cod">ক্যাশ অন ডেলিভারি</option>
                <option value="bank_transfer">ব্যাংক ট্রান্সফার</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">অ্যাকাউন্ট নম্বর</label>
              <input
                type="text"
                placeholder="01XXXXXXXXX"
                value={newPayMethod.accountNumber}
                onChange={e => setNewPayMethod({ ...newPayMethod, accountNumber: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-royal-black mb-1">অ্যাকাউন্টের ধরন</label>
              <input
                type="text"
                placeholder="পার্সোনাল / মার্চেন্ট"
                value={newPayMethod.accountType}
                onChange={e => setNewPayMethod({ ...newPayMethod, accountType: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-royal-black mb-1">গ্রাহকের জন্য নির্দেশনা</label>
            <textarea
              rows={2}
              value={newPayMethod.instructions}
              onChange={e => setNewPayMethod({ ...newPayMethod, instructions: e.target.value })}
              placeholder="যেমন: এই নম্বরে সেন্ড মানি করে TrxID প্রদান করুন"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-royal-black focus:border-gold focus:outline-none resize-none"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full py-2.5">
            <span>পেমেন্ট মাধ্যম সংরক্ষণ করুন</span>
          </Button>
        </form>
      </Modal>

      {/* MODAL: Full Order Inspector */}
      {selectedOrderDetails && (
        <Modal
          isOpen={!!selectedOrderDetails}
          onClose={() => setSelectedOrderDetails(null)}
          title={`অর্ডার #${selectedOrderDetails.order.orderId}`}
          subtitle={`অর্ডার দেওয়ার সময়: ${new Date(selectedOrderDetails.order.createdAt).toLocaleString('bn-BD')}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Customer Details */}
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-1 text-zinc-600">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-royal-black uppercase tracking-wider text-[11px]">
                  গ্রাহকের যোগাযোগের তথ্য
                </span>
                {selectedOrderDetails.customerWhatsAppUrl && (
                  <a
                    href={selectedOrderDetails.customerWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg text-[11px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>হোয়াটসঅ্যাপ ইনভয়েস</span>
                  </a>
                )}
              </div>
              <p><strong className="text-royal-black">নাম:</strong> {selectedOrderDetails.order.customer.name}</p>
              <p><strong className="text-royal-black">মোবাইল:</strong> {selectedOrderDetails.order.customer.phone}</p>
              <p><strong className="text-royal-black">ইমেইল:</strong> {selectedOrderDetails.order.customer.email}</p>
              <p><strong className="text-royal-black">ডেলিভারি ঠিকানা:</strong> {selectedOrderDetails.order.customer.address}</p>
              <p><strong className="text-royal-black">ডেলিভারি এলাকা:</strong> {selectedOrderDetails.order.customer.deliveryZoneName}</p>
              {selectedOrderDetails.order.customer.notes && (
                <p><strong className="text-royal-black">বিশেষ নোট:</strong> {selectedOrderDetails.order.customer.notes}</p>
              )}
            </div>

            {/* Saree items */}
            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-royal-black">অর্ডারকৃত শাড়িসমূহ</h4>
              <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-xl overflow-hidden bg-white">
                {selectedOrderDetails.order.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt={it.name} className="w-10 h-12 object-cover rounded bg-zinc-100" />
                      <div>
                        <p className="font-semibold text-royal-black">{it.name}</p>
                        <p className="text-zinc-500">পরিমাণ: {it.quantity} × ৳{it.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="font-bold text-royal-black">৳{(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-sm text-royal-black pt-2 border-t">
              <span>সর্বমোট প্রদেয়:</span>
              <span className="text-gold-deep text-base">৳{selectedOrderDetails.order.total.toLocaleString()}</span>
            </div>

            {/* Quick Status Update */}
            <div className="pt-2 border-t">
              <label className="block font-bold text-royal-black mb-1">স্ট্যাটাস পরিবর্তন করুন</label>
              <div className="flex gap-2">
                <select
                  defaultValue={selectedOrderDetails.order.status}
                  onChange={e => handleStatusChange(selectedOrderDetails.order._id, e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold"
                >
                  <option value="Pending Payment">{statusBanglaMap['Pending Payment']}</option>
                  <option value="Verifying Payment">{statusBanglaMap['Verifying Payment']}</option>
                  <option value="Pending">{statusBanglaMap['Pending']}</option>
                  <option value="Confirmed">{statusBanglaMap['Confirmed']}</option>
                  <option value="Processing">{statusBanglaMap['Processing']}</option>
                  <option value="Shipped">{statusBanglaMap['Shipped']}</option>
                  <option value="Delivered">{statusBanglaMap['Delivered']}</option>
                  <option value="Cancelled">{statusBanglaMap['Cancelled']}</option>
                </select>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
