import { Truck, CheckCircle, Copy, MapPin, Download, Phone, Mail, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../Context/LanguageContext';
import { useOrder } from '@/hook/useOrder';
import { orderService } from '@/services/order.service';
import { useAuth } from '@/Context/AuthContext';
import type { Order } from '@/types/order';
import { Link } from 'react-router-dom';

function StatusBadge({ status }: { status?: string }) {
  switch (status?.toLowerCase()) {
    case 'shipped':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border bg-blue-50 text-blue-700 border-blue-200"><Truck className="w-4 h-4" /> Shipped</span>;
    case 'delivered':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle className="w-4 h-4" /> Delivered</span>;
    case 'cancelled':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border bg-red-50 text-red-700 border-red-200"><XCircle className="w-4 h-4" /> Cancelled</span>;
    default:
      return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-4 h-4" /> Pending</span>;
  }
}

function OrderCard({ order }: { order: Order }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { t } = useLanguage();

  const customer = order.customers;
  const fullName = `${customer.firstName} ${customer.lastName}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(String(order.orderNumber));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadInvoice = async () => {
    setDownloading(true);
    try {
      await orderService.generateDocx(order.id);
    } catch {
      alert('Failed to download invoice.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 uppercase tracking-wider">{t('order.number')}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs sm:text-sm text-gray-900">#{order.id}</p>
              <button onClick={handleCopy} className="p-1 rounded-lg">
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2 uppercase tracking-wider">{t('order.date')}</p>
            <p className="text-xs sm:text-sm text-gray-900">{new Date(order.orderDate).toLocaleDateString()}</p>
          </div>
          <div>
            {/* <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{t('order.status')}</p>
            <StatusBadge /> */}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Items */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 uppercase tracking-wider">{t('order.items')}</h3>
          <div className="space-y-3 sm:space-y-4">
            {order.orderDetails.map((detail) => (
              <div key={detail.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-pink-50/30 border border-gray-100">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base mb-1 text-gray-900">{detail.productName ?? `Product #${detail.productId}`}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 sm:mt-3">
                    <span className="text-xs sm:text-sm text-gray-600">${parseFloat(detail.productPrice ?? '0').toFixed(2)} × {detail.qty}</span>
                    {/* <span className="text-base sm:text-lg font-semibold text-gray-900">${parseFloat(detail.amount).toFixed(2)}</span> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info + Payment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Customer Info */}
          <div className="bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-2xl p-4 sm:p-6 lg:p-8 border border-pink-200/50 flex flex-col">
            <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-pink-200/50">
              <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm"><MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff6b9d]" /></div>
              <h3 className="text-sm sm:text-base text-gray-900">{t('order.yourInfo')}</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
                {/* <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{t('order.recipientName')}</p>
                  <p className="text-sm text-gray-900">{fullName}</p>
                </div> */}
              <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{t('order.phone')}</p>
                <div className="flex items-center gap-2 text-sm text-gray-900 min-w-0">
                  <Phone className="w-4 h-4 text-[#ff6b9d] flex-shrink-0" />
                  <p className="break-words">{customer.phone}</p>
                </div>
              </div>
              <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{t('order.emailAddress')}</p>
                <div className="flex items-center gap-2 text-sm text-gray-900 min-w-0">
                  <Mail className="w-4 h-4 text-[#ff6b9d] flex-shrink-0" />
                  <p className="break-all">{customer.email}</p>
                </div>
              </div>
              <div className="bg-white/80 rounded-xl p-3 sm:p-4">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{t('order.deliveryAddress')}</p>
                <div className="flex items-start gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-[#ff6b9d] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-900 break-words">{order.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-2xl p-4 sm:p-6 lg:p-8 border border-pink-200/50 flex flex-col">
            <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-pink-200/50">
              <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm"><Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff6b9d]" /></div>
              <h3 className="text-sm sm:text-base text-gray-900">{t('order.paymentDetails')}</h3>
            </div>
            <div className="space-y-3 sm:space-y-4 flex-1">
              <div className="bg-white/80 rounded-xl p-3 sm:p-4 space-y-3">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{t('order.summary')}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t('order.subtotal')}</span>
                    <span className="text-gray-900">${(parseFloat(order.total) + parseFloat(order.discount)).toFixed(2)}</span>
                  </div>
                  {parseFloat(order.discount) > 0 && (
                    <div className="flex justify-between text-sm text-pink-500">
                      <span>{t('Discount')}</span>
                      <span>-${parseFloat(order.discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 mt-2 border-t border-pink-200/50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-900">{t('order.total')}</span>
                      <span className="text-lg sm:text-xl text-[#ff6b9d]">${parseFloat(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handleDownloadInvoice} disabled={downloading}
              className="w-full px-4 py-2.5 sm:py-3 bg-[#ff6b9d] text-white rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm mt-3 sm:mt-4 disabled:opacity-60">
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {downloading ? 'Downloading...' : t('order.downloadInvoice')}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
          <Link to="/contact" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto px-6 py-3 bg-[#ff6b9d] text-white rounded-full text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-200/50">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" /> {t('order.contactSupport')}
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderHistoryPage() {
  const { t } = useLanguage();
  const { orders, loading, error, refetch } = useOrder();
  const { user } = useAuth();

  const myOrders = orders.filter((order) => order.customerId === user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl lg:text-4xl text-gray-900 mb-2">{t('order.title')}</h1>
          <p className="text-sm sm:text-base text-gray-500">{t('order.welcome')}</p>
        </div>

        {loading && (
          <div className="flex justify-center py-16 sm:py-20">
            <div className="w-8 h-8 border-4 border-pink-300 border-t-pink-500 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-sm">{error}</span>
            <button onClick={refetch} className="text-sm underline">Retry</button>
          </div>
        )}

        {!loading && !error && myOrders.length === 0 && (
          <div className="text-center py-16 sm:py-20 text-gray-400">
            <p className="text-base sm:text-lg">No orders yet.</p>
          </div>
        )}

        <div className="space-y-6 sm:space-y-8">
          {myOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}