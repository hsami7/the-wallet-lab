import { getCategories, createCategory, updateCategory, deleteCategory } from "@/app/actions/categories";
import React from "react";

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
              action={async (formData) => {
                await createCategory(formData);
              }} 
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Category Name</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Cardholders"
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
                          <form action={async () => {
                            "use server";
                            if (confirm(`Are you sure you want to delete "${cat.name}"?`)) {
                              await deleteCategory(cat.id);
                            }
                          }}>
                            <button type="submit" className="text-slate-400 hover:text-red-500 transition-colors">
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {categories.length === 0 && (
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl flex items-center gap-3 text-amber-800 dark:text-amber-400">
              <span className="material-symbols-outlined">info</span>
              <p className="text-xs">
                To start managing your categories, please ensure the <code>categories</code> table is created and seeded in Supabase.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
