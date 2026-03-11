"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface ProductVariant {
  name: string;
  hex: string;
  imageUrl?: string;
}

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [category, setCategory] = useState(initialData?.category || "Cardholders");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [stock, setStock] = useState(initialData?.inventory_count || 0);
  const [minStock, setMinStock] = useState(initialData?.min_stock_level || 10);
  const [trackInventory, setTrackInventory] = useState(initialData?.track_inventory !== false);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialData?.colors && Array.isArray(initialData.colors) 
      ? initialData.colors.map((c: any) => typeof c === 'string' ? { name: c, hex: '#000000' } : c)
      : []
  );

  // Sync state if initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setPrice(initialData.price || "");
      setCategory(initialData.category || "Cardholders");
      setSku(initialData.sku || "");
      setStock(initialData.inventory_count || 0);
      setMinStock(initialData.min_stock_level || 10);
      setTrackInventory(initialData.track_inventory !== false);
      setTags(initialData.tags || []);
      setFeatured(initialData.featured || false);
      setVariants(
        initialData.colors && Array.isArray(initialData.colors)
          ? initialData.colors.map((c: any) => typeof c === 'string' ? { name: c, hex: '#000000' } : c)
          : []
      );
    }
  }, [initialData]);

  const handleAddVariant = () => {
    setVariants([...variants, { name: "New Variant", hex: "#0d59f2" }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-variants/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      handleVariantChange(index, 'imageUrl', publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (status: string = 'active') => {
    if (!name || !price) {
      alert("Please fill in Name and Price.");
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        name,
        description,
        price: Number(price),
        inventory_count: Number(stock),
        min_stock_level: Number(minStock),
        track_inventory: trackInventory,
        category,
        sku,
        tags,
        featured,
        status,
        colors: variants,
        // For backwards compatibility or simplified preview
        image_url: variants[0]?.imageUrl || null,
        updated_at: new Date().toISOString()
      };

      if (isEditing && initialData?.id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
            <Link href="/admin/products" className="hover:text-primary transition-colors">Products</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary">{isEditing ? "Edit Product" : "Add New"}</span>
          </nav>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {isEditing ? `Refining details for ${name}` : "Create a new item for the premium collection"}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => handleSave('draft')}
            disabled={isLoading}
            className="flex-1 md:flex-none px-6 py-3 rounded-2xl border-2 border-slate-200 dark:border-white/10 font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-slate-300"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSave('active')}
            disabled={isLoading}
            className="flex-1 md:flex-none px-8 py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-xl shadow-primary/30 hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="animate-spin border-2 border-white/30 border-t-white rounded-full size-4"></span>
            ) : (
              <span className="material-symbols-outlined text-lg">publish</span>
            )}
            {isEditing ? "Save Changes" : "Publish Product"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Basic Information */}
          <section className="bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
              <span className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">info</span>
              </span>
              Basic Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Product Title</label>
                <input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101622] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 focus:ring-0 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-sm font-semibold" 
                  placeholder="e.g. The Nebula Cardholder" 
                  type="text" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101622] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 focus:ring-0 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-sm font-medium resize-none" 
                  placeholder="Describe the aesthetic, materials, and vibe..." 
                  rows={5}
                ></textarea>
              </div>
            </div>
          </section>

          {/* Color Variants */}
          <section className="bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <span className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">palette</span>
                </span>
                Color Variants
              </h3>
              <button 
                onClick={handleAddVariant}
                type="button"
                className="text-xs font-bold text-primary flex items-center gap-1.5 hover:opacity-80 uppercase tracking-widest transition-opacity"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span> 
                Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, idx) => (
                <div key={idx} className="p-6 bg-slate-50/50 dark:bg-[#101622]/50 rounded-2xl border border-slate-100 dark:border-white/5 grid grid-cols-1 md:grid-cols-12 gap-6 relative group transition-colors hover:border-slate-200 dark:hover:border-white/10">
                  <button 
                    onClick={() => handleRemoveVariant(idx)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg font-bold">cancel</span>
                  </button>
                  
                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Variant Name</label>
                    <input 
                      value={variant.name}
                      onChange={(e) => handleVariantChange(idx, 'name', e.target.value)}
                      className="w-full bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm" 
                      type="text" 
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Hex Code</label>
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0">
                        <input 
                          type="color" 
                          value={variant.hex}
                          onChange={(e) => handleVariantChange(idx, 'hex', e.target.value)}
                          className="absolute inset-0 size-full opacity-0 cursor-pointer z-10" 
                        />
                        <div 
                          className="size-full rounded-lg border-2 border-white dark:border-slate-800 shadow-sm transition-transform group-hover:scale-105" 
                          style={{ backgroundColor: variant.hex }}
                        ></div>
                      </div>
                      <input 
                        value={variant.hex}
                        onChange={(e) => handleVariantChange(idx, 'hex', e.target.value)}
                        className="w-full bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm font-mono" 
                        type="text" 
                      />
                    </div>
                  </div>

                  <div className="md:col-span-5">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Media Upload</label>
                    <div className="flex gap-3">
                      {variant.imageUrl ? (
                        <div className="size-10 rounded-xl bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/10 overflow-hidden relative group/thumb shadow-sm">
                          <img src={variant.imageUrl} className="w-full h-full object-cover" alt={variant.name} />
                          <label className="absolute inset-0 bg-primary/60 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer">
                            <span className="material-symbols-outlined text-white text-sm">edit</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(idx, e)} />
                          </label>
                        </div>
                      ) : (
                        <label className="size-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-primary/5 hover:border-primary transition-all shadow-sm">
                          <span className="material-symbols-outlined text-lg">image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(idx, e)} />
                        </label>
                      )}
                      
                      <label className="flex-1 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group/add">
                        <span className="material-symbols-outlined text-slate-400 text-lg group-hover/add:text-primary transition-colors">upload</span>
                        <span className="text-[10px] font-bold text-slate-400 group-hover/add:text-primary transition-colors uppercase tracking-widest">
                          {isUploading ? "Uploading..." : "Upload Photo"}
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(idx, e)} />
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              {variants.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-3xl text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-4 opacity-20">palette</span>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-40">No variants added yet</p>
                  <button onClick={handleAddVariant} className="mt-4 text-primary font-bold text-xs uppercase tracking-widest hover:underline">Add first variant</button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Pricing & Category */}
          <section className="bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Pricing & Sales</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Price (MAD)</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">#</span>
                  <input 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#101622] border-2 border-slate-100 dark:border-white/5 rounded-2xl pl-10 pr-6 py-3.5 outline-none focus:border-primary text-sm font-bold transition-all" 
                    type="number" 
                    placeholder="0.00" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Category</label>
                <div className="relative">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#101622] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:border-primary appearance-none text-sm font-bold cursor-pointer"
                  >
                    <option>Cardholders</option>
                    <option>Bifolds</option>
                    <option>Phone Wallets</option>
                    <option>Limited Edition</option>
                    <option>Premium Carry</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>
          </section>

          {/* Inventory Management */}
          <section className="bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Inventory</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">SKU Base</label>
                <input 
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#101622] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:border-primary text-sm font-bold uppercase" 
                  placeholder="WLT-NEB-24" 
                  type="text" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Stock Qty</label>
                  <input 
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-[#101622] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:border-primary text-sm font-bold" 
                    type="number" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Min Alert</label>
                  <input 
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-[#101622] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:border-primary text-sm font-bold text-red-500" 
                    type="number" 
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-5 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Track Inventory</span>
                <button 
                  onClick={() => setTrackInventory(!trackInventory)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${trackInventory ? 'bg-primary' : 'bg-slate-300 dark:bg-white/10'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${trackInventory ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Tags & Meta */}
          <section className="bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Product Meta</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Tags</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-xl text-[11px] font-bold flex items-center gap-2 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                      {tag}
                      <span onClick={() => handleRemoveTag(tag)} className="material-symbols-outlined text-[16px] cursor-pointer hover:text-red-500 transition-colors font-bold">close</span>
                    </span>
                  ))}
                </div>
                <input 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full bg-slate-50 dark:bg-[#101622] border-2 border-slate-100 dark:border-white/5 rounded-2xl px-5 py-3.5 outline-none focus:border-primary text-sm font-semibold" 
                  placeholder="Press Enter to add tag..." 
                  type="text" 
                />
              </div>
              
              <div 
                className="flex items-center gap-4 py-4 px-5 rounded-2xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer group"
                onClick={() => setFeatured(!featured)}
              >
                <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${featured ? 'bg-primary border-primary' : 'border-slate-300 dark:border-white/10'}`}>
                  {featured && <span className="material-symbols-outlined text-[18px] text-white font-bold">check</span>}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">Feature on Homepage</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Visible in hero collection</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
