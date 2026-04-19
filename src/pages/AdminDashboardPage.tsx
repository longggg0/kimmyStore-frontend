import React from "react";
import { Package, ShoppingCart, TrendingUp, Trash2, User } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

type Product = {
  id: number;
  name: string;
  price: string;
  qty: number;
};

type Order = {
  id: number;
};

const CUSTOMERS: Customer[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "+1 555-0101", createdAt: "2025-01-15T00:00:00Z" },
  { id: 2, name: "Bob Martinez",  email: "bob@example.com",   phone: "+1 555-0182", createdAt: "2025-02-03T00:00:00Z" },
  { id: 3, name: "Clara Nguyen",  email: "clara@example.com", phone: "",            createdAt: "2025-03-20T00:00:00Z" },
];

const PRODUCTS: Product[] = [
  { id: 1, name: "Widget A", price: "29.99", qty: 100 },
  { id: 2, name: "Widget B", price: "49.99", qty: 250 },
  { id: 3, name: "Widget C", price: "99.99", qty: 80  },
];

const ORDERS: Order[] = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
];

const STATS = [
  { title: "Total Products",        icon: Package,      color: "text-blue-500",   bg: "bg-blue-50"   },
  { title: "Total Orders",          icon: ShoppingCart, color: "text-green-500",  bg: "bg-green-50"  },
  { title: "All Users",             icon: User,         color: "text-purple-500", bg: "bg-purple-50" },
  { title: "Total Inventory Value", icon: TrendingUp,   color: "text-orange-500", bg: "bg-orange-50" },
];

export const AdminDashboardPage: React.FC = () => {
  const totalInventoryValue = PRODUCTS.reduce((total, p) => {
    return total + (parseFloat(p.price) || 0) * p.qty;
  }, 0);

  const statValues = [
    PRODUCTS.length,
    ORDERS.length,
    CUSTOMERS.length,
    `$${totalInventoryValue.toLocaleString()}`,
  ];

  return (
    <AdminLayout>
      <div className="space-y-10 p-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 font-normal text-base">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-normal text-gray-400">{stat.title}</span>
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {statValues[i]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Customer Table */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            All Customers
          </h2>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-normal text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-normal text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-normal text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-normal text-gray-400 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-normal text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-normal text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {CUSTOMERS.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      index !== CUSTOMERS.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-normal text-gray-400">{customer.id}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{customer.name}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-500">{customer.email}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-500">{customer.phone || "N/A"}</td>
                    <td className="px-6 py-4 text-sm font-normal text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        disabled
                        className="p-2 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed hover:border-red-200 hover:text-red-400 transition-colors duration-150"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};