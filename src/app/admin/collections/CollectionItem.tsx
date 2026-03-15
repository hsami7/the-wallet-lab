"use client";

import React, { useState, useRef } from "react";
import { ProductSelector } from "./ProductSelector";
import { createClient } from "@/utils/supabase/client";

interface Collection {
  id?: string;
  slot_index: number;
  label: string;
  heading: string;
  image_url: string;
  button_text: string;
  button_link: string;
}

export function CollectionItem({ 
  col, 
  onChange 
}: { 
  col: Collection; 
  onChange: (updates: Partial<Collection>) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `collections/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      onChange({ image_url: publicUrl });
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Failed to upload image: " + err.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative group">
        <img 
          src={col.image_url} 
          alt={col.heading} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-lg hover:bg-slate-100 transition-all"
          >
            <span className="material-symbols-outlined text-sm">upload</span>
            Upload
          </button>
          <button 
            type="button"
            onClick={() => setShowSelector(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-lg hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-sm">collections</span>
            Select Product
          </button>
        </div>
        <input 
          type="file" 
          hidden 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileUpload}
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-bold">
            Uploading...
          </div>
        )}
        <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded-full shadow-lg">
          Slot {col.slot_index + 1}
        </div>
      </div>
      
      <div className="p-6 flex flex-col gap-5">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-tighter">Label</label>
            <input 
              value={col.label}
              onChange={(e) => onChange({ label: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-tighter">Heading</label>
            <textarea 
              value={col.heading}
              onChange={(e) => onChange({ heading: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-tighter">Button Text</label>
            <input 
              value={col.button_text}
              onChange={(e) => onChange({ button_text: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-tighter">Button Link</label>
            <input 
              value={col.button_link || "/shop"}
              onChange={(e) => onChange({ button_link: e.target.value })}
              placeholder="/shop"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {showSelector && (
        <ProductSelector 
          onClose={() => setShowSelector(false)} 
          onSelect={(url) => {
            onChange({ image_url: url });
            setShowSelector(false);
          }} 
        />
      )}
    </div>
  );
}
