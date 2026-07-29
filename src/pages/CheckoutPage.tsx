import { useState } from 'react';
import { Building2, DollarSign, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '@/Context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../Context/LanguageContext';
import { useDiscountMap } from '@/hook/usePromotion';
import { orderService } from '@/services/order.service';
import { useAuth } from '@/Context/AuthContext';
import type { CreateOrderPayload } from '@/types/order';
import { createPayment } from '@/services/payment.service';

declare const AbaPayway: { checkout: () => void } | undefined;

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const discountMap = useDiscountMap();
  const { user } = useAuth();

  const originalSubtotal = items.reduce((sum, item) => {
    return sum + parseFloat(String(item.product.price)) * item.quantity;
  }, 0);

  const discountedSubtotal = items.reduce((sum, item) => {
    const discount = discountMap.get(item.product.id);
    const discountPercent = discount?.discountPercent ?? 0;
    const originalPrice = parseFloat(String(item.product.price));
    const discountedPrice = discountPercent > 0
      ? originalPrice * (1 - discountPercent / 100)
      : originalPrice;
    return sum + discountedPrice * item.quantity;
  }, 0);

  const discountAmount = originalSubtotal - discountedSubtotal;

  const handlePlaceOrder = async () => {
    if (!fullName || !email || !phone || !address) {
      alert('Please fill in all shipping fields.');
      return;
    }
    if (items.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateOrderPayload = {
        customerId: user!.id,
        discount: discountAmount.toFixed(2),
        location: address,
        items: items.map((item) => ({
          productId: item.product.id,
          qty: item.quantity,
        })),
      };

      const res = await orderService.create(payload);
      const orderId = res.data.id;

      if (paymentMethod === 'bank-transfer') {
        const paymentRes = await createPayment(orderId);

        if (paymentRes.data) {
          const payway = paymentRes.data.payway;

          const form = document.getElementById('aba_merchant_request') as HTMLFormElement;
          if (!form) return;

          // clear old inputs
          form.innerHTML = '';
          form.method = payway.method;
          form.action = payway.action;
          form.target = payway.target;

          // populate fields
          Object.entries(payway.fields).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
          });

          AbaPayway?.checkout();
        }
      } else {
        clearCart();
        navigate('/order-history');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('detail.back')}
        </button>

        <h1 className="text-2xl sm:text-3xl text-gray-900 mb-6 sm:mb-8">{t('checkout.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl text-gray-900 mb-4 sm:mb-6">{t('checkout.shippingInfo')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">{t('checkout.fullName')}</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">{t('checkout.email')}</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">{t('checkout.phone')}</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-2">{t('checkout.address')}</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl text-gray-900 mb-4 sm:mb-6">{t('checkout.paymentMethod')}</h2>
              <div className="space-y-3">
                  {/* <label className="flex items-center gap-3 p-3 sm:p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-pink-400 transition-all duration-300">
                    <input type="radio" name="payment" value="delivery" checked={paymentMethod === 'delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)} className="text-pink-400 focus:ring-pink-400 flex-shrink-0" />
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" />
                    <span className="flex-1 text-sm sm:text-base">{t('checkout.cashOnDelivery')}</span>
                  </label> */}
                <label className="flex items-center gap-3 p-3 sm:p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-pink-400 transition-all duration-300">
                  <input type="radio" name="payment" value="bank-transfer" checked={paymentMethod === 'bank-transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)} className="text-pink-400 focus:ring-pink-400 flex-shrink-0" />
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" />
                  <span className="flex-1 text-sm sm:text-base">{t('checkout.bankTransfer')}</span>
                </label>
              </div>
              <div className="mt-6 p-4 bg-pink-50 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-900">{t('checkout.securePayment')}</p>
              </div>
              {paymentMethod === 'bank-transfer' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700 mb-2">{t('checkout.bankDetails')}</p>
                  <p className="text-sm text-gray-600">Bank: ABA Bank</p>
                  <p className="text-sm text-gray-600">Account: 000 123 456</p>
                  <p className="text-sm text-gray-600">Account Name: SkinCare Co.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:sticky lg:top-24 border border-gray-100">
              <h2 className="text-lg sm:text-xl text-gray-900 mb-4 sm:mb-6">{t('checkout.orderSummary')}</h2>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => {
                  const discount = discountMap.get(item.product.id);
                  const discountPercent = discount?.discountPercent ?? 0;
                  const hasDiscount = discountPercent > 0;
                  const originalPrice = parseFloat(String(item.product.price));
                  const discountedPrice = hasDiscount ? originalPrice * (1 - discountPercent / 100) : originalPrice;
                  return (
                    <div key={item.product.id} className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="overflow-hidden rounded-lg flex-shrink-0">
                        <img src={`http://localhost:3000/api/v3/product/images/${item.product.id}/download`}
                          alt={item.product.name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2 mb-1" style={{ color: '#333333' }}>{item.product.name}</p>
                        <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
                          {item.quantity} × ${discountedPrice.toFixed(2)}
                          {hasDiscount && <span className="line-through text-gray-400 ml-1">${originalPrice.toFixed(2)}</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                  <span>{t('OriginalPrice')}</span>
                  <span>${originalSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm sm:text-base text-pink-500">
                    <span>{t('Discount')}</span>
                    <span>-{discountAmount.toFixed(2)}$</span>
                  </div>
                )}
                <div className="flex justify-between text-sm sm:text-base text-gray-900">
                  <span>{t('DiscountedPrice')}</span>
                  <span className="font-medium">${discountedSubtotal.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between items-center text-black">
                    <span className="text-sm sm:text-base">{t('checkout.total')}</span>
                    <span className="text-lg sm:text-xl">${discountedSubtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button onClick={handlePlaceOrder} disabled={isSubmitting}
                className="w-full mt-6 px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base">
                {isSubmitting ? 'Placing order...' : t('checkout.placeOrder')}
              </button>
              <button onClick={() => navigate('/cart-page')}
                className="w-full mt-3 px-6 py-3 border-2 border-[#ff6b9d] text-[#ff6b9d] rounded-lg hover:bg-pink-50 transition-colors text-sm sm:text-base">
                {t('checkout.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}