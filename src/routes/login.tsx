import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Swords, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import heroImg from "@/assets/hero-warrior.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — TournamentX" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { user, needsProfileSetup } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) nav({ to: needsProfileSetup ? "/app/profile-setup" : "/app/home" });
  }, [user, needsProfileSetup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message);
    }
    setLoading(false);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <HeroBanner />
      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-6">
          <MobileLogo />
          <div>
            <h1 className="font-display text-4xl">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to continue your journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Email</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-black/30 px-3 focus-within:border-primary transition-colors">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Password</label>
                <button type="button" onClick={() => handleForgot(email)} className="text-[10px] text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-black/30 px-3 focus-within:border-primary transition-colors">
                <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  required
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent py-3 text-sm outline-none"
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-bold uppercase tracking-widest shadow-glow transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">Create account</Link>
          </p>
          <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
            By continuing you agree to our terms
          </p>
        </motion.div>
      </div>
    </div>
  );
}

async function handleForgot(email: string) {
  if (!email.trim()) { toast.error("Enter your email first, then click Forgot password."); return; }
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/app/profile-setup`,
  });
  if (error) toast.error(error.message);
  else toast.success("Password reset email sent! Check your inbox.");
}

export function HeroBanner() {
  return (
    <div className="relative hidden lg:block">
      <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover object-[60%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative flex h-full flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <span className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-glow"><Swords className="h-5 w-5" /></span>
          <span className="font-display text-2xl tracking-widest">Tournament<span className="text-gradient-primary">X</span></span>
        </Link>
        <div className="space-y-3">
          <h2 className="font-display text-5xl">The Arena <br /><span className="text-gradient-primary">Awaits You.</span></h2>
          <p className="max-w-md text-muted-foreground">Join 25,000+ players competing in India's top Free Fire MAX and BGMI tournaments.</p>
        </div>
      </div>
    </div>
  );
}

export function MobileLogo() {
  return (
    <Link to="/" className="flex items-center gap-2 lg:hidden">
      <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-glow"><Swords className="h-5 w-5" /></span>
      <span className="font-display text-xl tracking-widest">Tournament<span className="text-gradient-primary">X</span></span>
    </Link>
  );
}
