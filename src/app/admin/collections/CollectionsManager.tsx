"use client";

import React, { useState } from "react";
import { updateCollections } from "@/app/actions/homepage";
import { CollectionItem } from "./CollectionItem";
import { useToast } from "@/context/ToastContext";

interface Collection {
  id?: string;
  slot_index: number;
  label: string;
  heading: string;
  image_url: string;
  button_text: string;
  button_link: string;
  is_slider: boolean;
}

export function CollectionsManager({ initialCollections }: { initialCollections: Collection[] }) {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [isSlider, setIsSlider] = useState(initialCollections[0]?.is_slider || false);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  function handleUpdate(index: number, updates: Partial<Collection>) {
    const newCollections = [...collections];
    newCollections[index] = { ...newCollections[index], ...updates };
    setCollections(newCollections);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      // Sync isSlider to all collections
      const updatedCollections = collections.map(col => ({
        ...col,
        is_slider: isSlider
      }));
      await updateCollections(updatedCollections);
      showToast("All collections updated successfully!", "success");
    } catch (err: any) {
      console.error("Save error:", err);
      showToast(err.message, "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="relative space-y-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Home Page Collections</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
            Manage the hero section of your home page. Switch between a 3-column grid or a single cinematic slider.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3.5 bg-primary text-white rounded-xl text-sm font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/30 disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? "Saving..." : (
            <>
              <span className="material-symbols-outlined text-lg">save</span>
              Save All Changes
            </>
          )}
        </button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">layers</span>
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Section Layout Mode</p>
            <p className="text-sm text-slate-500">Choose how your collections are displayed on the home page.</p>
          </div>
        </div>

        <div className="flex p-1 bg-slate-200/50 dark:bg-white/5 rounded-xl border border-slate-300/50 dark:border-white/5">
          <button
            onClick={() => setIsSlider(false)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${!isSlider ? 'bg-white dark:bg-slate-800 text-primary shadow-sm shadow-black/5' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
            Triple Grid
          </button>
          <button
            onClick={() => setIsSlider(true)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${isSlider ? 'bg-white dark:bg-slate-800 text-primary shadow-sm shadow-black/5' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
            <span className="material-symbols-outlined text-[18px]">view_carousel</span>
            Single Slider
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isSlider ? '' : 'md:grid-cols-3'} gap-8`}>
        {collections.map((col, idx) => (
          <CollectionItem 
            key={idx} 
            col={col} 
            onChange={(updates) => handleUpdate(idx, updates)} 
            isSlider={isSlider}
          />
        ))}
      </div>

      {collections.every(c => !c.id) && (
        <div className="mt-12 p-6 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 text-slate-600 dark:text-slate-400">
          <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-slate-500">info</span>
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Preview Mode</p>
            <p className="text-sm opacity-80">You're seeing placeholders. Changes will be saved to the database.</p>
          </div>
        </div>
      )}
    </div>
  );
}
