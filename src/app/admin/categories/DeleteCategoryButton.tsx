"use client";

import { deleteCategory } from "@/app/actions/categories";
import React, { useState } from "react";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
}

export default function DeleteCategoryButton({ categoryId, categoryName }: DeleteCategoryButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      await deleteCategory(categoryId);
      setShowModal(false);
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-slate-400 hover:text-red-500 transition-colors"
        title="Delete Category"
      >
        <span className="material-symbols-outlined text-lg">delete</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-red-500/10 max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out">
            <div className="p-8 text-center">
              <div className="size-20 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-20" />
                <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight leading-tight">
                Wait! Danger Zone
              </h3>

              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed max-w-[280px] mx-auto">
                Are you absolutely sure? You are deleting the category <strong>"{categoryName}"</strong>.
              </p>

              {errorMsg && (
                <p className="mb-6 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30 animate-shake">
                  {errorMsg}
                </p>
              )}

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full py-4 px-6 text-sm font-black text-white bg-red-600 hover:bg-red-500 rounded-2xl transition-all shadow-lg shadow-red-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      Deleting Category...
                    </>
                  ) : (
                    'Yes, Delete Permanently'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setErrorMsg(null); }}
                  disabled={isDeleting}
                  className="w-full py-4 px-6 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Nevermind, Go Back
                </button>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 px-8 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-xs">info</span>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Action cannot be undone</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
