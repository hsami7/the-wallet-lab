"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface ProductVariant {
  name: string;
  hex: string;
  secondaryHex?: string;
  imageUrl?: string;
}

interface Highlight {
  id?: string;
  title: string;
  description: string;
  icon_name: string;
  order_index: number;
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
  const [uploadingVariantIdx, setUploadingVariantIdx] = useState<number | null>(null);
  const [isUploadingPrimary, setIsUploadingPrimary] = useState(false);

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [stock, setStock] = useState(initialData?.inventory_count || 0);
  const [minStock, setMinStock] = useState(initialData?.min_stock_level || 10);
  const [trackInventory, setTrackInventory] = useState(initialData?.track_inventory !== false);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [primaryImage, setPrimaryImage] = useState(initialData?.image_url || "");
  const [secondaryImages, setSecondaryImages] = useState<string[]>(() => {
    const variantUrls = new Set(
      (initialData?.colors || []).map((c: any) => c?.imageUrl).filter(Boolean)
    );
    return (initialData?.images || []).filter((url: string) => !variantUrls.has(url));
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialData?.colors && Array.isArray(initialData.colors)
      ? initialData.colors.map((c: any) => typeof c === 'string' ? { name: c, hex: '#000000' } : c)
      : []
  );
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  const [showColors, setShowColors] = useState(() => {
    if (!initialData) return true;
    return (initialData.colors && initialData.colors.length > 0) ?? true;
  });

  // Fetch Highlights
  useEffect(() => {
    if (isEditing && initialData?.id) {
      async function fetchHighlights() {
        const { data, error } = await supabase
          .from('product_highlights')
          .select('*')
          .eq('product_id', initialData.id)
          .order('order_index', { ascending: true });

        if (!error && data) {
          setHighlights(data);
        }
      }
      fetchHighlights();
    }
  }, [isEditing, initialData?.id, supabase]);

  // Sync state if initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setPrice(initialData.price || "");
      setCategory(initialData.category || "");
      setSku(initialData.sku || "");
      setStock(initialData.inventory_count || 0);
      setMinStock(initialData.min_stock_level || 10);
      setTrackInventory(initialData.track_inventory !== false);
      setTags(initialData.tags || []);
      setFeatured(initialData.featured || false);
      setPrimaryImage(initialData.image_url || "");
      const loadedVariants = initialData.colors && Array.isArray(initialData.colors)
        ? initialData.colors.map((c: any) => typeof c === 'string' ? { name: c, hex: '#000000' } : c)
        : [];
      setVariants(loadedVariants);
      setShowColors(loadedVariants.length > 0);
      // Filter out variant photos so Additional Photos only shows truly extra images
      const variantUrls = new Set(loadedVariants.map((v: ProductVariant) => v.imageUrl).filter(Boolean));
      setSecondaryImages((initialData.images || []).filter((url: string) => !variantUrls.has(url)));
    }
  }, [initialData]);

  // Fetch Categories
  useEffect(() => {
    async function fetchCats() {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (!error && data) setCategories(data);
    }
    fetchCats();
  }, [supabase]);

  const hasVariants = showColors && variants.length > 0;

  // When variants exist, derive primary image from first variant with a photo
  const effectivePrimaryImage = hasVariants
    ? (variants.find(v => v.imageUrl)?.imageUrl || "")
    : primaryImage;

  const handleAddVariant = () => {
    setVariants([...variants, { name: "New Color", hex: "#0d59f2", secondaryHex: "#000000" }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  // Auto-generate SKU from name and category (live for new products)
  useEffect(() => {
    if (!isEditing && (name || category)) {
      const cleanCat = category.toUpperCase().replace(/[^A-Z0-9]+/g, '').substring(0, 3);
      const nameParts = name.trim().toUpperCase().split(/\s+/).filter(Boolean);

      let nameCode = "";
      if (nameParts.length === 1) {
        const word = nameParts[0];
        if (word.length >= 3) {
          nameCode = word[0] + word[Math.floor(word.length / 2)] + word[word.length - 1];
        } else {
          nameCode = word.padEnd(3, 'X');
        }
      } else if (nameParts.length >= 2) {
        const firstWord = nameParts[0];
        const lastWord = nameParts[nameParts.length - 1];
        const midWord = nameParts[Math.floor(nameParts.length / 2)];

        if (nameParts.length === 2) {
          // "Laptop Gaming" -> L (start) + G (mid/start) + G (last)
          nameCode = firstWord[0] + lastWord[0] + lastWord[lastWord.length - 1];
        } else {
          // "Pro Laptop Gaming" -> P + L + G
          nameCode = firstWord[0] + midWord[0] + lastWord[lastWord.length - 1];
        }
      }

      const prefix = `${cleanCat}-${nameCode || 'XXX'}`;

      setSku((prev: string) => {
        if (!prev || !prev.startsWith(prefix)) {
          const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
          return `${prefix}-${suffix}`;
        }
        return prev;
      });
    }
  }, [name, category, isEditing]);

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

  const handleAddHighlight = () => {
    setHighlights([...highlights, { title: "", description: "", icon_name: "verified", order_index: highlights.length }]);
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleHighlightChange = (index: number, field: keyof Highlight, value: any) => {
    const newHighlights = [...highlights];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    setHighlights(newHighlights);
  };

  const handlePrimaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // reset so same file can be re-selected
    setIsUploadingPrimary(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `primary-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setPrimaryImage(publicUrl);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Failed to upload primary image.");
    } finally {
      setIsUploadingPrimary(false);
    }
  };

  const handleVariantImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // reset so same file can be re-selected
    setUploadingVariantIdx(index);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `variant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `product-variants/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
      handleVariantChange(index, 'imageUrl', publicUrl);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Failed to upload image.");
    } finally {
      setUploadingVariantIdx(null);
    }
  };

  const handleSecondaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    // Snapshot into a real array BEFORE resetting the input — FileList is a live reference
    const files = Array.from(e.target.files);
    e.target.value = ""; // reset so same file can be re-selected
    setIsUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `secondary-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `products/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);
        return publicUrl;
      });
      const urls = await Promise.all(uploadPromises);
      setSecondaryImages([...secondaryImages, ...urls]);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Failed to upload secondary images.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveSecondary = (urlToRemove: string) => {
    setSecondaryImages(secondaryImages.filter(url => url !== urlToRemove));
  };

  const handleSave = async (status: string = 'active') => {
    // Enhanced Validation
    if (status === 'active') {
      const missing = [];
      if (!name.trim()) missing.push("Product Title");
      if (!price || Number(price) < 1) missing.push("Valid Price (Minimum 1 MAD)");
      if (!category) missing.push("Category");

      // For stock, we allow 0 but it must be a valid number entry
      if (stock === "" || stock === undefined || stock === null) missing.push("Stock Quantity");

      if (missing.length > 0) {
        setError(`Required for publishing: ${missing.join(", ")}`);
        // Scroll to top to see the error
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    } else {
      // For drafts, we only strictly require the name so it can be identified in the list
      if (!name.trim()) {
        setError("Please enter at least a Product Title to save this draft.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setIsLoading(true);
    try {
      setError(null);
      const productData = {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
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
        colors: showColors ? variants : [],
        // If variants exist, derive primary image from first variant with an image;
        // otherwise use the manually uploaded primary image.
        image_url: hasVariants
          ? (variants.find(v => v.imageUrl)?.imageUrl || primaryImage || null)
          : (primaryImage || null),
        // If variants exist, gallery = all variant images + any extra secondaryImages;
        // otherwise use the manually curated secondary list.
        images: hasVariants
          ? [
            ...variants.filter(v => v.imageUrl).map(v => v.imageUrl as string),
            ...secondaryImages,
          ]
          : secondaryImages,
        updated_at: new Date().toISOString()
      };

      let productId = initialData?.id;

      if (isEditing && productId) {
        const { error } = await supabase.from('products').update(productData).eq('id', productId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('products').insert([productData]).select('id').single();
        if (error) throw error;
        productId = data.id;
      }

      // Save Highlights
      if (productId) {
        // Delete existing highlights first to ensure a clean sync
        await supabase.from('product_highlights').delete().eq('product_id', productId);

        if (highlights.length > 0) {
          const highlightsToInsert = highlights.map((h, index) => ({
            product_id: productId,
            title: h.title,
            description: h.description,
            icon_name: h.icon_name || 'verified',
            order_index: index
          }));

          const { error: hError } = await supabase.from('product_highlights').insert(highlightsToInsert);
          if (hError) throw hError;
        }
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save product. Please try again.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Premium Notification Overlay */}
      {error && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white/90 dark:bg-[#1a2234]/90 backdrop-blur-xl border border-red-200 dark:border-red-500/20 rounded-2xl p-4 shadow-2xl shadow-red-500/10 flex items-start gap-4">
            <div className="size-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <div className="flex-1 pt-1">
              <h4 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-1">Attention Required</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
      )}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
            <Link href="/admin/products" className="hover:text-primary transition-colors">Products</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary">{isEditing ? "Edit Product" : "Add New"}</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
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

          {/* Product Media — only shown when colors are disabled */}
          {!showColors && (
            <section className="bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-3">
                <span className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">image</span>
                </span>
                Product Photos
              </h3>
              <p className="text-xs text-slate-400 font-medium mb-8">
                Upload images for this product. These will form the main gallery.
              </p>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Primary Display Photo</label>
                {primaryImage ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-white/5 group bg-slate-50 dark:bg-black/20">
                    <img src={primaryImage} className="w-full h-full object-contain" alt="Primary Preview" loading="lazy" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <label className="size-12 rounded-full bg-white text-slate-900 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">edit</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handlePrimaryUpload} />
                      </label>
                      <button
                        onClick={(e) => { e.preventDefault(); setPrimaryImage(""); }}
                        className="size-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video rounded-2xl border-4 border-dashed border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="size-16 rounded-2xl bg-white dark:bg-white/10 shadow-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {isUploadingPrimary ? (
                        <span className="animate-spin border-4 border-primary/30 border-t-primary rounded-full size-8"></span>
                      ) : (
                        <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                      {isUploadingPrimary ? "Uploading..." : "Upload Primary Image"}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">PNG, JPG or WEBP up to 5MB</p>
                    <input type="file" className="hidden" accept="image/*" onChange={handlePrimaryUpload} />
                  </label>
                )}
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-100 dark:border-white/5 mt-8">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Additional Gallery Photos</label>
                <div className="flex flex-wrap gap-4">
                  {secondaryImages.map((url, idx) => (
                    <div key={idx} className="relative size-24 rounded-xl overflow-hidden border-2 border-slate-100 dark:border-white/5 group bg-slate-50 dark:bg-black/20 shrink-0">
                      <img src={url} className="w-full h-full object-cover" alt={`Secondary ${idx}`} loading="lazy" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={(e) => { e.preventDefault(); handleRemoveSecondary(url); }}
                          className="size-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center size-24 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group shrink-0">
                    {isUploading ? (
                      <span className="animate-spin border-2 border-primary/30 border-t-primary rounded-full size-6"></span>
                    ) : (
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-2xl">add_photo_alternate</span>
                    )}
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleSecondaryUpload} />
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Showcase different angles of the product</p>
              </div>
            </section>
          )}

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

          {/* Product Highlights */}
          <section className="bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <span className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">star</span>
                </span>
                Product Highlights
              </h3>
              <button
                onClick={handleAddHighlight}
                type="button"
                className="text-xs font-bold text-primary flex items-center gap-1.5 hover:opacity-80 uppercase tracking-widest transition-opacity"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Add Highlight
              </button>
            </div>
            <p className="text-xs text-slate-400 font-medium mb-8">
              Highlight key features like materials, digital security, or shipping perks.
            </p>

            <div className="space-y-4">
              {highlights.map((highlight, idx) => (
                <div key={idx} className="p-6 bg-slate-50/50 dark:bg-[#101622]/50 rounded-2xl border border-slate-100 dark:border-white/5 relative group transition-colors hover:border-slate-200 dark:hover:border-white/10">
                  <button
                    onClick={() => handleRemoveHighlight(idx)}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg font-bold">cancel</span>
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Icon Name</label>
                      <div className="relative group/icon">
                        {highlight.icon_name?.trim().startsWith('<svg') ? (
                          <div
                            className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400 flex items-center justify-center pointer-events-none [&>svg]:size-full [&>svg]:fill-current"
                            dangerouslySetInnerHTML={{ __html: highlight.icon_name }}
                          />
                        ) : (
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            {highlight.icon_name || 'verified'}
                          </span>
                        )}
                        <input
                          value={highlight.icon_name}
                          onChange={(e) => handleHighlightChange(idx, 'icon_name', e.target.value)}
                          className="w-full bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold shadow-sm focus:border-primary outline-none transition-all"
                          type="text"
                          placeholder="Icon Name or <svg>..."
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2 px-1">
                        <Link href="https://fonts.google.com/icons" target="_blank" className="text-[9px] text-primary hover:underline font-bold uppercase tracking-wider">Material Icons</Link>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Supports Raw SVG</span>
                      </div>
                    </div>

                    <div className="md:col-span-9 space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Highlight Title</label>
                        <input
                          value={highlight.title}
                          onChange={(e) => handleHighlightChange(idx, 'title', e.target.value)}
                          className="w-full bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm"
                          type="text"
                          placeholder="e.g. Digital Security"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Description</label>
                        <textarea
                          value={highlight.description}
                          onChange={(e) => handleHighlightChange(idx, 'description', e.target.value)}
                          className="w-full bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-medium shadow-sm resize-none"
                          placeholder="Short description of the feature..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {highlights.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-3xl text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-4 opacity-20">star</span>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-40">No highlights added yet</p>
                  <button onClick={handleAddHighlight} className="mt-4 text-primary font-bold text-xs uppercase tracking-widest hover:underline">Add first highlight</button>
                </div>
              )}
            </div>
          </section>

          {/* Color Variants */}
          <section className="bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <span className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">palette</span>
                </span>
                Color Options
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{showColors ? 'Active' : 'Disabled'}</span>
                <button
                  type="button"
                  onClick={() => setShowColors(!showColors)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showColors ? 'bg-primary' : 'bg-slate-200 dark:bg-white/10'}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showColors ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            </div>
            {showColors ? (
              <>
                <div className="flex justify-between items-center mb-2 mt-8">
                  <p className="text-xs text-slate-400 font-medium">
                    Each color has its own photo. This photo is used as the color swatch and in the gallery.
                  </p>
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
                    <div key={idx} className="p-6 bg-slate-50/50 dark:bg-[#101622]/50 rounded-2xl border border-slate-100 dark:border-white/5 relative group transition-colors hover:border-slate-200 dark:hover:border-white/10">
                      <button
                        onClick={() => handleRemoveVariant(idx)}
                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg font-bold">cancel</span>
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Photo — large and prominent, comes first */}
                        <div className="md:col-span-4">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">
                            Photo
                            {idx === 0 && <span className="ml-2 text-emerald-500">· Main image</span>}
                          </label>
                          {variant.imageUrl ? (
                            <div>
                              <div className="relative aspect-square w-full rounded-xl overflow-hidden border-2 border-slate-100 dark:border-white/10 group/img">
                                <img src={variant.imageUrl} className="w-full h-full object-cover" alt={variant.name} loading="lazy" />
                                {uploadingVariantIdx === idx && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="animate-spin border-4 border-primary/30 border-t-primary rounded-full size-8"></span>
                                  </div>
                                )}
                              </div>
                              {/* Always-visible change button — no hover required */}
                              <label className="mt-2 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all cursor-pointer uppercase tracking-widest">
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Change Photo
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleVariantImageUpload(idx, e)} />
                              </label>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center aspect-square w-full rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a2234] hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group/add">
                              {uploadingVariantIdx === idx ? (
                                <span className="animate-spin border-4 border-primary/30 border-t-primary rounded-full size-8"></span>
                              ) : (
                                <>
                                  <span className="material-symbols-outlined text-slate-300 group-hover/add:text-primary transition-colors text-3xl mb-2">add_photo_alternate</span>
                                  <span className="text-[10px] font-bold text-slate-400 group-hover/add:text-primary transition-colors uppercase tracking-widest">Upload Photo</span>
                                </>
                              )}
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleVariantImageUpload(idx, e)} />
                            </label>
                          )}
                        </div>

                        {/* Name + Color */}
                        <div className="md:col-span-8 flex flex-col gap-4 justify-center">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Variant Name</label>
                            <input
                              value={variant.name}
                              onChange={(e) => handleVariantChange(idx, 'name', e.target.value)}
                              className="w-full bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm"
                              type="text"
                              placeholder="e.g. Midnight Black"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-2">Base Color</label>
                              <div className="flex items-center gap-3">
                                <div className="relative size-10 shrink-0">
                                  <input
                                    type="color"
                                    value={variant.hex}
                                    onChange={(e) => handleVariantChange(idx, 'hex', e.target.value)}
                                    className="absolute inset-0 size-full opacity-0 cursor-pointer z-10"
                                  />
                                  <div
                                    className="size-full rounded-lg border-2 border-white dark:border-slate-800 shadow-sm"
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
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Secondary Color</label>
                                <button
                                  type="button"
                                  onClick={() => handleVariantChange(idx, 'secondaryHex', variant.secondaryHex ? '' : '#000000')}
                                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${variant.secondaryHex ? 'bg-primary' : 'bg-slate-200 dark:bg-white/10'}`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${variant.secondaryHex ? 'translate-x-4' : 'translate-x-0'}`}
                                  />
                                </button>
                              </div>
                              {variant.secondaryHex ? (
                                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                  <div className="relative size-10 shrink-0">
                                    <input
                                      type="color"
                                      value={variant.secondaryHex}
                                      onChange={(e) => handleVariantChange(idx, 'secondaryHex', e.target.value)}
                                      className="absolute inset-0 size-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div
                                      className="size-full rounded-lg border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden"
                                      style={{ backgroundColor: variant.secondaryHex }}
                                    ></div>
                                  </div>
                                  <input
                                    value={variant.secondaryHex}
                                    onChange={(e) => handleVariantChange(idx, 'secondaryHex', e.target.value)}
                                    className="w-full bg-white dark:bg-[#1a2234] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm font-mono"
                                    type="text"
                                  />
                                </div>
                              ) : (
                                <div className="h-[42px] flex items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-white/5 bg-slate-50/30 dark:bg-white/5 opacity-50">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Single Color Mode</span>
                                </div>
                              )}
                            </div>
                          </div>
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

                {/* Additional Photos — shown only when colors are enabled and variants exist */}
                {hasVariants && (
                  <div className="pt-8 border-t border-slate-100 dark:border-white/5 mt-8">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Additional Photos</label>
                    <p className="text-[11px] text-slate-400 font-medium mb-4">Optional — lifestyle shots or angles not linked to a specific color. These are added to the product gallery alongside the color photos.</p>
                    <div className="flex flex-wrap gap-4">
                      {secondaryImages.map((url, idx) => (
                        <div key={idx} className="relative size-24 rounded-xl overflow-hidden border-2 border-slate-100 dark:border-white/5 group bg-slate-50 dark:bg-black/20 shrink-0">
                          <img src={url} className="w-full h-full object-cover" alt={`Extra ${idx}`} loading="lazy" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={(e) => { e.preventDefault(); handleRemoveSecondary(url); }}
                              className="size-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                      <label className="flex flex-col items-center justify-center size-24 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group shrink-0">
                        {isUploading ? (
                          <span className="animate-spin border-2 border-primary/30 border-t-primary rounded-full size-6"></span>
                        ) : (
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">add_photo_alternate</span>
                        )}
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleSecondaryUpload} />
                      </label>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-3xl text-slate-400 mt-8">
                <span className="material-symbols-outlined text-4xl mb-4 opacity-20">block</span>
                <p className="text-sm font-bold uppercase tracking-widest opacity-40 text-center px-8">
                  Colors are currently deactivated.<br />
                  Use the toggle above to enable variants.
                </p>
              </div>
            )}
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
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#101622] border-2 border-slate-100 dark:border-white/5 rounded-2xl pl-10 pr-6 py-3.5 outline-none focus:border-primary text-sm font-bold transition-all"
                    type="number"
                    min="1"
                    step="1"
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
                    <option value="" disabled>Select Category</option>
                    {categories.length > 0 && (
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))
                    )}
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
