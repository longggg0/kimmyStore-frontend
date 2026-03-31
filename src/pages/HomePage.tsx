import { Star, Heart, ShoppingCart, TrendingUp, Clock } from 'lucide-react';
import { products, brandLogos } from '../data/DummyData';

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
                Discover Your Perfect Skincare
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Premium skincare products for all skin types. Natural ingredients, proven results.
              </p>
              <button className="px-8 py-4 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors">
                Shop Now
              </button>
            </div>
            <div>
              <img
                src={products[0].image}
                alt="Hero"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8" />
              <div>
                <h3 className="text-xl">Limited Time Offer</h3>
                <p className="text-sm opacity-90">33% OFF on selected items</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-center">
              <div><div className="text-2xl">02</div><div className="text-xs opacity-75">Days</div></div>
              <div className="text-2xl">:</div>
              <div><div className="text-2xl">15</div><div className="text-xs opacity-75">Hours</div></div>
              <div className="text-2xl">:</div>
              <div><div className="text-2xl">30</div><div className="text-xs opacity-75">Minutes</div></div>
              <div className="text-2xl">:</div>
              <div><div className="text-2xl">45</div><div className="text-xs opacity-75">Seconds</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Selling */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-6 h-6 text-pink-400" />
            <h2 className="text-3xl text-gray-900">Top Selling</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl text-gray-900">Best Sellers</h2>
            <button className="text-pink-400 hover:text-pink-500">View All →</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(4, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl text-gray-900">New Arrivals</h2>
            <button className="text-pink-400 hover:text-pink-500">View All →</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Brands */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-gray-900 mb-4" style={{ letterSpacing: '0.02em' }}>
              Our Brands
            </h2>
            <p className="text-base text-gray-500 tracking-wide">
              Curated selection of premium beauty brands
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {brandLogos.map((brand) => (
              <div key={brand.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button className="w-2 h-2 rounded-full bg-gray-800" aria-label="Page 1" />
            <button className="w-2 h-2 rounded-full bg-gray-300" aria-label="Page 2" />
            <button className="w-2 h-2 rounded-full bg-gray-300" aria-label="Page 3" />
          </div>
        </div>
      </section>

    </div>
  );
}

function ProductCard({ product }: { product: typeof products[0] }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
        <h3 className="text-sm font-medium mb-3 line-clamp-2 cursor-pointer hover:text-pink-400 transition-colors leading-tight" style={{ color: '#1a1a1a', minHeight: '2.5rem' }}>
          {product.name}
        </h3>
        <div className="mb-2">
          <span className="text-lg font-semibold text-black">${product.price.toFixed(2)}</span>
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
  );
}