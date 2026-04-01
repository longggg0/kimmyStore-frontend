import { Truck, CheckCircle, Copy, MapPin, Download, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function OrderHistoryPage() {
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-2">Order History</h1>
          <p className="text-sm sm:text-base text-gray-500">
            Welcome back, Sokha Chea! Here are your orders.
          </p>
        </div>

        <div className="space-y-8">

          {/* ── ORDER 1 ── */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Order Number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-900">#ORD-1712345678901</p>
                    <button onClick={() => { navigator.clipboard.writeText('ORD-1712345678901'); setCopied1(true); setTimeout(() => setCopied1(false), 2000); }} className="p-1 rounded-lg" title="Copy order number">
                      {copied1 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Order Date</p>
                  <p className="text-sm text-gray-900">3/15/2024</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Status</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border bg-blue-50 text-blue-700 border-blue-200">
                    <Truck className="w-4 h-4" /> Shipped
                  </span>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="mb-8">
                <h3 className="text-sm text-gray-700 mb-4 uppercase tracking-wider">Order Items</h3>
                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-pink-50/30 border border-gray-100">
                    <div className="overflow-hidden rounded-xl flex-shrink-0 shadow-sm">
                      <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop" alt="Rose Mist Serum" className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="inline-block text-[10px] sm:text-xs text-[#ff6b9d] mb-1 sm:mb-2 uppercase tracking-wider bg-pink-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">Skincare</div>
                      <h4 className="text-sm sm:text-base mb-1 text-gray-900">Rose Mist Serum</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 sm:mt-3">
                        <span className="text-xs sm:text-sm text-gray-600">$24.99 × 2</span>
                        <span className="text-base sm:text-lg font-semibold text-gray-900">$49.98</span>
                      </div>
                    </div>
                  </div>
                  {/* Item 2 */}
                  <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-pink-50/30 border border-gray-100">
                    <div className="overflow-hidden rounded-xl flex-shrink-0 shadow-sm">
                      <img src="https://images.unsplash.com/photo-1586495777744-4e6232bf4fba?w=200&h=200&fit=crop" alt="Velvet Lip Tint" className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="inline-block text-[10px] sm:text-xs text-[#ff6b9d] mb-1 sm:mb-2 uppercase tracking-wider bg-pink-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">Makeup</div>
                      <h4 className="text-sm sm:text-base mb-1 text-gray-900">Velvet Lip Tint</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 sm:mt-3">
                        <span className="text-xs sm:text-sm text-gray-600">$14.50 × 1</span>
                        <span className="text-base sm:text-lg font-semibold text-gray-900">$14.50</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Shipping Info */}
                <div className="bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-2xl p-4 sm:p-6 lg:p-8 border border-pink-200/50 flex flex-col">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-pink-200/50">
                    <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm"><MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff6b9d]" /></div>
                    <h3 className="text-sm sm:text-base text-gray-900">Your Information</h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Recipient Name</p>
                      <p className="text-sm text-gray-900">Sokha Chea</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Phone Number</p>
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Phone className="w-4 h-4 text-[#ff6b9d]" />
                        <p>+855 12 345 678</p>
                      </div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Email Address</p>
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Mail className="w-4 h-4 text-[#ff6b9d]" />
                        <p>sokha.chea@email.com</p>
                      </div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Delivery Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#ff6b9d] mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-900">
                          <p>123 Norodom Blvd</p>
                          <p>Phnom Penh, Cambodia</p>
                          <p>12000</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Payment */}
                <div className="bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-2xl p-4 sm:p-6 lg:p-8 border border-pink-200/50 flex flex-col">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-pink-200/50">
                    <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm"><Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff6b9d]" /></div>
                    <h3 className="text-sm sm:text-base text-gray-900">Payment Details</h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4 flex-1">
                    <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Payment Method</p>
                      <p className="text-sm text-gray-900">Credit Card</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Payment Status</p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                      </span>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 sm:p-4 space-y-3">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Order Summary</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span className="text-gray-900">$64.48</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span className="text-gray-900">$0.00</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Tax</span><span className="text-gray-900">$6.45</span></div>
                        <div className="pt-2 mt-2 border-t border-pink-200/50">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-900">Total</span>
                            <span className="text-lg sm:text-xl text-[#ff6b9d]">$70.93</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2.5 sm:py-3 bg-[#ff6b9d] text-white rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm mt-3 sm:mt-4">
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Download Invoice
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                <button className="w-full sm:w-auto px-6 py-3 bg-[#ff6b9d] text-white rounded-full text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-200/50">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" /> Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* ── ORDER 2 ── */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Order Number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-900">#ORD-1712234567890</p>
                    <button onClick={() => { navigator.clipboard.writeText('ORD-1712234567890'); setCopied2(true); setTimeout(() => setCopied2(false), 2000); }} className="p-1 rounded-lg" title="Copy order number">
                      {copied2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Order Date</p>
                  <p className="text-sm text-gray-900">2/28/2024</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Status</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CheckCircle className="w-4 h-4" /> Delivered
                  </span>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="mb-8">
                <h3 className="text-sm text-gray-700 mb-4 uppercase tracking-wider">Order Items</h3>
                <div className="space-y-4">
                  <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-pink-50/30 border border-gray-100">
                    <div className="overflow-hidden rounded-xl flex-shrink-0 shadow-sm">
                      <img src="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=200&h=200&fit=crop" alt="Glow Moisturizer SPF30" className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="inline-block text-[10px] sm:text-xs text-[#ff6b9d] mb-1 sm:mb-2 uppercase tracking-wider bg-pink-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">Skincare</div>
                      <h4 className="text-sm sm:text-base mb-1 text-gray-900">Glow Moisturizer SPF30</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 sm:mt-3">
                        <span className="text-xs sm:text-sm text-gray-600">$32.00 × 1</span>
                        <span className="text-base sm:text-lg font-semibold text-gray-900">$32.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Shipping Info */}
                <div className="bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-2xl p-4 sm:p-6 lg:p-8 border border-pink-200/50 flex flex-col">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-pink-200/50">
                    <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm"><MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff6b9d]" /></div>
                    <h3 className="text-sm sm:text-base text-gray-900">Your Information</h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Recipient Name</p>
                      <p className="text-sm text-gray-900">Sokha Chea</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Phone Number</p>
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Phone className="w-4 h-4 text-[#ff6b9d]" />
                        <p>+855 12 345 678</p>
                      </div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Email Address</p>
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Mail className="w-4 h-4 text-[#ff6b9d]" />
                        <p>sokha.chea@email.com</p>
                      </div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Delivery Address</p>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#ff6b9d] mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-900">
                          <p>123 Norodom Blvd</p>
                          <p>Phnom Penh, Cambodia</p>
                          <p>12000</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Payment */}
                <div className="bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-2xl p-4 sm:p-6 lg:p-8 border border-pink-200/50 flex flex-col">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-pink-200/50">
                    <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm"><Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff6b9d]" /></div>
                    <h3 className="text-sm sm:text-base text-gray-900">Payment Details</h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4 flex-1">
                    <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Payment Method</p>
                      <p className="text-sm text-gray-900">PayPal</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Payment Status</p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                      </span>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 sm:p-4 space-y-3">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Order Summary</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span className="text-gray-900">$32.00</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span className="text-gray-900">$5.99</span></div>
                        <div className="flex justify-between text-sm text-gray-600"><span>Tax</span><span className="text-gray-900">$3.20</span></div>
                        <div className="pt-2 mt-2 border-t border-pink-200/50">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-900">Total</span>
                            <span className="text-lg sm:text-xl text-[#ff6b9d]">$41.19</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2.5 sm:py-3 bg-[#ff6b9d] text-white rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm mt-3 sm:mt-4">
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Download Invoice
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                <button className="w-full sm:w-auto px-6 py-3 bg-[#ff6b9d] text-white rounded-full text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-200/50">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" /> Contact Support
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}