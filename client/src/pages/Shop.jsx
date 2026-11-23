import React, { useEffect, useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import { getProducts, getCategories } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';

export const Shop = ({ onNavigate, queryParams = {} }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(queryParams.category || 'All');
  const [selectedFabric, setSelectedFabric] = useState(queryParams.fabric || 'All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState(queryParams.search || '');

  const fabrics = ['All', 'Jamdani', 'Handloom Silk', 'Banarasi Katan', 'Cotton', 'Muslin'];

  useEffect(() => {
    if (queryParams.category) setSelectedCategory(queryParams.category);
    if (queryParams.search) setSearch(queryParams.search);
  }, [queryParams]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const params = {
          sort: sortBy === 'price_asc' ? 'price_asc' : sortBy === 'price_desc' ? 'price_desc' : undefined,
          inStock: inStockOnly ? 'true' : undefined
        };
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (selectedFabric && selectedFabric !== 'All') {
          params.fabric = selectedFabric;
        }
        if (search) {
          params.search = search;
        }
        const data = await getProducts(params);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch shop products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [selectedCategory, selectedFabric, inStockOnly, sortBy, search]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedFabric('All');
    setInStockOnly(false);
    setSortBy('newest');
    setSearch('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-deep">
            আবু আহমেদ কালেকশন
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-royal-black">
            {selectedCategory !== 'All' ? selectedCategory : 'সকল ঐতিহ্যবাহী শাড়ি'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            সারাদেশে ক্যাশ অন ডেলিভারির জন্য মোট {products.length}টি খাঁটি তাঁতের শাড়ি উপলব্ধ রয়েছে।
          </p>
        </div>

        {/* Sort & Quick Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="শাড়ির নাম দিয়ে খুঁজুন..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white border border-zinc-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-royal-black focus:outline-none focus:border-gold"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-royal-black focus:border-gold focus:outline-none"
          >
            <option value="newest">সাজান: নতুন কালেকশন আগে</option>
            <option value="price_asc">দাম: কম থেকে বেশি</option>
            <option value="price_desc">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <span className="text-xs font-semibold text-zinc-500 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> ক্যাটাগরি:
        </span>
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            selectedCategory === 'All'
              ? 'bg-royal-black text-gold border border-gold/40'
              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
          }`}
        >
          সবগুলো
        </button>
        {categories.map(cat => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === cat.name
                ? 'bg-royal-black text-gold border border-gold/40'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            {cat.name}
          </button>
        ))}

        {/* In-Stock Toggle */}
        <label className="ml-auto flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-700">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => setInStockOnly(e.target.checked)}
            className="rounded border-zinc-300 text-gold focus:ring-gold"
          />
          <span>শুধু স্টকে থাকা শাড়ি</span>
        </label>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        onNavigate={onNavigate}
        emptyMessage="আপনার ফিল্টারের সাথে মিলে এমন কোনো শাড়ি পাওয়া যায়নি। অনুগ্রহ করে ক্যাটাগরি বা সার্চ পরিবর্তন করে চেষ্টা করুন।"
      />
    </div>
  );
};
