"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--toast-bg, #fff)",
          color: "var(--toast-color, #111)",
          borderRadius: "12px",
          border: "1px solid var(--toast-border, #e5e7eb)",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          fontSize: "14px",
        },
        success: {
          iconTheme: { primary: "#7c3aed", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#fff" },
        },
      }}
    />
  );
}
