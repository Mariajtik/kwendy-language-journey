/**
 * useAdminShortcut.ts
 * -------------------
 * Regista Ctrl+Shift+A globalmente para abrir a rota secreta do admin.
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAdminShortcut() {
  const navigate = useNavigate();
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        navigate("/grupo16Kwendi");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);
}