import React, { useMemo, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Package, ShoppingCart, TrendingUp, User, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useOrder } from "@/hook/useOrder";
import { useProducts } from "@/hook/useProduct";
import { useCustomers } from "@/hook/useCustomers";

const ACCENT = "#4f46e5";
const NEUTRAL_CHART = "#9ca3af";

// A small, deliberate palette — used only for icon chips and category
// identification, never for large surfaces or text.
const PALETTE = ["#4f46e5", "#0891b2", "#d97706", "#db2777", "#16a34a", "#7c3aed"];
const categoryColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

// ─── Sub-components ───────────────────────────────────────────────────────────

type TrendInfo = { up: boolean; pct: string; sub: string };

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: TrendInfo;
  staticSub?: string;
  accent: string; // hex color for the icon chip
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, staticSub, accent }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</span>
      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${accent}15` }}>
        <Icon className="h-4 w-4" style={{ color: accent }} />
      </div>
    </div>
    <div className="text-2xl font-semibold text-gray-900 mb-1.5 tabular-nums">{value}</div>
    {trend ? (
      <div className="flex items-center gap-1 text-xs">
        {trend.up ? (
          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5 text-red-600" />
        )}
        <span className={`font-medium ${trend.up ? "text-emerald-600" : "text-red-600"}`}>{trend.pct}</span>
        <span className="text-gray-400">{trend.sub}</span>
      </div>
    ) : (
      <p className="text-xs text-gray-400">{staticSub}</p>
    )}
  </div>
);

const SectionHeading: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
    {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
  </div>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>{children}</div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const num = (v: string | null | undefined) => parseFloat(v ?? "0") || 0;

function monthKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export const AdminDashboardPage: React.FC = () => {
  const [revenueView, setRevenueView] = useState<"revenue" | "orders">("revenue");

  const { orders, loading: ordersLoading, error: ordersError } = useOrder();
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: customersData, isLoading: customersLoading } = useCustomers();

  const products = productsData?.data ?? [];
  const customersRaw = customersData?.data ?? [];

  const loading = ordersLoading || productsLoading || customersLoading;

  // ── Derived data (all computed from real fetched data) ──
  const derived = useMemo(() => {
    const now = new Date();

    // Last 7 months, oldest -> newest
    const months = Array.from({ length: 7 }, (_, idx) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (6 - idx), 1);
      return { key: monthKey(d), label: d.toLocaleString("en-US", { month: "short" }) };
    });

    const revenueTrend = months.map(({ key, label }) => {
      const monthOrders = orders.filter((o) => monthKey(new Date(o.orderDate)) === key);
      return {
        month: label,
        revenue: monthOrders.reduce((sum, o) => sum + num(o.total), 0),
        orders: monthOrders.length,
      };
    });

    // Orders this month vs last month, for a real trend arrow
    const thisMonthKey = monthKey(now);
    const lastMonthKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    const ordersThisMonth = orders.filter((o) => monthKey(new Date(o.orderDate)) === thisMonthKey).length;
    const ordersLastMonth = orders.filter((o) => monthKey(new Date(o.orderDate)) === lastMonthKey).length;
    const orderTrendPct = ordersLastMonth === 0
      ? null
      : Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100);

    // New customers this month vs last month
    const newThisMonth = customersRaw.filter(
      (c) => c.createdAt && monthKey(new Date(c.createdAt)) === thisMonthKey
    ).length;
    const newLastMonth = customersRaw.filter(
      (c) => c.createdAt && monthKey(new Date(c.createdAt)) === lastMonthKey
    ).length;

    // Discounted vs full-price orders
    const discountedCount = orders.filter((o) => num(o.discount) > 0).length;
    const fullPriceCount = orders.length - discountedCount;
    const discountData = [
      { name: "Discounted", value: discountedCount, color: "#4f46e5" },
      { name: "Full Price", value: fullPriceCount, color: "#c7d2fe" },
    ];

    // Sales by category — sum qty sold per category, joined via product lookup
    const productMap = new Map(products.map((p) => [p.id, p]));
    const categoryQty = new Map<string, number>();
    orders.forEach((o) => {
      o.orderDetails.forEach((od) => {
        const product = productMap.get(od.productId);
        const catName = product?.category?.name ?? "Other";
        categoryQty.set(catName, (categoryQty.get(catName) ?? 0) + od.qty);
      });
    });
    const categoryData = Array.from(categoryQty, ([name, value]) => ({ name, value }));

    // Top products by current inventory value (price * qty in stock)
    const topProducts = [...products]
      .sort((a, b) => num(b.price) * b.qty - num(a.price) * a.qty)
      .slice(0, 5);
    const maxInventoryVal = topProducts.length
      ? num(topProducts[0].price) * topProducts[0].qty
      : 1;

    // Per-customer order count + spend, joined from orders
    const statsByCustomer = new Map<number, { orders: number; spend: number }>();
    orders.forEach((o) => {
      const cur = statsByCustomer.get(o.customerId) ?? { orders: 0, spend: 0 };
      cur.orders += 1;
      cur.spend += num(o.total);
      statsByCustomer.set(o.customerId, cur);
    });

    const thirtyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
    const customersEnriched = customersRaw
      .map((c) => {
        const stats = statsByCustomer.get(c.id) ?? { orders: 0, spend: 0 };
        const isNew = c.createdAt ? new Date(c.createdAt).getTime() > thirtyDaysAgo : false;
        const status: "Active" | "New" | "Inactive" = isNew ? "New" : stats.orders > 0 ? "Active" : "Inactive";
        return { ...c, orders: stats.orders, spend: stats.spend, status };
      })
      .sort((a, b) => b.spend - a.spend);

    const totalInventoryValue = products.reduce((t, p) => t + num(p.price) * p.qty, 0);
    const totalRevenueAll = orders.reduce((t, o) => t + num(o.total), 0);

    return {
      revenueTrend,
      orderTrendPct,
      newThisMonth,
      newLastMonth,
      discountData,
      discountedCount,
      categoryData,
      topProducts,
      maxInventoryVal,
      customersEnriched,
      totalInventoryValue,
      totalRevenueAll,
    };
  }, [orders, products, customersRaw]);

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-sm text-gray-400 text-center py-24">Loading dashboard...</p>
      </AdminLayout>
    );
  }

  if (ordersError) {
    return (
      <AdminLayout>
        <p className="text-sm text-red-500 text-center py-24">{ordersError}</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-screen-xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Overview of orders, products, and customers.</p>
          </div>
          <p className="text-xs text-gray-400">Last updated just now</p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Products" icon={Package} value={products.length} staticSub="In catalog" accent="#4f46e5" />

          <StatCard
            title="Total Orders"
            icon={ShoppingCart}
            value={orders.length}
            accent="#0891b2"
            trend={
              derived.orderTrendPct === null
                ? undefined
                : {
                    up: derived.orderTrendPct >= 0,
                    pct: `${derived.orderTrendPct >= 0 ? "+" : ""}${derived.orderTrendPct}%`,
                    sub: "vs last month",
                  }
            }
            staticSub={derived.orderTrendPct === null ? "No orders last month to compare" : undefined}
          />

          <StatCard
            title="Total Customers"
            icon={User}
            value={customersRaw.length}
            accent="#d97706"
            trend={{
              up: derived.newThisMonth >= derived.newLastMonth,
              pct: `+${derived.newThisMonth}`,
              sub: "new this month",
            }}
          />

          <StatCard
            title="Inventory Value"
            icon={TrendingUp}
            value={`$${derived.totalInventoryValue.toLocaleString()}`}
            accent="#16a34a"
            staticSub="Current stock value"
          />
        </div>

        {/* ── Revenue Trend + Discount Split ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <SectionHeading title="Revenue & orders" subtitle="Monthly, last 7 months" />
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1 text-xs">
                {(["revenue", "orders"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setRevenueView(v)}
                    className={`px-3 py-1 rounded-md capitalize font-medium transition-colors ${
                      revenueView === v ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={derived.revenueTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAccent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ACCENT} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: NEUTRAL_CHART }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: NEUTRAL_CHART }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }}
                  formatter={(v: unknown) => {
                    const n = Number(v);
                    return revenueView === "revenue" ? [`$${n.toLocaleString()}`, "Revenue"] : [`${n}`, "Orders"];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={revenueView}
                  stroke={ACCENT}
                  strokeWidth={2}
                  fill="url(#colorAccent)"
                  dot={{ r: 3, fill: ACCENT }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <SectionHeading title="Discounted vs full-price" subtitle="Orders breakdown" />
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={derived.discountData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={2} dataKey="value">
                  {derived.discountData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {derived.discountData.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: s.color }} />
                    <span className="text-gray-600">{s.name}</span>
                  </div>
                  <span className="font-medium text-gray-900 tabular-nums">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Category Bar + Top Products ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <SectionHeading title="Sales by category" subtitle="Units sold per category" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={derived.categoryData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: NEUTRAL_CHART }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: NEUTRAL_CHART }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={56}>
                  {derived.categoryData.map((entry, i) => (
                    <Cell key={i} fill={categoryColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <SectionHeading title="Top products by inventory value" />
            <div className="space-y-3">
              {derived.topProducts.map((p, i) => {
                const val = num(p.price) * p.qty;
                const pct = Math.round((val / derived.maxInventoryVal) * 100);
                const catName = p.category?.name ?? "Uncategorized";
                return (
                  <div key={p.id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-gray-400 tabular-nums w-4 flex-shrink-0">{i + 1}</span>
                        <span className="font-medium text-gray-800 truncate">{p.name}</span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 font-medium"
                          style={{ backgroundColor: `${categoryColor(catName)}15`, color: categoryColor(catName) }}
                        >
                          {catName}
                        </span>
                      </div>
                      <span className="font-medium text-gray-700 tabular-nums flex-shrink-0 ml-2">${val.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ACCENT }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ── Customer Table ── */}
        <Card className="!p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <SectionHeading title="Customer overview" subtitle="Top customers by total spend" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide bg-gray-50">
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium text-right">Orders</th>
                  <th className="px-6 py-3 font-medium text-right">Total spend</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {derived.customersEnriched.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-semibold flex-shrink-0">
                          {(c.firstName?.[0] ?? c.username[0]).toUpperCase()}
                          {(c.lastName?.[0] ?? "").toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">
                          {c.firstName || c.lastName ? `${c.firstName} ${c.lastName}` : c.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{c.email}</td>
                    <td className="px-6 py-4 text-right tabular-nums text-gray-700">{c.orders}</td>
                    <td className="px-6 py-4 text-right tabular-nums font-medium text-gray-900">
                      ${c.spend.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          c.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : c.status === "New"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.status === "Active" ? "bg-emerald-500" : c.status === "New" ? "bg-blue-500" : "bg-gray-400"
                          }`}
                        />
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Summary */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-6 text-xs text-gray-500">
            <span>Total customers: <strong className="text-gray-800 tabular-nums">{customersRaw.length}</strong></span>
            <span>Total orders: <strong className="text-gray-800 tabular-nums">{orders.length}</strong></span>
            <span>Total revenue: <strong className="text-gray-800 tabular-nums">${derived.totalRevenueAll.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></span>
            <span>Discounted orders: <strong className="text-gray-800 tabular-nums">{orders.length ? Math.round((derived.discountedCount / orders.length) * 100) : 0}%</strong></span>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;