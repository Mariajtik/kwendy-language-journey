import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

// Reset one-shot: elimina dados residuais do LocalStorage do backend antigo.
try {
  if (localStorage.getItem("kwendi.reset.v2") !== "1") {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("kwendi"))
      .forEach((k) => localStorage.removeItem(k));
    localStorage.setItem("kwendi.reset.v2", "1");
  }
} catch {
  /* noop */
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
