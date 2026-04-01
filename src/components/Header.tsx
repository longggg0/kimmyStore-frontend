import { useState } from 'react';
import { ShoppingCart, Heart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthModal from '@/pages/AuthModal';

export  function Header() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white">✨</span>
              </div>
              <span className="text-xl text-gray-900">Kimmy Skincare</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to='/'><span className="text-pink-400">Home</span></Link>
              <Link to='/productPage'><span className="text-gray-600 hover:text-gray-900">Products</span></Link>
              <Link to='/contact'><span className="text-gray-600 hover:text-gray-900">Contact</span></Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">

              {/* Language */}
              <button className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50">
                EN
              </button>

              {/* Wishlist */}
              <div className="relative p-2 text-gray-600 hover:text-gray-900">
                <Heart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </div>

              {/* Cart */}
              <div className="relative p-2 text-gray-600 hover:text-gray-900">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </div>

              {/* User */}
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-2 px-4 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500"
              >
                <User className="w-4 h-4" />
                Login
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-3">
              <div className="relative p-2 text-gray-600 hover:text-gray-900 active:text-pink-400">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  3
                </span>
              </div>
              <div className="p-2 text-gray-600">☰</div>
            </div>

          </div>

          {/* Mobile Menu */}
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <span className="text-left px-4 py-2 text-pink-400 bg-pink-50">Home</span>
              <span className="text-left px-4 py-2 text-gray-600">Products</span>
              <span className="text-left px-4 py-2 text-gray-600">Contact</span>

              <div className="text-left px-4 py-2 text-gray-600 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Wishlist (2)
              </div>

              <div className="text-left px-4 py-2 text-gray-600 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Cart (3)
              </div>

              <div className="px-4 py-2 border-t">
                <button className="w-full px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">
                  Switch Language
                </button>
              </div>

              <div className="px-4 py-2 border-t">
                <button
                  onClick={() => setShowAuth(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-400 text-white rounded-lg"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
              </div>
            </nav>
          </div>

        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}