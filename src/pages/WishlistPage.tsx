import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';

const staticWishlist = [
  {
    product: {
      id: '1',
      name: 'Rose Mist Serum',
      category: 'Skincare',
      price: 24.99,
      originalPrice: 34.99,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=533&fit=crop',
      isNew: false,
      rating: 4,
      reviews: 128,
    },
  },
  {
    product: {
      id: '2',
      name: 'Velvet Lip Tint',
      category: 'Makeup',
      price: 14.5,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf4fba?w=400&h=533&fit=crop',
      isNew: true,
      rating: 5,
      reviews: 64,
    },
  },
  {
    product: {
      id: '3',
      name: 'Glow Moisturizer SPF30',
      category: 'Skincare',
      price: 32.0,
      originalPrice: 40.0,
      image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&h=533&fit=crop',
      isNew: true,
      rating: 4,
      reviews: 201,
    },
  },
  {
    product: {
      id: '4',
      name: 'Hydra Eye Cream',
      category: 'Skincare',
      price: 19.99,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=533&fit=crop',
      isNew: false,
      rating: 3,
      reviews: 47,
    },
  },
];

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-gray-900">Wishlist</h1>
            <p className="text-gray-600 mt-2">{staticWishlist.length} items</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {staticWishlist.map((item) => (
            <div key={item.product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col">
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-[3/4]">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">
                      -{Math.round((1 - item.product.price / item.product.originalPrice) * 100)}%
                    </div>
                  )}
                  {item.product.isNew && (
                    <div className="bg-pink-400 text-white px-3 py-1 rounded-full text-xs">NEW</div>
                  )}
                </div>

                {/* Remove Button */}
                <button className="absolute top-3 right-3 p-2.5 rounded-full bg-white text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                {/* Category */}
                <div className="mb-2">
                  <span className="inline-block bg-pink-50 text-pink-500 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                    {item.product.category}
                  </span>
                </div>

                {/* Product Name */}
                <h3
                  className="text-sm font-medium mb-3 line-clamp-2 cursor-pointer hover:text-pink-400 transition-colors leading-tight"
                  style={{ color: '#1a1a1a', minHeight: '2.5rem' }}
                >
                  {item.product.name}
                </h3>

                {/* Price */}
                <div className="mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-black">${item.product.price.toFixed(2)}</span>
                    {item.product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ${item.product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(item.product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">({item.product.reviews})</span>
                </div>

                {/* Add to Cart Button */}
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
  );
}