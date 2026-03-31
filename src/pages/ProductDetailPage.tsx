import { useState } from 'react';
import { Star, Heart, ShoppingCart, ArrowLeft, Share2, Check } from 'lucide-react';
import { products } from '../data/DummyData';

const product = products[0];

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${product.name}!`;

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-2xl shadow-sm p-6 md:p-10 max-w-5xl mx-auto">

          {/* Product Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[450px] md:h-[550px] object-cover"
              />
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm">
                -33%
              </div>
              <div className="absolute top-4 right-4 bg-pink-400 text-white px-4 py-1.5 rounded-full text-sm">
                NEW
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">

            {/* Category */}
            <div className="text-xs text-pink-400 mb-2 uppercase tracking-widest">
              {product.category}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl mb-4 leading-tight" style={{ color: '#333333' }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <Star className="w-5 h-5 text-gray-300" />
              </div>
              <span className="text-sm text-gray-600">
                4.0 <span className="text-gray-400">(128 reviews)</span>
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-100">
              <span className="text-4xl text-black">${product.price.toFixed(2)}</span>
              <span className="text-xl text-gray-400 line-through">$45.00</span>
            </div>

            {/* Stock Status */}
            <div className="mb-5">
              <span className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm">
                <Check className="w-4 h-4" />
                In Stock
              </span>
            </div>

            {/* Size */}
            <div className="mb-5">
              <h3 className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Size</h3>
              <div className="text-gray-900 text-base">30ml</div>
            </div>

            {/* Suitable For */}
            <div className="mb-6">
              <h3 className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Suitable For</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-1.5 bg-pink-50 text-pink-600 rounded-full text-sm border border-pink-100">Dry</span>
                <span className="px-4 py-1.5 bg-pink-50 text-pink-600 rounded-full text-sm border border-pink-100">Normal</span>
                <span className="px-4 py-1.5 bg-pink-50 text-pink-600 rounded-full text-sm border border-pink-100">Sensitive</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="text-lg w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#ff6b9d] text-white rounded-full hover:bg-[#e5588a] transition-colors">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <button
                onClick={() => setIsInWishlist(!isInWishlist)}
                className={`sm:w-auto px-6 py-3.5 border-2 rounded-full flex items-center justify-center gap-2 transition-all ${
                  isInWishlist
                    ? 'bg-pink-400 border-pink-400 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-pink-400 hover:text-pink-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="w-full sm:w-auto px-6 py-3.5 border-2 border-gray-200 rounded-full hover:border-gray-300 flex items-center justify-center transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                {showShareMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                      <button onClick={() => handleShare('facebook')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm">
                        Share on Facebook
                      </button>
                      <button onClick={() => handleShare('twitter')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm">
                        Share on Twitter
                      </button>
                      <button onClick={() => handleShare('whatsapp')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm">
                        Share on WhatsApp
                      </button>
                      <button onClick={() => handleShare('telegram')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm">
                        Share on Telegram
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      <button onClick={() => handleShare('copy')} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm flex items-center justify-between">
                        <span>Copy Link</span>
                        {copied && <Check className="w-4 h-4 text-green-500" />}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                A deeply hydrating serum infused with rose extract and hyaluronic acid to plump, brighten, and nourish your skin. Suitable for all skin types, especially dry and sensitive skin.
              </p>
            </div>

          </div>
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mt-8 max-w-5xl mx-auto">

          {/* Ingredients */}
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
            <h3 className="text-lg text-gray-900 mb-4 pb-3 border-b border-gray-100">Ingredients</h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 text-gray-600 text-sm"><span className="text-pink-400 mt-1 text-base">•</span><span>Rose Extract</span></li>
              <li className="flex items-start gap-2.5 text-gray-600 text-sm"><span className="text-pink-400 mt-1 text-base">•</span><span>Hyaluronic Acid</span></li>
              <li className="flex items-start gap-2.5 text-gray-600 text-sm"><span className="text-pink-400 mt-1 text-base">•</span><span>Niacinamide</span></li>
              <li className="flex items-start gap-2.5 text-gray-600 text-sm"><span className="text-pink-400 mt-1 text-base">•</span><span>Vitamin E</span></li>
              <li className="flex items-start gap-2.5 text-gray-600 text-sm"><span className="text-pink-400 mt-1 text-base">•</span><span>Aloe Vera</span></li>
            </ul>
          </div>

          {/* How to Use */}
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
            <h3 className="text-lg text-gray-900 mb-4 pb-3 border-b border-gray-100">How to Use</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Apply 2–3 drops onto clean, dry skin morning and evening. Gently pat into the face and neck until fully absorbed. Follow with your favourite moisturiser for best results. Avoid direct contact with eyes.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}