import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, LogOut, ChartBarStacked } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/admin-dashboard' },
    { id: 'products',  label: 'Products',   icon: Package,          to: '/admin-product' },
    { id: 'category',  label: 'Categories', icon: ChartBarStacked,  to: '/admin-category' },
    { id: 'orders',    label: 'Orders',     icon: ShoppingCart,     to: '/admin-order' },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login-page", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">

        {/* Logo */}
        <div className="px-6 py-7 border-b border-gray-100">
          <a href="/">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">TechStore</h1>
          </a>
          <p className="text-xs font-normal text-gray-400 mt-1">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-5 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left
                  transition-all duration-200
                  ${isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="text-sm font-normal">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-5 border-t border-gray-100 space-y-2">
          <div className="px-4 py-3 bg-gray-50 rounded-xl">
            <p className="text-sm font-semibold text-gray-800">Admin TechStore</p>
            <p className="text-xs font-normal text-gray-400 mt-0.5">admin@gmail.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl
              text-red-400 hover:text-red-500 hover:bg-red-50
              transition-all duration-200"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="text-sm font-normal">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-10 py-6">
          <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-10 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  );
};