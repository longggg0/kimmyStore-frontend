import { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/Context/WishlistContext';
import { useCart } from '@/Context/CartContext';
import { useLanguage } from '../Context/LanguageContext';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const handleAddToCart = (productId: number) => {
    const item = items.find((p) => p.id === productId);
    if (!item) return;
    addToCart(item);
    setAddedIds((prev) => new Set(prev).add(productId));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex flex-col items-center justify-center gap-4">
        <Heart className="w-16 h-16 text-gray-300" />
        <p className="text-gray-400 text-lg">{t('wishlist.empty')}</p>
        <Link
          to="/productPage"
          className="px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors"
        >
          {t('wishlist.browse')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-gray-900">{t('wishlist.title')}</h1>
            <p className="text-gray-600 mt-2">
              {items.length} {items.length !== 1 ? t('wishlist.items') : t('wishlist.item')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col">
              <div className="relative overflow-hidden aspect-[3/4]">
                <img
                  src={`http://localhost:3000/api/v3/product/images/${product.id}/download`}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                {!product.isActive && (
                  <div className="absolute top-3 left-3">
                    <div className="bg-gray-400 text-white px-3 py-1 rounded-full text-xs">{t('wishlist.inactive')}</div>
                  </div>
                )}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-white text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2">
                  <span className="inline-block bg-pink-50 text-pink-500 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                    {product.category.name}
                  </span>
                </div>

                <h3
                  className="text-sm font-medium mb-3 line-clamp-2 cursor-pointer hover:text-pink-400 transition-colors leading-tight"
                  style={{ color: '#1a1a1a', minHeight: '2.5rem' }}
                >
                  {product.name}
                </h3>

                <p className="text-[10px] text-gray-400 mb-2 capitalize">
                  {product.skinType} · {product.size}
                </p>

                <div className="mb-2">
                  <span className="text-lg font-semibold text-black">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="w-3 h-3 text-gray-200" />
                </div>

                <p className="text-[10px] text-gray-400 mb-2">
                  {product.qty > 0
                    ? `${product.qty} ${t('wishlist.inStock')}`
                    : <span className="text-red-400">{t('wishlist.outOfStock')}</span>
                  }
                </p>

                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.qty === 0}
                  className={`w-full mt-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                    ${addedIds.has(product.id)
                      ? 'bg-green-400 text-white'
                      : 'bg-pink-400 text-white hover:bg-pink-500'
                    }`}
                >
                  {addedIds.has(product.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">{t('wishlist.added')}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">{t('wishlist.addToCart')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}