import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { authed, checking } = useAdminAuth();
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(220_20%_10%)] text-white/60">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!authed) return <Navigate to="/grupo16Kwendi/login" replace />;
  return <>{children}</>;
};