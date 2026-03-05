/**
 * Index.tsx — redirects to splash screen (handled by App.tsx routing).
 * Kept as a fallback.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate("/", { replace: true }); }, [navigate]);
  return null;
};

export default Index;
