import { useAuth } from "../Providers/AuthProvider";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session } = useAuth();

  return session ? children : <Navigate to="/login" />;
}
