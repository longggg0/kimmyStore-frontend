import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useProductsPaginated } from '@/hook/useProduct';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '../Context/LanguageContext';
import { useCategory } from '@/hook/useCategories';
import { useCheckTransaction } from '@/hook/usePayment';
import { useCart } from '@/Context/CartContext';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSkinType, setSelectedSkinType] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { clearCart } = useCart();
  const limit = 8;

  const { t } = useLanguage();
  const { data: categoryData } = useCategory();
//   useEffect(() => {
//   const tranId = searchParams.get("tranId");

//   console.log("tranId:", tranId);

//   if (tranId) {
//     checkTransactionMutate(tranId);
//   }
// }, [searchParams]);
  const { mutate: checkTransactionMutate } = useCheckTransaction();

  const apiCategories = (categoryData ?? []).filter((c) => c.isActive);
  const categories = ['all', ...apiCategories.map((c) => c.name)];

  const selectedCategoryId = selectedCategory === 'all'
    ? undefined
    : apiCategories.find((c) => c.name === selectedCategory)?.id;

  const { data, isLoading, isError, isFetching } = useProductsPaginated({
    page: currentPage,
    limit,
    search: searchQuery || undefined,
    categoryId: selectedCategoryId,
    skinType: selectedSkinType,
  });

  const products = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination ? Math.ceil(pagination.total / limit) : 1;

  // Skin type is now filtered server-side. Sort is still applied client-side
  // to the current page only, since the API doesn't support sorting yet.
  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'newest') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    return 0;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSkinType, sortBy]);

  // Catch tranId from ABA's return_url and check the transaction status
useEffect(() => {
  const tranId = searchParams.get("tranId");

  if (!tranId) return;

  // Prevent React StrictMode from calling twice
  if (sessionStorage.getItem("checkingTransaction") === tranId) {
    return;
  }

  sessionStorage.setItem("checkingTransaction", tranId);

  checkTransactionMutate(tranId, {
    onSuccess: () => {
      clearCart();

      // remove tranId from URL
      setSearchParams({});

      // allow next payment
      sessionStorage.removeItem("checkingTransaction");
    },
    onError: () => {
      sessionStorage.removeItem("checkingTransaction");
    },
  });
}, [searchParams, checkTransactionMutate]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const FilterPanel = () => (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={() => setCategoryExpanded(!categoryExpanded)}
          className="w-full flex items-center justify-between mb-3 text-gray-900"
        >
          <span className="text-sm font-medium">{t('filter.byCategory')}</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${categoryExpanded ? 'rotate-180' : ''}`} />
        </button>
        {categoryExpanded && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#ff6b9d] text-white'
                    : 'border border-gray-300 text-gray-700 hover:border-[#ff6b9d] hover:text-[#ff6b9d]'
                }`}
              >
                {category === 'all' ? t('filter.allCategories') : category}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 my-5" />

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">{t('filter.bySkinType')}</h4>
        <div className="flex flex-wrap gap-2">
          {['all', 'oily', 'dry', 'combination', 'sensitive', 'normal'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedSkinType(type)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 capitalize ${
                selectedSkinType === type
                  ? 'bg-[#ff6b9d] text-white'
                  : 'border border-gray-300 text-gray-700 hover:border-[#ff6b9d] hover:text-[#ff6b9d]'
              }`}
            >
              {type === 'all' ? t('filter.allSkinTypes') : t(`skin.${type}` as any)}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 my-5" />

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">{t('filter.sortBy')}</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b9d]"
        >
          <option value="featured">{t('sort.featured')}</option>
          <option value="price-asc">{t('sort.priceAsc')}</option>
          <option value="price-desc">{t('sort.priceDesc')}</option>
          <option value="newest">{t('sort.newest')}</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-4">{t('products.title')}</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('products.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
        </div>

        <div className="flex gap-8">

          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg text-gray-900">{t('filter.title')}</h3>
              </div>
              <FilterPanel />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">

            {/* Mobile filter button */}
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">{sorted.length} {t('products.found')}</p>
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {t('filter.title')}
              </button>
            </div>

            {/* Mobile filter overlay */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
                    <h3 className="text-lg text-gray-900">{t('filter.title')}</h3>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <FilterPanel />
                </div>
              </div>
            )}

            {/* Loading skeletons — only on very first load, no data yet */}
            {isLoading && !data && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-8 bg-gray-200 rounded-xl mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="text-center py-20">
                <p className="text-red-500 text-sm">{t('products.error')}</p>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && data && sorted.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm">{t('products.empty')}</p>
              </div>
            )}

            {/* Product grid */}
            {!isError && data && sorted.length > 0 && (
              <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                {sorted.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination — driven by server-side totalPages, which now
                correctly accounts for the skinType filter too. */}
            {!isError && data && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:border-pink-400 hover:text-pink-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm transition-colors ${
                      currentPage === page
                        ? 'bg-pink-400 text-white'
                        : 'border border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-400'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:border-pink-400 hover:text-pink-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}