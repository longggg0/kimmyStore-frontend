import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Heart, User, LayoutDashboard, LogOut, ClipboardList } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import AuthModal from '@/pages/AuthModal';
import { useAuth } from '@/hook/useAuth';
import { useCart } from '@/Context/CartContext';
import { useWishlist } from '@/Context/WishlistContext';
import { useLanguage } from '../Context/LanguageContext';

export function Header() {
  const [showAuth, setShowAuth] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { t, toggle, language } = useLanguage();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-pink-500 font-semibold' : 'text-gray-600 hover:text-gray-900';

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `text-left px-4 py-2 ${isActive ? 'text-pink-500 bg-pink-50 font-semibold' : 'text-gray-600'}`;

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/logoJabHouy.png"
                alt="Kimmy Skincare Logo"
                className="w-12 h-12 object-contain"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink to='/' end className={navClass}>{t('nav.home')}</NavLink>
              <NavLink to='/productPage' className={navClass}>{t('nav.products')}</NavLink>
              <NavLink to='/contact' className={navClass}>{t('nav.contact')}</NavLink>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">

              {/* Language Toggle */}
              <button
                onClick={toggle}
                className="flex items-center gap-2 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                {language === 'en' ? (
                  <>
                    <img src="https://flagcdn.com/w20/kh.png" alt="Khmer flag" className="w-5 h-4 object-cover rounded-sm" />
                    <span className="text-sm">ខ្មែរ</span>
                  </>
                ) : (
                  <>
                    <img src="https://flagcdn.com/w20/gb.png" alt="English flag" className="w-5 h-4 object-cover rounded-sm" />
                    <span className="text-sm">EN</span>
                  </>
                )}
              </button>

              {/* Wishlist */}
              <NavLink to="/wishlist">
                <div className="relative p-2 text-gray-600 hover:text-gray-900">
                  <Heart className="w-6 h-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </NavLink>

              {/* Cart */}
              <NavLink to="/cart-page">
                <div className="relative p-2 text-gray-600 hover:text-gray-900">
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </div>
              </NavLink>

              {/* User / Profile Dropdown */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() => setDropdownOpen(prev => !prev)}
                    className="w-9 h-9 bg-pink-400 rounded-full flex items-center justify-center text-white font-medium text-sm cursor-pointer select-none"
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800 truncate">{user?.username}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                      </div>

                      {user?.role === 'admin' && (
                        <NavLink
                          to="/admin-dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-pink-500 hover:bg-pink-50"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          {t('btn.dashboard')}
                        </NavLink>
                      )}

                      <NavLink
                        to="/order-history"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <ClipboardList className="w-4 h-4" />
                        {t('order.title')}
                      </NavLink>

                      <button
                        onClick={() => { logout(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('btn.logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500"
                >
                  <User className="w-4 h-4" />
                  {t('btn.login')}
                </button>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-3">
              <NavLink to="/cart-page">
                <div className="relative p-2 text-gray-600">
                  <ShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </div>
              </NavLink>
              <div className="p-2 text-gray-600">☰</div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <NavLink to='/' end className={mobileNavClass}>{t('nav.home')}</NavLink>
              <NavLink to='/productPage' className={mobileNavClass}>{t('nav.products')}</NavLink>
              <NavLink to='/contact' className={mobileNavClass}>{t('nav.contact')}</NavLink>

              <div className="text-left px-4 py-2 text-gray-600 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                {t('mobile.wishlist')} ({wishlistCount})
              </div>

              <NavLink to="/cart-page" className="text-left px-4 py-2 text-gray-600 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {t('mobile.cart')} ({totalItems})
              </NavLink>

              <div className="px-4 py-2 border-t">
                <button
                  onClick={toggle}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  {language === 'en' ? (
                    <>
                      <img src="https://flagcdn.com/w20/kh.png" alt="Khmer flag" className="w-5 h-4 object-cover rounded-sm" />
                      <span className="text-sm">ខ្មែរ</span>
                    </>
                  ) : (
                    <>
                      <img src="https://flagcdn.com/w20/gb.png" alt="English flag" className="w-5 h-4 object-cover rounded-sm" />
                      <span className="text-sm">EN</span>
                    </>
                  )}
                </button>
              </div>

              <div className="px-4 py-2 border-t">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-2 py-1">
                      <div className="w-9 h-9 bg-pink-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user?.username}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                      </div>
                    </div>

                    {user?.role === 'admin' && (
                      <NavLink
                        to="/admin-dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-pink-500 bg-pink-50 rounded-lg"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {t('btn.dashboard')}
                      </NavLink>
                    )}

                    <NavLink
                      to="/order-history"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      <ClipboardList className="w-4 h-4" />
                      {t('order.title')}
                    </NavLink>

                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('btn.logout')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-400 text-white rounded-lg"
                  >
                    <User className="w-4 h-4" />
                    {t('btn.login')}
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}