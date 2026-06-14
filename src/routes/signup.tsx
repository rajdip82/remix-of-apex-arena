import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { HeroBanner, MobileLogo } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — TournamentX" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { user, needsProfileSetup } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) nav({ to: needsProfileSetup ? "/app/profile-setup" : "/app/home" });
  }, [user, needsProfileSetup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords don't match."); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    const uname = username.trim().toLowerCase().replace(/\s+/g, "");
    if (uname.length < 3) { toast.error("Username must be at least 3 characters."); return; }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { username: uname, preferred_username: uname },
      },
    });
    if (error) {
      if (error.message.includes("already registered")) toast.error("Email already in use. Try signing in.");
      else toast.error(error.message);
      setLoading(false);
    } else if (data.session) {
      // Email confirmation is disabled — logged in immediately
      toast.success(`Welcome, ${uname}! You're all set.`);
      // nav happens via the useEffect when user state updates
    } else {
      // Email confirmation is enabled — user must confirm first
      toast.success("Account created! Check your email to confirm, then sign in.");
      nav({ to: "/login" });
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <HeroBanner />
      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-6">
          <MobileLogo />
          <div>
            <h1 className="font-display text-4xl">Create Account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Start competing in 60 seconds.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Username</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-black/30 px-3 focus-within:border-primary transition-colors">
                <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  required
                  type="text"
                  placeholder="shadowblade99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                  className="flex-1 bg-transparent py-3 text-sm outline-none"
                />
              </div>
            </div>

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
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Password</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-black/30 px-3 focus-within:border-primary transition-colors">
                <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  required
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent py-3 text-sm outline-none"
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Confirm Password</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-black/30 px-3 focus-within:border-primary transition-colors">
                <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  required
                  type={showPw ? "text" : "password"}
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="flex-1 bg-transparent py-3 text-sm outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-bold uppercase tracking-widest shadow-glow transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
            By continuing you agree to our terms
          </p>
        </motion.div>
      </div>
    </div>
  );
}
