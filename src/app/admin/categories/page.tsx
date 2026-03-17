import { getCategories, createCategory } from "@/app/actions/categories";
import React from "react";
import DeleteCategoryButton from "./DeleteCategoryButton";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categories</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage your product categories for organization and filtering.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form to Add Category */}
        <div className="lg:col-span-4">
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-8">
            <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Add New Category</h3>
            <form 
              action={createCategory} 
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Category Name</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Wallets"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary outline-none transition-all text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea
                  name="description"
                  placeholder="Brief summary..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary outline-none transition-all text-sm font-medium resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Create Category
              </button>
            </form>
          </section>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">Category Name</th>
                  <th className="px-6 py-4 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">Slug</th>
                  <th className="px-6 py-4 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">
                      No categories found. Please add one to get started.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">{cat.name}</div>
                        {cat.description && <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">{cat.slug}</code>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <DeleteCategoryButton categoryId={cat.id} categoryName={cat.name} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {categories.length === 0 && (
            <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 mb-4">
                <span className="material-symbols-outlined">database</span>
                <p className="text-sm font-bold uppercase tracking-widest">Setup Required</p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                To enable category management, please run the following SQL script in your **Supabase SQL Editor**. This will create the necessary table and add initial categories.
              </p>
              <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto border border-white/5 shadow-inner">
                <pre className="text-[11px] font-mono text-slate-300 leading-relaxed">
{`create table categories (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  slug text unique not null,
  description text,
  created_at timestamp with time zone default now()
);

insert into categories (name, slug)
values 
('Wallets', 'wallets'),
('Bifolds', 'bifolds'),
('Phone Wallets', 'phone-wallets'),
('Limited Edition', 'limited-edition'),
('Premium Carry', 'premium-carry');

alter table categories enable row level security;
create policy "Allow public read access" on categories for select using (true);
create policy "Allow authenticated full access" on categories 
using (auth.role() = 'authenticated') 
with check (auth.role() = 'authenticated');`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
