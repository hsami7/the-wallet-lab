"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  icon?: string;
  type: "page" | "content";
}

interface AdminSearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  pageResults: SearchResult[];
  setPageResults: (results: SearchResult[]) => void;
}

const AdminSearchContext = createContext<AdminSearchContextType | undefined>(undefined);

export function AdminSearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageResults, setPageResults] = useState<SearchResult[]>([]);

  return (
    <AdminSearchContext.Provider 
      value={{ 
        searchQuery, 
        setSearchQuery, 
        pageResults, 
        setPageResults 
      }}
    >
      {children}
    </AdminSearchContext.Provider>
  );
}

export function useAdminSearch() {
  const context = useContext(AdminSearchContext);
  if (context === undefined) {
    throw new Error("useAdminSearch must be used within an AdminSearchProvider");
  }
  return context;
}
