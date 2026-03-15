"use client";

import { deleteCategory } from "@/app/actions/categories";
import React from "react";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
}

export default function DeleteCategoryButton({ categoryId, categoryName }: DeleteCategoryButtonProps) {
  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      try {
        await deleteCategory(categoryId);
      } catch (error: any) {
        alert(error.message || "Failed to delete category");
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-slate-400 hover:text-red-500 transition-colors"
      title="Delete Category"
    >
      <span className="material-symbols-outlined text-lg">delete</span>
    </button>
  );
}
