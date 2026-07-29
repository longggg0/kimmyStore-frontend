import React, { useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { Download, Search,  } from "lucide-react";
import { useOrder } from "@/hook/useOrder";
import { orderService } from "@/services/order.service";
import { Badge } from "@/components/ui/badge";
export const AdminOrdersPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const { orders, loading, error } = useOrder();

  const handleDownload = async (id: number) => {
    try {
      await orderService.generateDocx(id);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = orders.filter((o) => {
    const fullName = `${o.customers.firstName} ${o.customers.lastName}`.toLowerCase();
    const orderNum = String(o.orderNumber).toLowerCase();
    const query = search.toLowerCase();
    return fullName.includes(query) || orderNum.includes(query);
  });

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">Orders</h1>
          <p className="text-sm font-normal text-gray-400">Manage customer orders</p>
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

        {/* States */}
        {loading && (
          <p className="text-sm text-gray-400 text-center py-12">Loading orders...</p>
        )}
        {error && (
          <p className="text-sm text-red-500 text-center py-12">{error}</p>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Order Number", "Customer", "Location", "Total", "Items", "Discount", "Date", "Actions"].map((h) => (
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
                      <td colSpan={8} className="text-center py-12 text-sm font-normal text-gray-400">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order, index) => {
                      const totalItems = order.orderDetails.reduce(
                        (sum, d) => sum + d.qty, 0
                      );

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
                              ORD-{String(order.id).padStart(3, "0")}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {order.customers.firstName} {order.customers.lastName}
                                
                              </p>
                              <p className="text-xs font-normal text-gray-400 mt-0.5">
                                
                                {order.customers.email}
                              </p>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="px-6 py-4 text-sm font-normal text-gray-500 capitalize">
                            <Badge className="bg-red-50 text-red-500">{order.location}</Badge>
                          </td>

                          {/* Total */}
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                            <Badge className="bg-green-50 text-green-500">${Number(order.total).toLocaleString()}</Badge>
                          </td>

                          {/* Items */}
                          <td className="px-6 py-4 text-sm font-normal text-gray-500">
                            <Badge className="bg-blue-50 text-blue-500">{totalItems} {totalItems === 1 ? "item" : "items"}</Badge>
                          </td>

                          {/* Discount */}
                          <td className="px-6 py-4 text-sm font-normal text-gray-500">
                            <Badge className="bg-red-50 text-red-500">{order.discount}%</Badge>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 text-sm font-normal text-gray-500">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDownload(order.id)}
                              className="p-2 rounded-lg border border-gray-200 text-black-400
                                hover:border-blue-200 hover:text-blue-400
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
        )}

      </div>
    </AdminLayout>
  );
};