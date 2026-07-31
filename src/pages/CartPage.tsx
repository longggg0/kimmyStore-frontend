import { Trash2, ShoppingBag, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '@/Context/CartContext';
import { useAuth } from '@/Context/AuthContext';
import { useLanguage } from '../Context/LanguageContext';
import { useDiscountMap } from '@/hook/usePromotion';

export default function CartPage() {
  const { items, removeFromCart, updateQty } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const discountMap = useDiscountMap();

  const subtotal = items.reduce((sum, item) => {
    const discount = discountMap.get(item.product.id);
    const discountPercent = discount?.discountPercent ?? 0;
    const originalPrice = parseFloat(String(item.product.price));
    const discountedPrice = discountPercent > 0
      ? originalPrice * (1 - discountPercent / 100)
      : originalPrice;
    return sum + discountedPrice * item.quantity;
  }, 0);

  const originalSubtotal = items.reduce((sum, item) => {
    const originalPrice = parseFloat(String(item.product.price));
    return sum + originalPrice * item.quantity;
  }, 0);

  const discountTotal = originalSubtotal - subtotal;

  const total = subtotal;

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      toast.error('Please log in', {
        description: 'You need to log in or create an account before proceed to checkout.',
      });
      return;
    }
    navigate('/checkout-page');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="w-14 h-14 sm:w-16 sm:h-16 text-gray-300" />
        <p className="text-gray-400 text-base sm:text-lg text-center">{t('cart.empty')}</p>
        <Link
          to="/productPage"
          className="px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors text-sm sm:text-base"
        >
          {t('cart.browse')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 w-fit text-sm sm:text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('detail.back')}
        </button>
        <h1 className="text-2xl sm:text-3xl text-gray-900 mb-6 sm:mb-8">{t('cart.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const discount = discountMap.get(item.product.id);
              const discountPercent = discount?.discountPercent ?? 0;
              const hasDiscount = discountPercent > 0;
              const originalPrice = parseFloat(String(item.product.price));
              const discountedPrice = hasDiscount
                ? originalPrice * (1 - discountPercent / 100)
                : originalPrice;

              return (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                >

                  <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 md:p-6">
                    <div className="relative overflow-hidden rounded-xl flex-shrink-0">
                      <img
                        src={`https://kimmystorebackend-production.up.railway.app/api/v3/product/images/${item.product.id}/download`}
                        alt={item.product.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      {hasDiscount && (
                        <span className="absolute top-1 left-1 bg-[#ff6b9d] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
                        <div className="min-w-0">
                          <div className="text-[10px] sm:text-xs text-pink-400 mb-1 uppercase tracking-wider">
                            {item.product.category.name}
                          </div>
                          <h3 className="text-sm sm:text-base md:text-lg mb-1 line-clamp-1" style={{ color: '#333333' }}>
                            {item.product.name}
                          </h3>
                          <div className="flex items-baseline gap-2 mt-1 sm:mt-2">
                            <span className="text-base sm:text-lg text-black">
                              ${discountedPrice.toFixed(2)}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-gray-400 line-through">
                                ${originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 sm:p-2.5 h-fit rounded-full hover:bg-red-50 text-red-500 transition-all duration-300 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2 sm:mt-4 gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-full px-2 py-1 flex-shrink-0">
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.qty}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-base sm:text-xl text-black">
                            ${(discountedPrice * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-400">{t('cart.total')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:sticky lg:top-24 border border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-5">{t('cart.orderSummary')}</h2>

              <div className="space-y-3 mb-5">


                {items.map((item) => {
                  const originalPrice = parseFloat(String(item.product.price));

                  return (
                    <div key={item.product.id} className="flex justify-between text-sm text-gray-600">
                      <span className="line-clamp-1 pr-2">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="flex-shrink-0">${(originalPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}


                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t('cart.subtotal')}</span>
                  <span>${originalSubtotal.toFixed(2)}</span>
                </div>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-sm text-pink-500">
                  <span>{t('cart.discount')}</span>
                  <span>-${discountTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mb-6">
                <span className="text-sm sm:text-base font-medium text-gray-900">{t('cart.total')}</span>
                <span className="text-xl sm:text-2xl font-semibold text-gray-900">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 mb-3 transition-colors text-sm font-medium"
              >
                {t('cart.checkout')}
              </button>

              <Link to="/productPage">
                <button className="w-full px-6 py-3 border-2 border-[#ff6b9d] text-[#ff6b9d] rounded-lg hover:bg-pink-50 transition-colors text-sm font-medium">
                  {t('cart.continueShopping')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}