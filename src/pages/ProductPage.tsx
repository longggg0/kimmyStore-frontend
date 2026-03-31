import { useState } from 'react';
import { Search, Star, Heart, ShoppingCart, Filter, X, ChevronDown } from 'lucide-react';
import { products } from '../data/DummyData';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryExpanded, setCategoryExpanded] = useState(true);

  const categories = ['all', 'Serum', 'Moisturizer', 'Cleanser', 'Sun Care', 'Treatment', 'Toner', 'Eye Care', 'Mist'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-4">Products</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
        </div>

        <div className="flex gap-8">

          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg text-gray-900">Filters</h3>
              </div>
              <div className="p-6">

                {/* Category Filter Accordion */}
                <div className="mb-4">
                  <button
                    onClick={() => setCategoryExpanded(!categoryExpanded)}
                    className="w-full flex items-center justify-between mb-3 text-gray-900"
                  >
                    <span className="text-sm font-medium">Filter by Category</span>
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
                          {category === 'all' ? 'All Categories' : category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-5"></div>

                {/* Skin Type Filter */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Filter by Skin Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'oily', 'dry', 'combination', 'sensitive', 'normal'].map((type) => (
                      <button
                        key={type}
                        className="px-3 py-1.5 rounded-full text-xs border border-gray-300 text-gray-700 hover:border-[#ff6b9d] hover:text-[#ff6b9d] transition-all duration-200 capitalize"
                      >
                        {type === 'all' ? 'All Skin Types' : type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-5"></div>

                {/* Sort By */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b9d]"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">

            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">{products.length} products found</p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-pink-400 text-white border border-pink-400 rounded-lg hover:bg-pink-500 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            {/* Mobile Filters Overlay */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
                    <h3 className="text-lg text-gray-900">Filters</h3>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6">

                    {/* Mobile Category */}
                    <div className="mb-4">
                      <button
                        onClick={() => setCategoryExpanded(!categoryExpanded)}
                        className="w-full flex items-center justify-between mb-3 text-gray-900"
                      >
                        <span className="text-sm font-medium">Filter by Category</span>
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
                              {category === 'all' ? 'All Categories' : category}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-100 my-5"></div>

                    {/* Mobile Skin Type */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Filter by Skin Type</h4>
                      <div className="flex flex-wrap gap-2">
                        {['all', 'oily', 'dry', 'combination', 'sensitive', 'normal'].map((type) => (
                          <button
                            key={type}
                            className="px-3 py-1.5 rounded-full text-xs border border-gray-300 text-gray-700 hover:border-[#ff6b9d] hover:text-[#ff6b9d] transition-all duration-200 capitalize"
                          >
                            {type === 'all' ? 'All Skin Types' : type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 my-5"></div>

                    {/* Mobile Sort */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Sort By</h4>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b9d]"
                      >
                        <option value="featured">Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest</option>
                      </select>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Products */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col">
                  <div className="relative overflow-hidden aspect-[3/4]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    />
                    <button className="absolute top-3 right-3 p-2.5 rounded-full bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-400 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="mb-2">
                      <span className="inline-block bg-pink-50 text-pink-500 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>
                    <h3
                      className="text-sm font-medium mb-3 line-clamp-2 cursor-pointer hover:text-pink-400 transition-colors leading-tight"
                      style={{ color: '#1a1a1a', minHeight: '2.5rem' }}
                    >
                      {product.name}
                    </h3>
                    <div className="mb-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-black">${product.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-4">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3 h-3 text-gray-200" />
                    </div>
                    <button className="w-full mt-auto px-3 sm:px-4 py-2 sm:py-2.5 bg-pink-400 text-white rounded-xl hover:bg-pink-500 transition-colors flex items-center justify-center gap-1.5 sm:gap-2">
                      <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}