import { getCollections, updateCollection } from "@/app/actions/homepage";
import { createClient } from "@/utils/supabase/server";
import React from "react";

export default async function AdminCollectionsPage() {
  const collections = await getCollections();
  
  // Fallback initial data in case the user hasn't run the SQL yet
  const defaultCollections = [
    { slot_index: 0, label: 'Everyday Essentials', heading: 'Classic style', image_url: '/collections/classic.png', button_text: 'Shop Now' },
    { slot_index: 1, label: 'Winter Collection', heading: 'Cozy looks for any season', image_url: '/collections/winter.png', button_text: 'Discover more' },
    { slot_index: 2, label: 'Premium Accessories', heading: 'Timeless accessory', image_url: '/collections/accessories.png', button_text: 'Shop Now' },
  ];

  const displayCollections = collections.length > 0 ? collections : defaultCollections;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Home Page Collections</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage the 3-column grid content on your home page hero section.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayCollections.map((col: any, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative">
              <img 
                src={col.image_url} 
                alt={col.heading} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 px-2 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded">
                Slot {idx + 1}
              </div>
            </div>
            
            <form action={async (formData) => {
              "use server";
              if (col.id) {
                await updateCollection(col.id, formData);
              } else {
                // This would handle the case where the table is empty but we show defaults
                // For simplicity in this demo, we assume the user follows instructions to seed the DB
                console.error("Cannot update: Collection ID missing. Please seed the database first.");
              }
            }} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Label</label>
                <input 
                  name="label"
                  defaultValue={col.label}
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Heading</label>
                <input 
                  name="heading"
                  defaultValue={col.heading}
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Image URL</label>
                <input 
                  name="image_url"
                  defaultValue={col.image_url}
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Button Text</label>
                <input 
                  name="button_text"
                  defaultValue={col.button_text}
                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity mt-2"
              >
                Save Changes
              </button>
            </form>
          </div>
        ))}
      </div>

      {!collections.length && (
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-center gap-3 text-amber-800 dark:text-amber-400">
          <span className="material-symbols-outlined">warning</span>
          <p className="text-sm">
            <strong>Database Not Seeded:</strong> The collections above are placeholders. Please run the SQL script provided in the implementation plan to enable saving edits.
          </p>
        </div>
      )}
    </div>
  );
}
