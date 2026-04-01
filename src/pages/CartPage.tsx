import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';

const staticCart = [
  {
    product: {
      id: '1',
      name: 'Rose Mist Serum',
      nameKm: 'សេរ៉ូមផ្កាកុលាប',
      category: 'Skincare',
      categoryKm: 'ថែរក្សាស្បែក',
      price: 24.99,
      originalPrice: 34.99,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop',
    },
    quantity: 2,
  },
  {
    product: {
      id: '2',
      name: 'Velvet Lip Tint',
      nameKm: 'ទឹកថ្នាំបបូរមាត់',
      category: 'Makeup',
      categoryKm: 'គ្រឿងសំអាង',
      price: 14.5,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf4fba?w=200&h=200&fit=crop',
    },
    quantity: 1,
  },
];

const language = 'en';

const subtotal = staticCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
const shipping = subtotal > 50 ? 0 : 5.99;
const tax = subtotal * 0.1;
const total = subtotal + shipping + tax;

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl text-gray-900 mb-8">
          Your Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {staticCart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex gap-4 p-4 md:p-6">
                  {/* Product Image */}
                  <div className="relative overflow-hidden rounded-xl flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover"
                    />
                    {item.product.originalPrice && (
                      <div className="absolute top-2 left-2 bg-black text-white px-2 py-0.5 rounded-full text-xs">
                        -{Math.round((1 - item.product.price / item.product.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4 mb-3">
                      <div>
                        <div className="text-xs text-pink-400 mb-1 uppercase tracking-wider">
                          {item.product.category}
                        </div>
                        <h3 className="text-base md:text-lg mb-1 line-clamp-1" style={{ color: '#333333' }}>
                          {item.product.name}
                        </h3>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-lg text-black">${item.product.price.toFixed(2)}</span>
                          {item.product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ${item.product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="p-2.5 h-fit rounded-full hover:bg-red-50 text-red-500 transition-all duration-300 flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <div className="text-xl text-black">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">Total</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24 border border-gray-100">
              <h2 className="text-xl text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                {shipping === 0 && (
                  <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg">
                    🎉 You qualify for free shipping!
                  </div>
                )}

                {subtotal < 50 && (
                  <div className="bg-pink-50 text-pink-700 text-sm p-3 rounded-lg">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 mb-3">
                Proceed to Checkout
              </button>

              <button className="w-full px-6 py-3 border-2 border-[#ff6b9d] text-[#ff6b9d] rounded-lg hover:bg-pink-50 transition-colors">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}