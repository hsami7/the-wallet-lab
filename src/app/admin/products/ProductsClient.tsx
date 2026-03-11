"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const stockColors: Record<string, string> = {
  "active": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "low_stock": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "out_of_stock": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "draft": "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
};

export function ProductsClient({ initialProducts }: { initialProducts: Record<string, any>[] }) {
  const supabase = createClient();
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const statusMap: Record<string, string> = {
      "In Stock": "active",
      "Low Stock": "low_stock",
      "Out of Stock": "out_of_stock",
      "Draft": "draft"
    };

    const mappedFilter = statusMap[filter] || filter;
    const isLowStockFilter = filter === "Low Stock";
    const matchesLowStock = p.inventory_count > 0 && p.inventory_count <= 10;

    let matchFilter = true;
    if (filter !== "All") {
      if (isLowStockFilter) {
        matchFilter = matchesLowStock;
      } else {
        matchFilter = p.status === mappedFilter;
      }
    }

    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product.");
    }
  }

  function getDisplayStatus(status: string, stock: number) {
    if (status === 'active' && stock > 0 && stock <= 10) return { label: 'Low Stock', color: stockColors['low_stock'] };
    if (status === 'active') return { label: 'In Stock', color: stockColors['active'] };
    if (status === 'out_of_stock') return { label: 'Out of Stock', color: stockColors['out_of_stock'] };
    if (status === 'draft') return { label: 'Draft', color: stockColors['draft'] };
    return { label: status, color: stockColors['draft'] };
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-display">Products</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Manage your aesthetic collection and inventory ({products.length} items)
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add New Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Active", value: products.filter((p) => p.status === "active" && p.inventory_count > 10).length, color: "text-green-600 dark:text-green-400" },
          { label: "Low Stock", value: products.filter((p) => p.status === "active" && p.inventory_count > 0 && p.inventory_count <= 10).length, color: "text-yellow-600 dark:text-yellow-400" },
          { label: "Out of Stock", value: products.filter((p) => p.status === "out_of_stock" || (p.status === "active" && p.inventory_count === 0)).length, color: "text-red-600 dark:text-red-400" },
          { label: "Total SKUs", value: products.length, color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-[#1a2234] rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm">
            <p className={`text-4xl font-bold font-display ${s.color}`}>{s.value}</p>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1a2234] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-200 dark:border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {["All", "In Stock", "Low Stock", "Out of Stock", "Draft"].map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === s ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-slate-50 dark:bg-[#101622] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-slate-50 dark:bg-[#101622] rounded-2xl px-4 py-3 gap-3 border border-slate-100 dark:border-white/5 group focus-within:border-primary/30 transition-all">
            <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none w-full lg:w-64 font-medium"
              placeholder="Search by name or SKU…" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-[#101622]/30 border-b border-slate-200 dark:border-white/5">
                {["SKU", "Product Information", "Category", "Price", "Inventory", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-8 py-4 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map((product) => {
                const displayStatus = getDisplayStatus(product.status, product.inventory_count);
                const mainImage = product.colors?.[0]?.imageUrl || product.image_url;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5 font-mono text-[11px] font-bold text-slate-400">{product.sku || '—'}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-slate-100 dark:bg-[#101622] overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 shadow-sm">
                          {mainImage ? (
                            <img src={mainImage} className="w-full h-full object-cover" alt={product.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <span className="material-symbols-outlined text-xl">image</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{product.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold text-slate-600 dark:text-slate-400">{product.category || '—'}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">{product.price.toFixed(2)} MAD</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{product.inventory_count} items</span>
                        <div className="w-20 h-1 bg-slate-100 dark:bg-white/5 rounded-full mt-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${product.inventory_count <= 10 ? 'bg-yellow-500' : 'bg-primary'}`} 
                            style={{ width: `${Math.min(product.inventory_count, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${displayStatus.color}`}>{displayStatus.label}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/products/${product.id}/edit`} 
                          className="size-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </Link>
                        <button 
                          onClick={() => deleteProduct(product.id)} 
                          className="size-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all shadow-sm"
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
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-4xl text-slate-200 dark:text-white/5 mb-4">inventory_2</span>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">No products found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
