import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const { user, needsProfileSetup, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        nav({ to: needsProfileSetup ? "/app/profile-setup" : "/app/home" });
      } else {
        nav({ to: "/login" });
      }
    }
  }, [user, needsProfileSetup, loading]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Signing you in…</p>
      </div>
    </div>
  );
}
