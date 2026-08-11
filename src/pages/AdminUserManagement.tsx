import React, { useState } from "react";

import { AdminLayout } from "../components/AdminLayout";

import {
  User,
  Mail,
  Phone,
  Search,
  Eye,
  Pencil,
  Trash2,
  X,
  Package,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  useCustomerManagement,
  useCustomerOrders,
  useDeleteCustomer,
  useUpdateCustomer,
} from "@/hook/useCustomerManagement";

import type {
  CustomerOrder,
} from "@/types/CustomerManagement";

export const AdminUserManagement: React.FC = () => {
  const [search, setSearch] = useState("");

  const [selectedCustomerId, setSelectedCustomerId] =
    useState<number | null>(null);

  const [expandedOrderId, setExpandedOrderId] =
    useState<number | null>(null);

  const [editingCustomerId, setEditingCustomerId] =
    useState<number | null>(null);

  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    phone: "",
    role: "user" as "user" | "admin",
  });

  const {
    data,
    isLoading,
    isError,
    error,
  } = useCustomerManagement(search);

  const {
    data: customerOrdersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useCustomerOrders(selectedCustomerId ?? undefined);

  const deleteCustomer = useDeleteCustomer();

  const updateCustomer = useUpdateCustomer();

  const customers = data?.customers ?? [];

  const handleViewCustomer = (
    customerId: number
  ) => {
    setSelectedCustomerId(customerId);
    setExpandedOrderId(null);
  };

  const handleCloseModal = () => {
    setSelectedCustomerId(null);
    setExpandedOrderId(null);
  };

  const handleEditCustomer = (
    customer: (typeof customers)[number]
  ) => {
    setEditingCustomerId(customer.id);

    setEditForm({
      username: customer.username ?? "",
      email: customer.email ?? "",
      phone: customer.phone
        ? String(customer.phone)
        : "",
      role: customer.role ?? "user",
    });
  };

  const handleCloseEditModal = () => {
    if (updateCustomer.isPending) {
      return;
    }

    setEditingCustomerId(null);

    setEditForm({
      username: "",
      email: "",
      phone: "",
      role: "user",
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleUpdateCustomer = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (editingCustomerId === null) {
      return;
    }

    updateCustomer.mutate(
      {
        customerId: editingCustomerId,
        payload: {
          username: editForm.username.trim(),
          email: editForm.email.trim(),
          phone: editForm.phone.trim(),
          role: editForm.role,
        },
      },
      {
        onSuccess: () => {
          setEditingCustomerId(null);

          setEditForm({
            username: "",
            email: "",
            phone: "",
            role: "user",
          });
        },
      }
    );
  };

  const handleDelete = (
    customerId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) {
      return;
    }

    deleteCustomer.mutate(customerId);
  };

  const toggleOrder = (
    orderId: number
  ) => {
    setExpandedOrderId((current) =>
      current === orderId
        ? null
        : orderId
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">
            User Management
          </h1>

          <p className="text-sm text-gray-400">
            Manage registered customers
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search username or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-indigo-50/40">
                  {[
                    "ID",
                    "User",
                    "Username",
                    "Email",
                    "Phone",
                    "Role",
                    "Created At",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-4 text-left text-xs font-normal text-indigo-400/80 uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-12 text-sm text-gray-400"
                    >
                      Loading users...
                    </td>
                  </tr>
                )}

                {isError && (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-12 text-sm text-red-400"
                    >
                      {error instanceof Error
                        ? error.message
                        : "Failed to load users."}
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isError &&
                  customers.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-12 text-sm text-gray-400"
                      >
                        No users found
                      </td>
                    </tr>
                  )}

                {!isLoading &&
                  !isError &&
                  customers.map(
                    (customer, index) => (
                      <tr
                        key={customer.id}
                        className={`hover:bg-indigo-50/30 transition-colors duration-150 ${
                          index !==
                          customers.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {customer.id}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                              <User className="w-5 h-5 text-indigo-400" />
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {customer.username}
                              </p>

                              <p className="text-xs text-gray-400">
                                Customer #
                                {customer.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            @{customer.username}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-indigo-400" />

                            <span className="text-sm text-gray-600">
                              {customer.email}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-emerald-400" />

                            <span className="text-sm text-gray-600">
                              0
                              {customer.phone ||
                                "N/A"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              customer.role ===
                              "admin"
                                ? "bg-purple-50 text-purple-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            {customer.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500">
                            {customer.createdAt
                              ? new Date(
                                  customer.createdAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              title="View customer"
                              onClick={() =>
                                handleViewCustomer(
                                  customer.id
                                )
                              }
                              className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              type="button"
                              title="Edit customer"
                              onClick={() =>
                                handleEditCustomer(
                                  customer
                                )
                              }
                              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              title="Delete customer"
                              disabled={
                                deleteCustomer.isPending
                              }
                              onClick={() =>
                                handleDelete(
                                  customer.id
                                )
                              }
                              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedCustomerId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Customer Details
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Customer information and order history
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[calc(90vh-90px)] overflow-y-auto p-6">
              {customerOrdersData?.customer && (
                <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white border border-indigo-100">
                        <User className="h-7 w-7 text-indigo-400" />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {
                            customerOrdersData
                              .customer
                              .username
                          }
                        </h3>

                        <p className="text-sm text-gray-400">
                          Customer #
                          {
                            customerOrdersData
                              .customer
                              .id
                          }
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail
                          size={16}
                          className="text-indigo-400"
                        />

                        {
                          customerOrdersData
                            .customer
                            .email
                        }
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone
                          size={16}
                          className="text-emerald-400"
                        />

                        0
                        {
                          customerOrdersData
                            .customer
                            .phone ||
                          "N/A"
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package
                    size={20}
                    className="text-indigo-500"
                  />

                  <h3 className="text-lg font-semibold text-gray-800">
                    Order History
                  </h3>
                </div>

                {!isOrdersLoading &&
                  customerOrdersData && (
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-500">
                      {
                        customerOrdersData.count
                      }{" "}
                      {customerOrdersData.count ===
                      1
                        ? "order"
                        : "orders"}
                    </span>
                  )}
              </div>

              {isOrdersLoading && (
                <div className="py-12 text-center text-sm text-gray-400">
                  Loading order history...
                </div>
              )}

              {isOrdersError && (
                <div className="rounded-xl bg-red-50 p-5 text-center text-sm text-red-500">
                  Failed to load order history.
                </div>
              )}

              {!isOrdersLoading &&
                !isOrdersError &&
                customerOrdersData &&
                customerOrdersData.orders
                  .length === 0 && (
                  <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center">
                    <Package
                      size={35}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="text-sm text-gray-400">
                      This customer has no orders yet.
                    </p>
                  </div>
                )}

              {!isOrdersLoading &&
                !isOrdersError &&
                customerOrdersData?.orders.map(
                  (order: CustomerOrder) => {
                    const isExpanded =
                      expandedOrderId ===
                      order.id;

                    return (
                      <div
                        key={order.id}
                        className="mb-4 overflow-hidden rounded-2xl border border-gray-100"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            toggleOrder(
                              order.id
                            )
                          }
                          className="w-full bg-white p-5 text-left transition hover:bg-indigo-50/30"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <p className="mt-1 text-xs text-gray-400">
                                ID: {order.id}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar
                                size={16}
                                className="text-amber-400"
                              />

                              {order.orderDate
                                ? new Date(
                                    order.orderDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin
                                size={16}
                                className="text-rose-400"
                              />

                              <span className="max-w-[180px] truncate">
                                {order.location ||
                                  "N/A"}
                              </span>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-gray-400">
                                Total
                              </p>

                              <p className="text-sm font-semibold text-indigo-600">
                                $
                                {Number(
                                  order.total
                                ).toFixed(2)}
                              </p>
                            </div>

                            <div className="text-indigo-400">
                              {isExpanded ? (
                                <ChevronUp
                                  size={18}
                                />
                              ) : (
                                <ChevronDown
                                  size={18}
                                />
                              )}
                            </div>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-gray-100 bg-gray-50 p-5">
                            <div className="mb-4 flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-gray-700">
                                Order Items
                              </h4>

                              <span className="text-xs text-gray-400">
                                {order
                                  .orderDetails
                                  ?.length ??
                                  0}{" "}
                                items
                              </span>
                            </div>

                            <div className="space-y-3">
                              {order.orderDetails?.map(
                                (detail) => (
                                  <div
                                    key={
                                      detail.id ??
                                      `${detail.orderId}-${detail.productId}`
                                    }
                                    className="rounded-xl bg-white border border-gray-100 p-4"
                                  >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                      <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                          {
                                            detail.productName
                                          }
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                          Product ID:{" "}
                                          {
                                            detail.productId
                                          }
                                        </p>
                                      </div>

                                      <div className="text-sm text-gray-500">
                                        Qty:{" "}
                                        {
                                          detail.qty
                                        }
                                      </div>

                                      <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-800">
                                          $
                                          {Number(
                                            detail.amount
                                          ).toFixed(
                                            2
                                          )}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                          $
                                          {Number(
                                            detail.productPrice
                                          ).toFixed(
                                            2
                                          )}{" "}
                                          each
                                        </p>
                                      </div>
                                    </div>

                                    {Number(
                                      detail.discountPercent
                                    ) > 0 && (
                                      <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                                        <span>
                                          Discount:{" "}
                                          {
                                            detail.discountPercent
                                          }
                                          %
                                        </span>

                                        <span className="text-gray-400">
                                          Original: $
                                          {Number(
                                            detail.originalPrice
                                          ).toFixed(
                                            2
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )
                              )}
                            </div>

                            <div className="mt-5 border-t border-gray-200 pt-4">
                              <div className="ml-auto max-w-xs space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                  <span>
                                    Discount
                                  </span>

                                  <span>
                                    -$
                                    {Number(
                                      order.discount
                                    ).toFixed(
                                      2
                                    )}
                                  </span>
                                </div>

                                <div className="flex justify-between text-base font-semibold text-indigo-600">
                                  <span>
                                    Total
                                  </span>

                                  <span>
                                    $
                                    {Number(
                                      order.total
                                    ).toFixed(
                                      2
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        </div>
      )}

      {editingCustomerId !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onClick={handleCloseEditModal}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit Customer
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Update customer information
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseEditModal}
                disabled={
                  updateCustomer.isPending
                }
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateCustomer}
              className="p-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Username
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"
                  />

                  <input
                    type="text"
                    name="username"
                    value={
                      editForm.username
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={
                      editForm.email
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400"
                  />

                  <input
                    type="text"
                    name="phone"
                    value={
                      editForm.phone
                    }
                    onChange={
                      handleEditChange
                    }
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Role
                </label>

                <select
                  name="role"
                  value={editForm.role}
                  onChange={
                    handleEditChange
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="user">
                    User
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </div>

              {updateCustomer.isError && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-500">
                  {updateCustomer.error instanceof
                  Error
                    ? updateCustomer.error.message
                    : "Failed to update customer."}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={
                    handleCloseEditModal
                  }
                  disabled={
                    updateCustomer.isPending
                  }
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    updateCustomer.isPending
                  }
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {updateCustomer.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};