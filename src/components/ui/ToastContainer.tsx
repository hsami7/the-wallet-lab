"use client";

import React from "react";
import { useToast, Toast } from "@/context/ToastContext";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 sm:top-24 sm:right-8 sm:left-auto sm:translate-x-0 z-[100] flex flex-col gap-3 pointer-events-none w-[calc(100%-2rem)] sm:w-auto max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast, onRemove: () => void }) {
  const { type, message } = toast;

  const config = {
    success: {
      bg: "bg-emerald-500",
      icon: "check_circle",
      shadow: "shadow-emerald-500/40",
      animate: "animate-bounce"
    },
    error: {
      bg: "bg-red-500",
      icon: "error",
      shadow: "shadow-red-500/40",
      animate: ""
    },
    info: {
      bg: "bg-blue-500",
      icon: "info",
      shadow: "shadow-blue-500/40",
      animate: ""
    },
    warning: {
      bg: "bg-amber-500",
      icon: "warning",
      shadow: "shadow-amber-500/40",
      animate: ""
    }
  }[type];

  return (
    <div 
      className={`pointer-events-auto w-full sm:min-w-[320px] animate-in fade-in zoom-in slide-in-from-top-4 duration-300`}
      onClick={onRemove}
    >
      <div className={`${config.bg} text-white px-6 py-4 rounded-2xl shadow-2xl ${config.shadow} flex items-center gap-3 border border-white/20 cursor-pointer hover:scale-[1.02] transition-transform`}>
        <div className={`size-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 ${config.animate}`}>
          <span className="material-symbols-outlined text-lg">{config.icon}</span>
        </div>
        <span className="font-bold uppercase tracking-widest text-xs leading-tight">{message}</span>
      </div>
    </div>
  );
}
