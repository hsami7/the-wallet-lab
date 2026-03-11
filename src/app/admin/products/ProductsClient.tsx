"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

type ProductColor = {
  name: string;
  hex1: string;
  hex2?: string;
};

const emptyForm = {
  name: "", sku: "", category: "Premium Carry", price: "", deliveryPrice: "0",
  stock: "", description: "", material: "", dimensions: "", weight: "",
  status: "active", featured: false, image_url: "", colors: [] as ProductColor[],
};

const stockColors: Record<string, string> = {
  "active": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "low_stock": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "out_of_stock": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "draft": "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
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

export function ProductsClient({ initialProducts }: { initialProducts: Record<string, any>[] }) {
  const supabase = createClient();
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Custom Color Picker State
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex1, setNewColorHex1] = useState("#000000");
  const [newColorHex2, setNewColorHex2] = useState("#ffffff");
  const [isDualColor, setIsDualColor] = useState(false);

  const filtered = products.filter((p) => {
    // Map UI filters to DB status
    const statusMap: Record<string, string> = {
      "In Stock": "active",
      "Low Stock": "low_stock",
      "Out of Stock": "out_of_stock",
      "Draft": "draft"
    };

    const mappedFilter = statusMap[filter] || filter;

    // For "Low Stock", we need to check if count < 10 and status is active or low_stock
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

  function openAdd() {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(p: Record<string, any>) {
    setForm({
      name: p.name,
      sku: p.sku || "",
      category: p.category || "Premium Carry",
      price: String(p.price),
      deliveryPrice: "0",
      stock: String(p.inventory_count),
      description: p.description || "",
      material: "",
      dimensions: "",
      weight: "",
      status: p.status,
      featured: false,
      image_url: p.image_url || "",
      colors: Array.isArray(p.colors) ? p.colors.map((c: any) => typeof c === 'string' ? { name: c, hex1: '#000000' } : c) : [],
    });
    setEditId(p.id);
    setShowModal(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setUploadingImage(true);
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setForm((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function saveProduct() {
    if (!form.name || !form.price) return;
    setIsLoading(true);

    const inventoryCount = Number(form.stock);
    let status = form.status;

    // Auto-update status if it was active but stock is 0
    if (status === 'active' && inventoryCount === 0) {
      status = 'out_of_stock';
    } else if (status === 'out_of_stock' && inventoryCount > 0) {
      status = 'active';
    }

    const productData = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      inventory_count: inventoryCount,
      status: status,
      category: form.category,
      sku: form.sku || null,
      image_url: form.image_url || null,
      colors: form.colors,
    };

    try {
      if (editId) {
        // Update existing
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editId)
          .select()
          .single();

        if (error) throw error;
        setProducts(prev => prev.map(p => p.id === editId ? data : p));
      } else {
        // Create new
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();

        if (error) throw error;
        setProducts(prev => [data, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save product:", err);
      alert("Failed to save product.");
    } finally {
      setIsLoading(false);
    }
  }

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

  // Helper to format status for display
  function getDisplayStatus(status: string, stock: number) {
    if (status === 'active' && stock > 0 && stock <= 10) return { label: 'Low Stock', color: stockColors['low_stock'] };
    if (status === 'active') return { label: 'In Stock', color: stockColors['active'] };
    if (status === 'out_of_stock') return { label: 'Out of Stock', color: stockColors['out_of_stock'] };
    if (status === 'draft') return { label: 'Draft', color: stockColors['draft'] };
    return { label: status, color: stockColors['draft'] };
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {products.length} total products
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
          { label: "Active", value: products.filter((p) => p.status === "active" && p.inventory_count > 10).length, color: "text-green-600 dark:text-green-400" },
          { label: "Low Stock", value: products.filter((p) => p.status === "active" && p.inventory_count > 0 && p.inventory_count <= 10).length, color: "text-yellow-600 dark:text-yellow-400" },
          { label: "Out of Stock", value: products.filter((p) => p.status === "out_of_stock" || (p.status === "active" && p.inventory_count === 0)).length, color: "text-red-600 dark:text-red-400" },
          { label: "Total KUs", value: products.length, color: "text-primary" },
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
            {["All", "In Stock", "Low Stock", "Out of Stock", "Draft"].map((s) => (
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
                {["SKU", "Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => {
                const displayStatus = getDisplayStatus(product.status, product.inventory_count);

                return (
                  <tr key={product.id} className={`${i < filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{product.sku || '—'}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{product.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{product.category || '—'}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{product.price.toFixed(2)} MAD</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{product.inventory_count} units</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${displayStatus.color}`}>{displayStatus.label}</span>
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
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">No products found.</td></tr>
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
                    <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="e.g. Premium Carry" className={inputCls} />
                  </Field>
                  <Field label="Status">
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </Field>
                  <Field label="Product Image">
                    <div className="flex items-center gap-4">
                      {form.image_url && (
                        <div
                          className="size-16 rounded-lg bg-slate-100 dark:bg-slate-800 bg-cover bg-center border border-slate-200 dark:border-slate-700 shrink-0"
                          style={{ backgroundImage: `url(${form.image_url})` }}
                        />
                      )}
                      <div className="flex-1 relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-dashed transition-colors
                          ${uploadingImage ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400' : 'bg-primary/5 border-primary/20 text-primary hover:bg-primary/10'}`}>
                          {uploadingImage ? (
                            <>
                              <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                              <span className="text-sm font-medium">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-sm">upload</span>
                              <span className="text-sm font-medium">Choose from Device</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Field>
                  <Field label="Product Colors">
                    <div className="space-y-4">
                      {/* Selected Colors Preview */}
                      {form.colors.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl relative mt-2 pt-4">
                          <span className="absolute -top-2.5 left-3 bg-white dark:bg-slate-900 px-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Added Colors</span>
                          {form.colors.map((c, idx) => (
                            <div key={idx} className="group relative flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full py-1.5 pl-2 pr-3 shadow-sm">
                              <div
                                className="size-4 rounded-full shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                style={c.hex2 ? { background: `linear-gradient(135deg, ${c.hex1} 50%, ${c.hex2} 50%)` } : { backgroundColor: c.hex1 }}
                              />
                              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mr-2">{c.name}</span>
                              <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== idx) }))}
                                className="absolute -top-1 -right-1 size-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-sm cursor-pointer hover:bg-red-600"
                              >
                                <span className="material-symbols-outlined text-[10px] font-bold">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add New Color UI */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 transition-colors focus-within:border-primary/30 focus-within:bg-primary/5">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Add Color Variation</p>
                          <label className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider cursor-pointer hover:text-primary transition-colors">
                            <input type="checkbox" checked={isDualColor} onChange={(e) => setIsDualColor(e.target.checked)} className="accent-primary size-3.5 cursor-pointer" />
                            Two-tone Mix
                          </label>
                        </div>

                        <div className="flex items-start gap-4">
                          {/* Live Preview Circle */}
                          <div
                            className="size-11 rounded-full shadow-sm shrink-0 ring-4 ring-white dark:ring-slate-900 border border-slate-100 dark:border-slate-800 transition-all duration-300"
                            style={isDualColor ? { background: `linear-gradient(135deg, ${newColorHex1} 50%, ${newColorHex2} 50%)` } : { backgroundColor: newColorHex1 }}
                            title="Preview"
                          />

                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              {/* Color Pickers */}
                              <div className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 cursor-pointer hover:border-primary transition-colors">
                                <input type="color" value={newColorHex1} onChange={(e) => setNewColorHex1(e.target.value)} className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer z-10" />
                                <div className="size-8 transition-colors" style={{ backgroundColor: newColorHex1 }} title="Base Color"></div>
                              </div>

                              {isDualColor && (
                                <div className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 cursor-pointer hover:border-primary transition-all animate-in fade-in zoom-in duration-200">
                                  <input type="color" value={newColorHex2} onChange={(e) => setNewColorHex2(e.target.value)} className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer z-10" />
                                  <div className="size-8 transition-colors" style={{ backgroundColor: newColorHex2 }} title="Secondary Color"></div>
                                </div>
                              )}

                              {/* Name Input */}
                              <input
                                value={newColorName}
                                onChange={(e) => setNewColorName(e.target.value)}
                                placeholder="Color name (e.g. Midnight Black)"
                                className="flex-1 px-3 py-1.5 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all placeholder:text-slate-400"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (!newColorName.trim()) return;
                                setForm(prev => ({
                                  ...prev,
                                  colors: [...prev.colors, { name: newColorName, hex1: newColorHex1, hex2: isDualColor ? newColorHex2 : undefined }]
                                }));
                                setNewColorName("");
                              }}
                              disabled={!newColorName.trim()}
                              className="w-full h-8 flex items-center justify-center gap-2 bg-primary dark:bg-primary/90 text-white rounded-lg text-xs font-bold transition-all hover:bg-primary/80 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                              <span className="material-symbols-outlined text-[14px]">add_circle</span>
                              Add to Product
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Sale Price (MAD) *">
                    <div className="relative">
                      <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
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
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900">
              <button
                onClick={() => setShowModal(false)}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button
                onClick={saveProduct}
                disabled={isLoading || uploadingImage}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                <span className="material-symbols-outlined text-lg">save</span>
                {isLoading ? "Saving..." : editId ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
