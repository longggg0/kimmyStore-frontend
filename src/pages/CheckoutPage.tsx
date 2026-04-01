import { useState } from 'react';
import { CreditCard, Building2, DollarSign, ShieldCheck } from 'lucide-react';

const staticCart = [
  {
    product: {
      id: '1',
      name: 'Rose Mist Serum',
      category: 'Skincare',
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
      category: 'Makeup',
      price: 14.5,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf4fba?w=200&h=200&fit=crop',
    },
    quantity: 1,
  },
];

const subtotal = staticCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
const shipping = subtotal > 50 ? 0 : 5.99;
const tax = subtotal * 0.1;
const total = subtotal + shipping + tax;

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl text-gray-900 mb-6">Shipping Information</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">Address *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Country *</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <option value="Cambodia">Cambodia</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Laos">Laos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Postal Code</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl text-gray-900 mb-6">Payment Method</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-pink-400 transition-all duration-300">
                  <input
                    type="radio"
                    name="payment"
                    value="credit-card"
                    checked={paymentMethod === 'credit-card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-pink-400 focus:ring-pink-400"
                  />
                  <CreditCard className="w-6 h-6 text-gray-600" />
                  <span className="flex-1">Credit / Debit Card</span>
                  <div className="flex gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-pink-400 transition-all duration-300">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-pink-400 focus:ring-pink-400"
                  />
                  <DollarSign className="w-6 h-6 text-gray-600" />
                  <span className="flex-1">PayPal</span>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-pink-400 transition-all duration-300">
                  <input
                    type="radio"
                    name="payment"
                    value="bank-transfer"
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-pink-400 focus:ring-pink-400"
                  />
                  <Building2 className="w-6 h-6 text-gray-600" />
                  <span className="flex-1">Bank Transfer</span>
                </label>
              </div>

              <div className="mt-6 p-4 bg-pink-50 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-900">
                  Your payment information is secure and encrypted. We never store your credit card details.
                </p>
              </div>

              {paymentMethod === 'bank-transfer' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700 mb-2">Bank Transfer Details:</p>
                  <p className="text-sm text-gray-600">Bank: ABA Bank</p>
                  <p className="text-sm text-gray-600">Account: 000 123 456</p>
                  <p className="text-sm text-gray-600">Account Name: SkinCare Co.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24 border border-gray-100">
              <h2 className="text-xl text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {staticCart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2 mb-1" style={{ color: '#333333' }}>
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
                        {item.quantity} × ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
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
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-black">
                    <span>Total</span>
                    <span className="text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors">
                Place Order
              </button>

              <button className="w-full mt-3 px-6 py-3 border-2 border-[#ff6b9d] text-[#ff6b9d] rounded-lg hover:bg-pink-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}