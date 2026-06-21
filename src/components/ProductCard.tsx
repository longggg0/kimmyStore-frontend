import { useState } from 'react';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '@/types/Product';
import { useCart } from '@/Context/CartContext';
import { useWishlist } from '@/Context/WishlistContext';
import { useGetActivePromotions } from '@/hook/usePromotion';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const { data: promotionData } = useGetActivePromotions();

  const wishlisted = isWishlisted(product.id);

  // Find an active promotion that includes this product
  const activePromo = (promotionData?.data ?? []).find((promo) =>
    promo.products.some((p) => p.id === product.id)
  );
  const discountPercent = activePromo?.discountPercent ?? 0;
  const hasDiscount = discountPercent > 0;

  const originalPrice = parseFloat(product.price);
  const discountedPrice = originalPrice * (1 - discountPercent / 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.qty === 0) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col cursor-pointer"
      onClick={() => navigate(`/productDetailPage/${product.id}`)}
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-pink-50">
        <img
          src={`http://localhost:3000/api/v3/product/images/${product.id}/download`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />

        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-[#ff6b9d] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide">
            -{discountPercent}%
          </span>
        )}

        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2.5 rounded-full bg-white transition-colors ${wishlisted
              ? 'text-pink-500 hover:bg-pink-50'
              : 'text-gray-700 hover:bg-pink-50 hover:text-pink-400'
            }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-pink-500' : ''}`} />
        </button>

        {!product.isActive && (
          <span className="absolute bottom-3 left-3 bg-gray-400 text-white text-[10px] px-2 py-0.5 rounded-full">
            Inactive
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2 h-5">
          <span className="inline-block bg-pink-50 text-pink-500 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
            {product.category.name}
          </span>
        </div>

        <h3
          className="text-sm font-medium mb-1 line-clamp-2 hover:text-pink-400 transition-colors leading-tight"
          style={{ color: '#1a1a1a', minHeight: '2.5rem' }}
        >
          {product.name}
        </h3>

        <p className="text-[10px] text-gray-400 mb-2 capitalize h-4">
          {product.skinType} · {product.size}
        </p>

        <div className="flex items-baseline gap-2 mb-2 h-6">
          <span className="text-lg font-semibold text-black">
            ${discountedPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 mb-4 h-4">
          {[1, 2, 3, 4].map((s) => (
            <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
          <Star className="w-3 h-3 text-gray-200" />
        </div>

        <p className="text-[10px] text-gray-400 mb-2 h-4">
          {product.qty > 0 ? `${product.qty} in stock` : (
            <span className="text-red-400">Out of stock</span>
          )}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={product.qty === 0}
          className={`w-full mt-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-pink-500 text-white hover:bg-pink-500
    ${added ? 'shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)]' : ''}
  `}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Added!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}