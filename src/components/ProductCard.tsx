import { useState } from 'react';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { Product } from '@/types/Product';
import { useCart } from '@/Context/CartContext';
import { useWishlist } from '@/Context/WishlistContext';
import { useGetActivePromotions } from '@/hook/usePromotion';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, items } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const { data: promotionData } = useGetActivePromotions();

  const wishlisted = isWishlisted(product.id);

  const activePromo = (promotionData?.data ?? []).find((promo) =>
    promo.products.some((p) => p.id === product.id)
  );
  const discountPercent = activePromo?.discountPercent ?? 0;
  const hasDiscount = discountPercent > 0;

  const originalPrice = parseFloat(product.price);
  const discountedPrice = originalPrice * (1 - discountPercent / 100);

  // how many of this product are already sitting in the cart
  const inCartQty = items.find((i) => i.product.id === product.id)?.quantity ?? 0;
  const isOutOfStock = product.qty === 0;
  const isMaxedOut = !isOutOfStock && inCartQty >= product.qty;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error('This product is out of stock.');
      return;
    }

    if (isMaxedOut) {
      toast.error(`Only ${product.qty} in stock. You already have ${inCartQty} in your cart.`);
      return;
    }

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
      className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 flex flex-col cursor-pointer"
      onClick={() => navigate(`/productDetailPage/${product.id}`)}
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-pink-50">
        <img
          src={`https://kimmystorebackend-production.up.railway.app/api/v3/product/images/${product.id}/download`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />

        {hasDiscount && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#ff6b9d] text-white text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full tracking-wide">
            -{discountPercent}%
          </span>
        )}

        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2.5 rounded-full bg-white transition-colors ${wishlisted
              ? 'text-pink-500 hover:bg-pink-50'
              : 'text-gray-700 hover:bg-pink-50 hover:text-pink-400'
            }`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlisted ? 'fill-pink-500' : ''}`} />
        </button>

        {!product.isActive && (
          <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-gray-400 text-white text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full">
            Inactive
          </span>
        )}
      </div>

      <div className="p-2.5 sm:p-4 flex flex-col flex-grow">
        <div className="mb-1.5 sm:mb-2 h-4 sm:h-5">
          <span className="inline-block bg-pink-50 text-pink-500 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-wider truncate max-w-full">
            {product.category.name}
          </span>
        </div>

        <h3
          className="text-xs sm:text-sm font-medium mb-1 line-clamp-2 hover:text-pink-400 transition-colors leading-tight"
          style={{ color: '#1a1a1a', minHeight: '2.2rem' }}
        >
          {product.name}
        </h3>

        <p className="text-[9px] sm:text-[10px] text-gray-400 mb-1.5 sm:mb-2 capitalize h-4 truncate">
          {product.skinType} · {product.size}
        </p>

        <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 h-5 sm:h-6">
          <span className="text-sm sm:text-lg font-semibold text-black">
            ${discountedPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4 h-4">
          {[1, 2, 3, 4].map((s) => (
            <Star key={s} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
          ))}
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-200" />
        </div>

        <p className="text-[9px] sm:text-[10px] text-gray-400 mb-1.5 sm:mb-2 h-4">
          {product.qty > 0 ? `${product.qty} in stock` : (
            <span className="text-red-400">Out of stock</span>
          )}
        </p>

        <button
          onClick={handleAddToCart}
          aria-disabled={isOutOfStock || isMaxedOut}
          className={`w-full mt-auto px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 text-white
    ${isOutOfStock || isMaxedOut ? 'bg-gray-300 cursor-not-allowed hover:bg-gray-300' : 'bg-pink-500 hover:bg-pink-500'}
    ${added ? 'shadow-[inset_0_2px_8px_rgba(0,0,0,0.25)]' : ''}
  `}
        >
          {added ? (
            <>
              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-[11px] sm:text-sm font-medium">Added!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-[11px] sm:text-sm font-medium">
                {isOutOfStock ? 'Out of Stock' : isMaxedOut ? 'Max in Cart' : 'Add to Cart'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}