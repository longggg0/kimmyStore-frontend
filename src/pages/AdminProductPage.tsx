import React, { useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { Search, Trash } from "lucide-react";
import { AddProductDialog } from "../components/AddProductDialog";
// import { DeleteProductDialog } from "../components/DeleteProductDialog";
import { EditProductDialog } from "../components/EditProductDialog";

type Product = {
  id: number;
  name: string;
  price: string;
  qty: number;
  description: string;
  category: { name: string } | null;
  images: { imageUrl: string }[];
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 14",
    price: "1999.99",
    qty: 15,
    description: "Apple M3 Pro chip, 18GB RAM, 512GB SSD",
    category: { name: "Laptops" },
    images: [{ imageUrl: "https://placehold.co/48x48" }],
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    price: "999.99",
    qty: 0,
    description: "6.1-inch display, 48MP camera, titanium design",
    category: { name: "Phones" },
    images: [{ imageUrl: "https://placehold.co/48x48" }],
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    price: "349.99",
    qty: 42,
    description: "Industry-leading noise cancellation headphones",
    category: { name: "Audio" },
    images: [],
  },
];

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");

  const handleAdd = (newProduct: Omit<Product, "id">) => {
    const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    setProducts((prev) => [...prev, { id: nextId, ...newProduct }]);
  };

  const handleUpdate = (id: number, updated: Omit<Product, "id">) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { id, ...updated } : p)));
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-1">Product Management</h1>
            <p className="text-sm font-normal text-gray-400">Manage your product inventory</p>
          </div>
          <AddProductDialog onAdd={handleAdd} />
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
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
                  {["ID", "Image", "Name", "Category", "Price", "Stock", "Description", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-normal text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-sm font-normal text-gray-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filtered.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        index !== filtered.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-normal text-gray-400">{product.id}</td>

                      <td className="px-6 py-4">
                        <img
                          src={product.images.length > 0 ? product.images[0].imageUrl : "https://placehold.co/48x48"}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                        />
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{product.name}</td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-normal rounded-lg">
                          {product.category?.name || "N/A"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        ${Number(product.price).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-normal rounded-lg ${
                          product.qty > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                        }`}>
                          {product.qty > 0 ? `${product.qty} units` : "Out of stock"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-normal text-gray-500 max-w-48 truncate">
                        {product.description}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <EditProductDialog product={product} onUpdate={handleUpdate} />
                          <button disabled className="p-2 rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed">
                            <Trash className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
