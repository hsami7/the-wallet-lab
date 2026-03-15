"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const statusColors: Record<string, string> = {
  active:      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  low_stock:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  out_of_stock:"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  draft:       "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export function ProductsClient({ initialProducts }: { initialProducts: Record<string, any>[] }) {
  const supabase = createClient();
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filters = ["All", "In Stock", "Low Stock", "Out of Stock", "Draft"];

  const filtered = products.filter((p) => {
    const isLowStock = p.status === "active" && p.inventory_count > 0 && p.inventory_count <= 10;

    let matchFilter = true;
    if (filter === "In Stock")     matchFilter = p.status === "active" && p.inventory_count > 10;
    else if (filter === "Low Stock")    matchFilter = isLowStock;
    else if (filter === "Out of Stock") matchFilter = p.status === "out_of_stock" || (p.status === "active" && p.inventory_count === 0);
    else if (filter === "Draft")        matchFilter = p.status === "draft";

    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));

    return matchFilter && matchSearch;
  });

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product.");
    }
  }

  function getDisplayStatus(status: string, stock: number) {
    if (status === "active" && stock > 0 && stock <= 10) return { label: "Low Stock",    color: statusColors["low_stock"] };
    if (status === "active")    return { label: "In Stock",    color: statusColors["active"] };
    if (status === "out_of_stock") return { label: "Out of Stock", color: statusColors["out_of_stock"] };
    if (status === "draft")     return { label: "Draft",       color: statusColors["draft"] };
    return { label: status, color: statusColors["draft"] };
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage your aesthetic collection and inventory.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add New Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Products", value: products.length.toString(),                                                                                                          icon: "inventory_2" },
          { label: "Active",         value: products.filter((p) => p.status === "active" && p.inventory_count > 10).length.toString(),                                           icon: "check_circle" },
          { label: "Low Stock",      value: products.filter((p) => p.status === "active" && p.inventory_count > 0 && p.inventory_count <= 10).length.toString(),                 icon: "warning" },
          { label: "Out of Stock",   value: products.filter((p) => p.status === "out_of_stock" || (p.status === "active" && p.inventory_count === 0)).length.toString(),         icon: "error" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-xl">{s.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        {/* Filters + Search */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === s
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 gap-2 border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none w-40 md:w-52"
              placeholder="Search products..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {["SKU", "Product Information", "Category", "Price", "Inventory", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => {
                const displayStatus = getDisplayStatus(product.status, product.inventory_count);
                const mainImage = product.colors?.[0]?.imageUrl || product.image_url;

                return (
                  <tr
                    key={product.id}
                    className={`${i < filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}
                  >
                    <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400 text-xs">
                      {product.sku || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                          {mainImage ? (
                            <img src={mainImage} className="w-full h-full object-cover" alt={product.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-slate-400 text-[18px]">image</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors"
                          >
                            {product.name}
                          </Link>
                          {product.colors && product.colors.length > 0 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">{product.colors.length} variants</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{product.category || "—"}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {product.price.toFixed(2)} MAD
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {product.inventory_count} in stock
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${displayStatus.color}`}>
                        {displayStatus.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-slate-400 hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Showing {filtered.length} of {products.length} products</span>
        </div>
      </div>
    </div>
  );
}
