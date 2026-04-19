import React, { useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { Eye, CheckCircle, XCircle, Download, Search } from "lucide-react";

type Order = {
  id: number;
  orderNumber: string;
  customer: { name: string; email: string } | null;
  location: string;
  total: string;
  status: "completed" | "pending" | "cancelled";
  orderDate: string;
};

const ORDERS: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-001",
    customer: { name: "Alice Johnson", email: "alice@example.com" },
    location: "New York, USA",
    total: "1,999.99",
    status: "completed",
    orderDate: "2025-01-15T00:00:00Z",
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    customer: { name: "Bob Martinez", email: "bob@example.com" },
    location: "Los Angeles, USA",
    total: "349.99",
    status: "pending",
    orderDate: "2025-02-03T00:00:00Z",
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    customer: null,
    location: "Chicago, USA",
    total: "999.99",
    status: "cancelled",
    orderDate: "2025-03-20T00:00:00Z",
  },
  {
    id: 4,
    orderNumber: "ORD-004",
    customer: { name: "Clara Nguyen", email: "clara@example.com" },
    location: "Houston, USA",
    total: "2,549.00",
    status: "completed",
    orderDate: "2025-04-01T00:00:00Z",
  },
];

const STATUS_CONFIG = {
  completed: {
    icon: CheckCircle,
    class: "bg-green-50 text-green-600",
  },
  pending: {
    icon: Eye,
    class: "bg-yellow-50 text-yellow-600",
  },
  cancelled: {
    icon: XCircle,
    class: "bg-red-50 text-red-500",
  },
};

export const AdminOrdersPage: React.FC = () => {
  const [search, setSearch] = useState("");

  const filtered = ORDERS.filter((o) =>
    o.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">Orders</h1>
          <p className="text-sm font-normal text-gray-400">
            Manage customer orders
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer or order number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm font-normal bg-white border border-gray-100
              rounded-xl outline-none focus:border-gray-300 transition-colors duration-150
              text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Order Number", "Customer", "Location", "Total", "Status", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-xs font-normal text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-sm font-normal text-gray-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filtered.map((order, index) => {
                    const status = STATUS_CONFIG[order.status];
                    const StatusIcon = status.icon;

                    return (
                      <tr
                        key={order.id}
                        className={`hover:bg-gray-50 transition-colors duration-150 ${
                          index !== filtered.length - 1 ? "border-b border-gray-100" : ""
                        }`}
                      >
                        {/* Order Number */}
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-normal rounded-lg">
                            {order.orderNumber}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          {order.customer ? (
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {order.customer.name}
                              </p>
                              <p className="text-xs font-normal text-gray-400 mt-0.5">
                                {order.customer.email}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm font-normal text-gray-400">
                              No customer
                            </span>
                          )}
                        </td>

                        {/* Location */}
                        <td className="px-6 py-4 text-sm font-normal text-gray-500">
                          {order.location}
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                          ${order.total}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-normal rounded-lg capitalize ${status.class}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {order.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-sm font-normal text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <button
                            disabled
                            className="p-2 rounded-lg border border-gray-200 text-gray-400
                              cursor-not-allowed hover:border-blue-200 hover:text-blue-400
                              transition-colors duration-150"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};