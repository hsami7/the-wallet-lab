"use client";

import { useState } from "react";

const initialProducts = [
  { id: "P-001", name: "Carbon Series Pro", category: "Carbon Fiber", price: 850, deliveryPrice: 30, stock: 34, status: "In Stock", sku: "CSP-001" },
  { id: "P-002", name: "Classic Cognac", category: "Leather", price: 650, deliveryPrice: 25, stock: 21, status: "In Stock", sku: "CC-002" },
  { id: "P-003", name: "Titanium Minimalist", category: "Metal", price: 1200, deliveryPrice: 40, stock: 7, status: "Low Stock", sku: "TM-003" },
  { id: "P-004", name: "Stealth Black Edition", category: "Carbon Fiber", price: 950, deliveryPrice: 30, stock: 0, status: "Out of Stock", sku: "SBE-004" },
  { id: "P-005", name: "The Nomad Slim", category: "Leather", price: 720, deliveryPrice: 25, stock: 15, status: "In Stock", sku: "NS-005" },
  { id: "P-006", name: "Executive Bifold", category: "Leather", price: 580, deliveryPrice: 25, stock: 28, status: "In Stock", sku: "EB-006" },
  { id: "P-007", name: "Aerospace Cardholder", category: "Metal", price: 480, deliveryPrice: 20, stock: 3, status: "Low Stock", sku: "AC-007" },
  { id: "P-008", name: "Phantom Carbon", category: "Carbon Fiber", price: 1100, deliveryPrice: 35, stock: 0, status: "Out of Stock", sku: "PC-008" },
];

const emptyForm = {
  name: "", sku: "", category: "Leather", price: "", deliveryPrice: "",
  stock: "", description: "", material: "", dimensions: "", weight: "",
  status: "In Stock", featured: false,
};

const stockColors: Record<string, string> = {
  "In Stock":     "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Low Stock":    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Out of Stock": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

type ProductForm = typeof emptyForm;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const matchFilter = filter === "All" || p.status === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  function openAdd() {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(p: typeof initialProducts[0]) {
    setForm({
      name: p.name, sku: p.sku, category: p.category,
      price: String(p.price), deliveryPrice: String(p.deliveryPrice),
      stock: String(p.stock), description: "", material: "", dimensions: "", weight: "",
      status: p.status, featured: false,
    });
    setEditId(p.id);
    setShowModal(true);
  }

  function saveProduct() {
    if (!form.name || !form.price) return;
    const statusByStock = Number(form.stock) === 0 ? "Out of Stock" : Number(form.stock) <= 5 ? "Low Stock" : "In Stock";
    if (editId) {
      setProducts((prev) => prev.map((p) => p.id === editId ? {
        ...p, name: form.name, sku: form.sku, category: form.category,
        price: Number(form.price), deliveryPrice: Number(form.deliveryPrice),
        stock: Number(form.stock), status: statusByStock,
      } : p));
    } else {
      const newId = `P-${String(products.length + 1).padStart(3, "0")}`;
      setProducts((prev) => [...prev, {
        id: newId, name: form.name, sku: form.sku, category: form.category,
        price: Number(form.price), deliveryPrice: Number(form.deliveryPrice),
        stock: Number(form.stock), status: statusByStock,
      }]);
    }
    setShowModal(false);
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {products.length} products across 3 categories
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "In Stock",     value: products.filter((p) => p.status === "In Stock").length,     color: "text-green-600 dark:text-green-400" },
          { label: "Low Stock",    value: products.filter((p) => p.status === "Low Stock").length,    color: "text-yellow-600 dark:text-yellow-400" },
          { label: "Out of Stock", value: products.filter((p) => p.status === "Out of Stock").length, color: "text-red-600 dark:text-red-400" },
          { label: "Total SKUs",   value: products.length,                                             color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["All", "In Stock", "Low Stock", "Out of Stock"].map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === s ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 gap-2 border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none w-44"
              placeholder="Search name or SKU…" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                {["SKU", "Product", "Category", "Price", "Delivery", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr key={product.id} className={`${i < filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{product.sku}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{product.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{product.category}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{product.price} MAD</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{product.deliveryPrice} MAD</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{product.stock} units</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${stockColors[product.status]}`}>{product.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(product)} className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Product Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          {/* Panel */}
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editId ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form */}
            <div className="p-6 flex flex-col gap-5">
              {/* Basic info */}
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Basic Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Product Name *">
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Carbon Series Pro" className={inputCls} />
                  </Field>
                  <Field label="SKU">
                    <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      placeholder="e.g. CSP-009" className={inputCls} />
                  </Field>
                  <Field label="Category">
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                      {["Leather", "Carbon Fiber", "Metal", "Fabric", "Other"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Status">
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                      {["In Stock", "Low Stock", "Out of Stock"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Description">
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3} placeholder="Describe the product…"
                      className={`${inputCls} resize-none`} />
                  </Field>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Pricing & Inventory</p>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Sale Price (MAD) *">
                    <div className="relative">
                      <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="0" className={`${inputCls} pr-14`} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">MAD</span>
                    </div>
                  </Field>
                  <Field label="Delivery Price (MAD)">
                    <div className="relative">
                      <input type="number" value={form.deliveryPrice} onChange={(e) => setForm({ ...form, deliveryPrice: e.target.value })}
                        placeholder="0" className={`${inputCls} pr-14`} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">MAD</span>
                    </div>
                  </Field>
                  <Field label="Stock Quantity">
                    <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      placeholder="0" className={inputCls} />
                  </Field>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Specifications</p>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Material">
                    <input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}
                      placeholder="e.g. Full-grain leather" className={inputCls} />
                  </Field>
                  <Field label="Dimensions">
                    <input value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                      placeholder="e.g. 12 × 9 × 1.5 cm" className={inputCls} />
                  </Field>
                  <Field label="Weight">
                    <input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })}
                      placeholder="e.g. 45g" className={inputCls} />
                  </Field>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center gap-3 py-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="sr-only peer" />
                  <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-checked:bg-primary rounded-full peer transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Mark as Featured Product</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button onClick={saveProduct}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-lg">save</span>
                {editId ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
