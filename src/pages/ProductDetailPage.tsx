import { useState } from 'react';
import { Star, Heart, ShoppingCart, ArrowLeft, Share2, Check } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProductById } from '@/hook/useProduct';
import { useCart } from '@/Context/CartContext';
import { useWishlist } from '@/Context/WishlistContext';
import { useLanguage } from '../Context/LanguageContext';
import { useDiscountMap } from '@/hook/usePromotion';

const IMAGE_URL = (id: number) => `https://kimmystorebackend-production.up.railway.app/api/v3/product/images/${id}/download`;

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data, isLoading, isError } = useProductById(Number(id));
  const product = data?.data;

  const { addToCart, items } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const discountMap = useDiscountMap();

  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState('1'); // raw text while typing
  const [added, setAdded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const wishlisted = product ? isWishlisted(product.id) : false;

  // how many of this product are already sitting in the cart
  const inCartQty = product
    ? items.find((i) => i.product.id === product.id)?.quantity ?? 0
    : 0;
  const isOutOfStock = !product || product.qty === 0;
  const isMaxedOut = !isOutOfStock && inCartQty >= product.qty;
  const remainingStock = product ? Math.max(0, product.qty - inCartQty) : 0;

  const handleAddToCart = () => {
    if (!product) return;

    if (isOutOfStock) {
      toast.error('This product is out of stock.');
      return;
    }

    if (isMaxedOut) {
      toast.error(`Only ${product.qty} in stock. You already have ${inCartQty} in your cart.`);
      return;
    }

    // clamp in case the selected quantity is more than what's actually left
    const qtyToAdd = Math.min(quantity, remainingStock);

    for (let i = 0; i < qtyToAdd; i++) {
      addToCart(product);
    }

    if (qtyToAdd < quantity) {
      toast.error(`Only ${remainingStock} more available — added ${qtyToAdd} to your cart.`);
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${product?.name}!`;
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;
    }
    setShowShareMenu(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 w-16 bg-gray-200 rounded mb-4 sm:mb-6 animate-pulse" />
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 bg-white rounded-2xl p-4 sm:p-10">
            <div className="aspect-[3/4] bg-gray-200 rounded-2xl animate-pulse" />
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
              <div className="h-12 bg-gray-200 rounded-full w-full mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-400">{t('detail.notFound')}</p>
        <button
          onClick={() => navigate('/productPage')}
          className="px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500"
        >
          {t('detail.backToProducts')}
        </button>
      </div>
    );
  }

  const discount = discountMap.get(product.id);
  const discountPercent = discount?.discountPercent ?? 0;
  const hasDiscount = discountPercent > 0;
  const originalPrice = parseFloat(String(product.price));
  const discountedPrice = hasDiscount
    ? originalPrice * (1 - discountPercent / 100)
    : originalPrice;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          {t('detail.back')}
        </button>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={IMAGE_URL(product.id)}
                alt={product.name}
                className="w-full h-[300px] sm:h-[450px] md:h-[550px] object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              {!product.isActive && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-gray-400 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm">
                  {t('detail.inactive')}
                </div>
              )}
              {hasDiscount && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#ff6b9d] text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm">
                  -{discountPercent}%
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">

            <div className="text-xs text-pink-400 mb-2 uppercase tracking-widest">
              {product.category?.name}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4 leading-tight" style={{ color: '#333333' }}>
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="flex items-center gap-1">
                {[1,2,3,4].map((s) => (
                  <Star key={s} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
              </div>
              <span className="text-xs sm:text-sm text-gray-600">
                4.0 <span className="text-gray-400">(128 {t('detail.reviews')})</span>
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-gray-100">
              <span className="text-3xl sm:text-4xl text-black">${discountedPrice.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg sm:text-xl text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                </>
              )}
            </div>

            <div className="mb-5">
              {product.qty > 0 ? (
                <span className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-xs sm:text-sm">
                  <Check className="w-4 h-4" />
                  {t('detail.inStock')} ({product.qty} left)
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1.5 rounded-full text-xs sm:text-sm">
                  {t('detail.outOfStock')}
                </span>
              )}
              {isMaxedOut && (
                <span className="ml-2 inline-flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full text-xs sm:text-sm">
                  All {product.qty} already in your cart
                </span>
              )}
            </div>

            <div className="mb-5">
              <h3 className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider">{t('detail.size')}</h3>
              <div className="text-gray-900 text-sm sm:text-base">{product.size}</div>
            </div>

           <div className="mb-6">
  <h3 className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{t('detail.suitableFor')}</h3>
  <span className="px-4 py-1.5 bg-pink-50 text-pink-600 rounded-full text-xs sm:text-sm border border-pink-100 capitalize">
    {product.skinType}
  </span>
</div>

            <div className="mb-6">
              <h3 className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{t('detail.quantity')}</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const next = Math.max(1, quantity - 1);
                    setQuantity(next);
                    setQuantityInput(String(next));
                  }}
                  className="w-10 h-10 sm:w-11 sm:h-11 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={remainingStock || 1}
                  value={quantityInput}
                  disabled={isOutOfStock}
                  onChange={(e) => {
                    // let the user type freely (including empty, "0", partial numbers)
                    // no clamping here — clamping mid-type would fight the user's typing
                    setQuantityInput(e.target.value);
                  }}
                  onBlur={() => {
                    const parsed = parseInt(quantityInput, 10);

                    if (quantityInput === '' || isNaN(parsed) || parsed < 1) {
                      setQuantity(1);
                      setQuantityInput('1');
                      return;
                    }

                    if (parsed > remainingStock) {
                      toast.error(
                        remainingStock === 0
                          ? 'No more stock available for this product.'
                          : `Only ${remainingStock} available — quantity set to ${remainingStock}.`
                      );
                      setQuantity(remainingStock);
                      setQuantityInput(String(remainingStock));
                      return;
                    }

                    setQuantity(parsed);
                    setQuantityInput(String(parsed));
                  }}
                  onKeyDown={(e) => {
                    // let Enter behave like blur, so the value confirms immediately
                    if (e.key === 'Enter') e.currentTarget.blur();
                  }}
                  className="text-base sm:text-lg w-14 sm:w-16 text-center border-2 border-gray-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 disabled:opacity-40 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => {
                    if (quantity >= remainingStock) {
                      toast.error(
                        remainingStock === 0
                          ? 'No more stock available for this product.'
                          : `Only ${remainingStock} more available to add.`
                      );
                      return;
                    }
                    const next = quantity + 1;
                    setQuantity(next);
                    setQuantityInput(String(next));
                  }}
                  disabled={isOutOfStock}
                  className="w-10 h-10 sm:w-11 sm:h-11 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                aria-disabled={isOutOfStock || isMaxedOut}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-full transition-all duration-300 text-sm sm:text-base
                  ${isOutOfStock || isMaxedOut
                    ? 'bg-gray-300 text-white cursor-not-allowed hover:bg-gray-300'
                    : added
                      ? 'bg-pink-500 text-white'
                      : 'bg-[#ff6b9d] text-white hover:bg-[#e5588a]'}`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t('detail.added')}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    {isOutOfStock ? 'Out of Stock' : isMaxedOut ? 'Max in Cart' : t('detail.addToCart')}
                  </>
                )}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`flex-1 sm:flex-none sm:w-auto px-6 py-3 sm:py-3.5 border-2 rounded-full flex items-center justify-center gap-2 transition-all ${
                    wishlisted
                      ? 'bg-pink-500 border-pink-500 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-pink-400 hover:text-pink-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlisted ? 'fill-current' : ''}`} />
                </button>

                <div className="relative flex-1 sm:flex-none">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="w-full sm:w-auto px-6 py-3 sm:py-3.5 border-2 border-gray-200 rounded-full hover:border-gray-300 flex items-center justify-center transition-colors"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {showShareMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 sm:w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                        <button onClick={() => handleShare('facebook')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm">{t('detail.shareFacebook')}</button>
                        <button onClick={() => handleShare('twitter')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm">{t('detail.shareTwitter')}</button>
                        <button onClick={() => handleShare('whatsapp')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm">{t('detail.shareWhatsApp')}</button>
                        <button onClick={() => handleShare('telegram')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm">{t('detail.shareTelegram')}</button>
                        <div className="border-t border-gray-100 my-1" />
                        <button onClick={() => handleShare('copy')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm flex items-center justify-between">
                          <span>{t('detail.copyLink')}</span>
                          {copied && <Check className="w-4 h-4 text-green-500" />}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs text-gray-500 mb-3 uppercase tracking-wider">{t('detail.description')}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {product.description ?? t('detail.noDescription')}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}