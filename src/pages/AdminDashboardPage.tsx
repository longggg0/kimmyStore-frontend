import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  User,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Circle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 1, name: "Widget A", price: "29.99", qty: 100, category: "Basic" },
  { id: 2, name: "Widget B", price: "49.99", qty: 250, category: "Pro" },
  { id: 3, name: "Widget C", price: "99.99", qty: 80, category: "Premium" },
  { id: 4, name: "Widget D", price: "19.99", qty: 320, category: "Basic" },
  { id: 5, name: "Widget E", price: "149.99", qty: 45, category: "Premium" },
];

const ORDERS = [
  { id: 1, status: "Completed", value: 129.97, date: "2024-06-01" },
  { id: 2, status: "Pending",   value: 49.99,  date: "2024-06-03" },
  { id: 3, status: "Completed", value: 299.97, date: "2024-06-05" },
  { id: 4, status: "Cancelled", value: 99.99,  date: "2024-06-06" },
  { id: 5, status: "Completed", value: 179.96, date: "2024-06-07" },
  { id: 6, status: "Pending",   value: 59.99,  date: "2024-06-08" },
];

const CUSTOMERS = [
  { id: 1, name: "Alice Martin",  email: "alice@example.com",  orders: 12, spend: 840.5,  status: "Active"    },
  { id: 2, name: "Bob Chen",      email: "bob@example.com",    orders: 4,  spend: 219.96, status: "Active"    },
  { id: 3, name: "Clara Diaz",    email: "clara@example.com",  orders: 8,  spend: 632.0,  status: "Inactive"  },
  { id: 4, name: "David Kim",     email: "david@example.com",  orders: 21, spend: 1480.0, status: "Active"    },
  { id: 5, name: "Emma Wilson",   email: "emma@example.com",   orders: 2,  spend: 89.98,  status: "New"       },
];

const REVENUE_TREND = [
  { month: "Jan", revenue: 4200, orders: 38 },
  { month: "Feb", revenue: 3800, orders: 32 },
  { month: "Mar", revenue: 5100, orders: 47 },
  { month: "Apr", revenue: 4700, orders: 43 },
  { month: "May", revenue: 6200, orders: 56 },
  { month: "Jun", revenue: 5800, orders: 52 },
  { month: "Jul", revenue: 7100, orders: 65 },
];

const CATEGORY_DATA = [
  { name: "Basic",   value: 420, color: "#6366f1" },
  { name: "Pro",     value: 250, color: "#8b5cf6" },
  { name: "Premium", value: 125, color: "#a78bfa" },
];

const ORDER_STATUS_DATA = [
  { name: "Completed", value: 3, color: "#10b981" },
  { name: "Pending",   value: 2, color: "#f59e0b" },
  { name: "Cancelled", value: 1, color: "#ef4444" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const totalInventoryValue = PRODUCTS.reduce(
  (t, p) => t + parseFloat(p.price) * p.qty,
  0
);
const totalRevenue = REVENUE_TREND.reduce((t, r) => t + r.revenue, 0);
const completedOrders = ORDERS.filter((o) => o.status === "Completed").length;

// ─── Sub-components ───────────────────────────────────────────────────────────

type StatCardProps = {
  title: string;
  value: string | number;
  sub: string;
  up: boolean;
  pct: string;
  icon: React.ElementType;
  accent: string;
  accentBg: string;
};

const StatCard: React.FC<StatCardProps> = ({
  title, value, sub, up, pct, icon: Icon, accent, accentBg,
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-200 group">
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</span>
      <div className={`p-2 rounded-xl ${accentBg}`}>
        <Icon className={`h-4 w-4 ${accent}`} />
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1 font-mono">{value}</div>
    <div className="flex items-center gap-1.5 text-xs">
      {up ? (
        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
      )}
      <span className={up ? "text-emerald-600 font-semibold" : "text-red-400 font-semibold"}>{pct}</span>
      <span className="text-gray-400">{sub}</span>
    </div>
  </div>
);

const SectionHeading: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-base font-semibold text-gray-800">{title}</h2>
    {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export const AdminDashboardPage: React.FC = () => {
  const [revenueView, setRevenueView] = useState<"revenue" | "orders">("revenue");

  return (
    <AdminLayout>
      <div className="max-w-screen-xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-indigo-500 font-semibold uppercase tracking-widest mb-1">Analytics</p>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">Dashboard Overview</h1>
            <p className="text-sm text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="text-xs text-gray-400 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
            Last updated: <span className="text-gray-700 font-medium">just now</span>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Products"     icon={Package}
            value={PRODUCTS.length}    pct="+2 this week"
            sub="vs last week"         up={true}
            accent="text-indigo-500"   accentBg="bg-indigo-50"
          />
          <StatCard
            title="Total Orders"       icon={ShoppingCart}
            value={ORDERS.length}      pct="+18%"
            sub="vs last month"        up={true}
            accent="text-emerald-500"  accentBg="bg-emerald-50"
          />
          <StatCard
            title="Total Customers"    icon={User}
            value={CUSTOMERS.length}   pct="-3%"
            sub="vs last month"        up={false}
            accent="text-violet-500"   accentBg="bg-violet-50"
          />
          <StatCard
            title="Inventory Value"    icon={TrendingUp}
            value={`$${totalInventoryValue.toLocaleString()}`}  pct="+5.4%"
            sub="vs last quarter"      up={true}
            accent="text-amber-500"    accentBg="bg-amber-50"
          />
        </div>

        {/* ── Revenue Trend + Order Status ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Revenue Area Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <SectionHeading title="Revenue & Order Trend" subtitle="Monthly performance over 7 months" />
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1 text-xs">
                {(["revenue", "orders"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setRevenueView(v)}
                    className={`px-3 py-1 rounded-md capitalize font-medium transition-all ${
                      revenueView === v
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={REVENUE_TREND} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12 }}
                  formatter={(v: unknown) => {
                    const num = Number(v);
                    return revenueView === "revenue"
                      ? [`$${num.toLocaleString()}`, "Revenue"]
                      : [`${num}`, "Orders"];
                  }}
                />
                {revenueView === "revenue" ? (
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5}
                    fill="url(#colorRevenue)" dot={{ r: 3, fill: "#6366f1" }} activeDot={{ r: 5 }} />
                ) : (
                  <Area type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2.5}
                    fill="url(#colorOrders)" dot={{ r: 3, fill: "#10b981" }} activeDot={{ r: 5 }} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Donut */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col">
            <SectionHeading title="Order Status" subtitle="Current breakdown" />
            <div className="flex-1 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={ORDER_STATUS_DATA} cx="50%" cy="50%"
                    innerRadius={45} outerRadius={70}
                    paddingAngle={3} dataKey="value"
                  >
                    {ORDER_STATUS_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "10px", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 w-full mt-2">
                {ORDER_STATUS_DATA.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: s.color }} />
                      <span className="text-gray-600">{s.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Category Bar + Top Products ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Sales by Category */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <SectionHeading title="Sales by Category" subtitle="Units sold per product tier" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CATEGORY_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
                  {CATEGORY_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products Table */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <SectionHeading title="Top Products by Inventory Value" />
            <div className="space-y-3">
              {[...PRODUCTS]
                .sort((a, b) => parseFloat(b.price) * b.qty - parseFloat(a.price) * a.qty)
                .slice(0, 5)
                .map((p, i) => {
                  const val = parseFloat(p.price) * p.qty;
                  const maxVal = parseFloat(PRODUCTS[1].price) * PRODUCTS[1].qty;
                  const pct = Math.round((val / (maxVal * 1.5)) * 100);
                  return (
                    <div key={p.id}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-mono w-4">{i + 1}</span>
                          <span className="font-medium text-gray-800">{p.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            p.category === "Premium" ? "bg-violet-100 text-violet-600"
                            : p.category === "Pro" ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-100 text-gray-500"
                          }`}>{p.category}</span>
                        </div>
                        <span className="font-semibold text-gray-700 font-mono">${val.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* ── Customer Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-50">
            <SectionHeading title="Customer Overview" subtitle="Top customers by total spend" />
            <button className="text-xs text-indigo-500 font-semibold hover:underline">View all →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider bg-gray-50/60">
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium text-right">Orders</th>
                  <th className="px-6 py-3 font-medium text-right">Total Spend</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CUSTOMERS.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="font-medium text-gray-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{c.email}</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-700">{c.orders}</td>
                    <td className="px-6 py-4 text-right font-mono font-semibold text-gray-800">
                      ${c.spend.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        c.status === "Active"   ? "bg-emerald-50 text-emerald-600"
                        : c.status === "New"    ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          c.status === "Active" ? "bg-emerald-500"
                          : c.status === "New"  ? "bg-blue-500"
                          : "bg-gray-300"
                        }`} />
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Summary */}
          <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex flex-wrap gap-6 text-xs text-gray-500">
            <span>Total customers: <strong className="text-gray-700">{CUSTOMERS.length}</strong></span>
            <span>Active: <strong className="text-emerald-600">{CUSTOMERS.filter(c => c.status === "Active").length}</strong></span>
            <span>Total spend: <strong className="text-gray-700">${CUSTOMERS.reduce((t, c) => t + c.spend, 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></span>
            <span>Completed orders rate: <strong className="text-indigo-600">{Math.round((completedOrders / ORDERS.length) * 100)}%</strong></span>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;