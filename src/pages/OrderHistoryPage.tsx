import { Copy, MapPin, Download, Phone, Mail, CheckCircle2, Package, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../Context/LanguageContext';
import { useOrder } from '@/hook/useOrder';
import { orderService } from '@/services/order.service';
import { useAuth } from '@/Context/AuthContext';
import type { Order } from '@/types/order';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 20;

function OrderRow({ order, onClick }: { order: Order; onClick: () => void }) {
  const { t } = useLanguage();
  const itemCount = order.orderDetails.reduce((sum, d) => sum + d.qty, 0);

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 sm:py-4 text-left hover:shadow-md hover:border-pink-200 transition-all"
    >
      <div className="p-2 sm:p-2.5 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl flex-shrink-0">
        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff6b9d]" />
      </div>

      <div className="min-w-0 w-28 sm:w-36 flex-shrink-0">
        <p className="text-sm sm:text-base text-gray-900 truncate">#{order.id}</p>
        <p className="text-[11px] sm:text-xs text-gray-500">
          {new Date(order.orderDate).toLocaleDateString()}
        </p>
      </div>

      <div className="hidden sm:block flex-1 min-w-0">
        <p className="text-sm text-gray-600 truncate">
          {order.orderDetails[0]?.productName ?? `Product #${order.orderDetails[0]?.productId}`}
          {order.orderDetails.length > 1 && ` +${order.orderDetails.length - 1} more`}
        </p>
        <p className="text-xs text-gray-400">{itemCount} {itemCount === 1 ? t('order.item') ?? 'item' : t('order.items')}</p>
      </div>

      <div className="flex-1 sm:hidden" />

      <div className="text-right flex-shrink-0">
        <p className="text-sm sm:text-base text-[#ff6b9d]">${parseFloat(order.total).toFixed(2)}</p>
      </div>
    </button>
  );
}

function OrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { t } = useLanguage();
  const customer = order.customers;

  // Close on Escape, lock body scroll while open
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-150">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-pink-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-start justify-between gap-4">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 flex-1">
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
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-500 shadow-sm flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
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
                    <span className="text-xs sm:text-sm text-gray-600">
                      ${parseFloat(detail.productPrice ?? '0').toFixed(2)} × {detail.qty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info + Payment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-2xl p-4 sm:p-6 border border-pink-200/50 flex flex-col">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-pink-200/50">
                <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm"><MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff6b9d]" /></div>
                <h3 className="text-sm sm:text-base text-gray-900">{t('order.yourInfo')}</h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
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

            <div className="bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-2xl p-4 sm:p-6 border border-pink-200/50 flex flex-col">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-pink-200/50">
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
              <button
                onClick={handleDownloadInvoice}
                disabled={downloading}
                className="w-full px-4 py-2.5 sm:py-3 bg-[#ff6b9d] text-white rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm mt-3 sm:mt-4 disabled:opacity-60"
              >
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
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = useMemo(() => {
    const result: (number | 'ellipsis')[] = [];
    const addRange = (start: number, end: number) => {
      for (let i = start; i <= end; i++) result.push(i);
    };

    if (totalPages <= 7) {
      addRange(1, totalPages);
    } else {
      result.push(1);
      if (currentPage > 3) result.push('ellipsis');
      addRange(Math.max(2, currentPage - 1), Math.min(totalPages - 1, currentPage + 1));
      if (currentPage < totalPages - 2) result.push('ellipsis');
      result.push(totalPages);
    }
    return result;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 pt-6 sm:pt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pink-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {pages.map((p, idx) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="px-1.5 sm:px-2 text-gray-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 rounded-lg text-xs sm:text-sm transition-colors ${
              p === currentPage
                ? 'bg-[#ff6b9d] text-white shadow-sm'
                : 'text-gray-600 hover:bg-pink-50'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pink-50"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}

export default function OrderHistoryPage() {
  const { t } = useLanguage();
  const { orders, loading, error, refetch } = useOrder();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const myOrders = useMemo(() => {
    return orders
      .filter((order) => order.customerId === user?.id)
      .sort(
        (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );
  }, [orders, user?.id]);

  const totalPages = Math.max(1, Math.ceil(myOrders.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return myOrders.slice(start, start + PAGE_SIZE);
  }, [myOrders, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl text-gray-900 mb-2">{t('order.title')}</h1>
            <p className="text-sm sm:text-base text-gray-500">{t('order.welcome')}</p>
          </div>
          {!loading && !error && myOrders.length > 0 && (
            <p className="hidden sm:block text-sm text-gray-400 flex-shrink-0">
              {myOrders.length} {myOrders.length === 1 ? 'order' : 'orders'}
            </p>
          )}
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

        {!loading && !error && myOrders.length > 0 && (
          <>
            <div className="space-y-2.5 sm:space-y-3">
              {paginatedOrders.map((order) => (
                <OrderRow key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}