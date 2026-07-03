import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import type { ReactNode } from "react";

export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { authed } = useAdminAuth();
  if (!authed) return <Navigate to="/grupo16Kwendi/login" replace />;
  return <>{children}</>;
};