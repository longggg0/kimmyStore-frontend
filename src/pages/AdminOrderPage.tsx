import React, { useState, useEffect, useMemo } from "react";
import { AdminLayout } from "../components/AdminLayout";
import {
  Download,
  X,
  Package,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useOrder } from "@/hook/useOrder";
import { orderService } from "@/services/order.service";
import { Badge } from "@/components/ui/badge";

const ORDERS_PER_PAGE = 20;

export const AdminOrdersPage: React.FC = () => {
  const [search] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { orders, loading, error } = useOrder();

  const handleDownload = async (id: number) => {
    try {
      await orderService.generateDocx(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseModal = () => {
    setSelectedOrderId(null);
  };

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const fullName =
        `${order.customers.firstName} ${order.customers.lastName}`.toLowerCase();

      const username = order.customers.username?.toLowerCase() ?? "";

      const orderNum = String(order.orderNumber).toLowerCase();

      const query = search.toLowerCase();

      return (
        fullName.includes(query) ||
        username.includes(query) ||
        orderNum.includes(query)
      );
    });
  }, [orders, search]);

  // Reset to page 1 whenever the search query (or underlying data) changes,
  // so the user doesn't get stranded on an out-of-range page.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, orders.length]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ORDERS_PER_PAGE));

  // Clamp current page if filtering shrinks the results below the current page.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ORDERS_PER_PAGE;
    return filtered.slice(start, start + ORDERS_PER_PAGE);
  }, [filtered, currentPage]);

  const startIndex = filtered.length === 0 ? 0 : (currentPage - 1) * ORDERS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ORDERS_PER_PAGE, filtered.length);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Build a compact page number list with ellipses for large page counts.
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const delta = 1;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage - delta > 2) {
      pages.push("ellipsis");
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage + delta < totalPages - 1) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  };

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">
            Orders
          </h1>

          <p className="text-sm font-normal text-gray-400">
            Manage customer orders
          </p>
        </div>

        {/* States */}
        {loading && (
          <p className="text-sm text-gray-400 text-center py-12">
            Loading orders...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500 text-center py-12">
            {error}
          </p>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <colgroup>
                  <col className="w-[13%]" />
                  <col className="w-[22%]" />
                  <col className="w-[11%]" />
                  <col className="w-[11%]" />
                  <col className="w-[10%]" />
                  <col className="w-[11%]" />
                  <col className="w-[12%]" />
                  <col className="w-[10%]" />
                </colgroup>

                <thead>
                  <tr className="border-b border-gray-100 bg-indigo-50/40">
                    {[
                      "Order Number",
                      "Customer",
                      "Location",
                      "Total",
                      "Items",
                      "Discount",
                      "Date",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left text-xs font-normal text-indigo-400/80 uppercase tracking-wider"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-12 text-sm font-normal text-gray-400"
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order, index) => {
                      const totalItems = order.orderDetails.reduce(
                        (sum, detail) => sum + detail.qty,
                        0
                      );

                      return (
                        <tr
                          key={order.id}
                          onClick={() => handleViewOrder(order.id)}
                          className={`cursor-pointer hover:bg-indigo-50/30 transition-colors duration-150 ${
                            index !== paginatedOrders.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                        >
                          {/* Order Number */}
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg">
                              ORD-{String(order.orderNumber).padStart(3, "0")}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="px-4 py-3">
                            <div>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleViewOrder(order.id);
                                }}
                                className="text-left"
                              >
                                <p className="text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                                  {order.customers.firstName}{" "}
                                  {order.customers.lastName}
                                </p>

                                <p className="text-xs font-normal text-gray-400 mt-0.5 truncate">
                                  {order.customers.email}
                                </p>
                              </button>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="px-4 py-3 text-sm font-normal text-gray-500 capitalize">
                            <Badge className="bg-red-50 text-red-500">
                              {order.location}
                            </Badge>
                          </td>

                          {/* Total */}
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                            <Badge className="bg-green-50 text-green-500">
                              ${Number(order.total).toFixed(2)}
                            </Badge>
                          </td>

                          {/* Items */}
                          <td className="px-4 py-3 text-sm font-normal text-gray-500">
                            <Badge className="bg-blue-50 text-blue-500">
                              {totalItems}{" "}
                              {totalItems === 1 ? "item" : "items"}
                            </Badge>
                          </td>

                          {/* Discount */}
                          <td className="px-4 py-3 text-sm font-normal text-gray-500">
                            <Badge className="bg-orange-50 text-orange-500">
                              -${Number(order.discount).toFixed(2)}
                            </Badge>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3 text-sm font-normal text-gray-500">
                            {new Date(
                              order.orderDate
                            ).toLocaleDateString()}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              title="Download invoice"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDownload(order.id);
                              }}
                              className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:border-blue-200 hover:text-blue-500 hover:bg-blue-50 transition-colors duration-150"
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

            {/* Pagination Controls */}
            {filtered.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-normal text-gray-400">
                  Showing{" "}
                  <span className="font-medium text-gray-600">
                    {startIndex}
                  </span>{" "}
                  -{" "}
                  <span className="font-medium text-gray-600">
                    {endIndex}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-600">
                    {filtered.length}
                  </span>{" "}
                  orders
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-400 hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400 disabled:hover:bg-transparent"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {getPageNumbers().map((page, idx) =>
                    page === "ellipsis" ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="flex items-center justify-center h-8 w-8 text-xs text-gray-400"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className={`flex items-center justify-center h-8 w-8 rounded-lg text-xs font-medium transition-colors duration-150 ${
                          page === currentPage
                            ? "bg-indigo-500 text-white"
                            : "border border-gray-200 text-gray-500 hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-400 hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400 disabled:hover:bg-transparent"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Invoice Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={handleCloseModal}
          >
            <div
              className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText
                      size={21}
                      className="text-indigo-500"
                    />

                    <h2 className="text-xl font-semibold text-gray-900">
                      Order Invoice
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-gray-400">
                    Order details and customer information
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(selectedOrder.id)
                    }
                    className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition"
                  >
                    <Download size={16} />
                    Download
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="max-h-[calc(90vh-90px)] overflow-y-auto p-6">
                {/* Order Information */}
                <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {/* Order Number */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Order Number
                      </p>

                      <p className="mt-1 text-sm font-semibold text-indigo-600">
                        ORD-
                        {String(
                          selectedOrder.orderNumber
                        ).padStart(3, "0")}
                      </p>
                    </div>

                    {/* Order ID */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Order ID
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        #{selectedOrder.id}
                      </p>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Order Date
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <Calendar
                          size={15}
                          className="text-amber-400"
                        />

                        <p className="text-sm font-medium text-gray-700">
                          {selectedOrder.orderDate
                            ? new Date(
                                selectedOrder.orderDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        Location
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <MapPin
                          size={15}
                          className="text-rose-400"
                        />

                        <p className="text-sm font-medium text-gray-700 truncate">
                          {selectedOrder.location || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="mb-6">
                  <div className="mb-4 flex items-center gap-2">
                    <User
                      size={20}
                      className="text-indigo-500"
                    />

                    <h3 className="text-lg font-semibold text-gray-800">
                      Customer Information
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-5">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
                          <User
                            size={26}
                            className="text-indigo-400"
                          />
                        </div>

                        <div>
                          <h4 className="text-base font-semibold text-gray-800">
                            {selectedOrder.customers.firstName}{" "}
                            {selectedOrder.customers.lastName}
                          </h4>

                          <p className="mt-1 text-xs text-gray-400">
                            Customer #
                            {selectedOrder.customerId}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail
                            size={16}
                            className="text-indigo-400"
                          />

                          {selectedOrder.customers.email}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone
                            size={16}
                            className="text-emerald-400"
                          />

                          {selectedOrder.customers.phone
                            ? `0${selectedOrder.customers.phone}`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package
                        size={20}
                        className="text-indigo-500"
                      />

                      <h3 className="text-lg font-semibold text-gray-800">
                        Order Items
                      </h3>
                    </div>

                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-500">
                      {selectedOrder.orderDetails.length}{" "}
                      {selectedOrder.orderDetails.length === 1
                        ? "item"
                        : "items"}
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-gray-100">
                    <div className="hidden border-b border-gray-100 bg-indigo-50/40 px-5 py-3 md:grid md:grid-cols-12">
                      <div className="col-span-5 text-xs font-medium uppercase tracking-wide text-indigo-400/80">
                        Product
                      </div>

                      <div className="col-span-2 text-center text-xs font-medium uppercase tracking-wide text-indigo-400/80">
                        Price
                      </div>

                      <div className="col-span-2 text-center text-xs font-medium uppercase tracking-wide text-indigo-400/80">
                        Qty
                      </div>

                      <div className="col-span-3 text-right text-xs font-medium uppercase tracking-wide text-indigo-400/80">
                        Amount
                      </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {selectedOrder.orderDetails.map(
                        (detail, index) => (
                          <div
                            key={
                              detail.id ??
                              `${detail.orderId}-${detail.productId}-${index}`
                            }
                            className="px-5 py-4"
                          >
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
                              {/* Product */}
                              <div className="md:col-span-5">
                                <p className="text-sm font-semibold text-gray-800">
                                  {detail.productName}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  Product ID: {detail.productId}
                                </p>

                                {Number(
                                  detail.discountPercent
                                ) > 0 && (
                                  <span className="mt-2 inline-flex rounded-full bg-green-50 px-2 py-1 text-xs text-green-600">
                                    {Number(
                                      detail.discountPercent
                                    ).toFixed(0)}
                                    % discount
                                  </span>
                                )}
                              </div>

                              {/* Price */}
                              <div className="md:col-span-2 md:text-center">
                                <p className="text-xs text-gray-400 md:hidden">
                                  Price
                                </p>

                                <p className="text-sm text-gray-600">
                                  $
                                  {Number(
                                    detail.productPrice
                                  ).toFixed(2)}
                                </p>

                                {Number(
                                  detail.originalPrice
                                ) >
                                  Number(
                                    detail.productPrice
                                  ) && (
                                  <p className="text-xs text-gray-400 line-through">
                                    $
                                    {Number(
                                      detail.originalPrice
                                    ).toFixed(2)}
                                  </p>
                                )}
                              </div>

                              {/* Quantity */}
                              <div className="md:col-span-2 md:text-center">
                                <p className="text-xs text-gray-400 md:hidden">
                                  Quantity
                                </p>

                                <p className="text-sm font-medium text-gray-700">
                                  {detail.qty}
                                </p>
                              </div>

                              {/* Amount */}
                              <div className="md:col-span-3 md:text-right">
                                <p className="text-xs text-gray-400 md:hidden">
                                  Amount
                                </p>

                                <p className="text-sm font-semibold text-gray-800">
                                  $
                                  {Number(
                                    detail.amount
                                  ).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Invoice Summary */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <div className="ml-auto max-w-sm space-y-3">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>

                      <span>
                        $
                        {selectedOrder.orderDetails
                          .reduce(
                            (sum, detail) =>
                              sum + Number(detail.amount),
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>

                    {/* Discount */}
                    <div className="flex justify-between text-sm text-red-500">
                      <span>Discount</span>

                      <span>
                        -$
                        {Number(
                          selectedOrder.discount
                        ).toFixed(2)}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-semibold text-indigo-600">
                        <span>Total</span>

                        <span>
                          $
                          {Number(
                            selectedOrder.total
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};