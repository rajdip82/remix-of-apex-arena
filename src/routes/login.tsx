import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Swords, Phone, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import heroImg from "@/assets/hero-warrior.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — TournamentX" }] }),
  component: () => <AuthShell mode="login" />,
});

export function AuthShell({ mode }: { mode: "login" | "signup" }) {
  const { user, needsProfileSetup } = useAuth();
  const nav = useNavigate();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      nav({ to: needsProfileSetup ? "/app/profile-setup" : "/app/home" });
    }
  }, [user, needsProfileSetup]);

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) { toast.error(error.message); setLoading(false); }
  };

  const handlePhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) { toast.error("Enter a valid 10-digit mobile number"); return; }
    setLoading(true);
    const fullPhone = `+91${digits}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    if (error) {
      toast.error(error.message);
    } else {
      sessionStorage.setItem("tx_otp_phone", fullPhone);
      toast.success("OTP sent!");
      nav({ to: "/verify-otp" });
    }
    setLoading(false);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
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

      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-6"
        >
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-glow"><Swords className="h-5 w-5" /></span>
            <span className="font-display text-xl tracking-widest">Tournament<span className="text-gradient-primary">X</span></span>
          </Link>
          <div>
            <h1 className="font-display text-4xl">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{mode === "login" ? "Sign in to continue your journey." : "Start competing in 60 seconds."}</p>
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white text-black py-3 text-sm font-semibold transition hover:brightness-95 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handlePhoneOtp} className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Phone Number</label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-black/30 px-3 focus-within:border-primary focus-within:ring-glow">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">+91</span>
              <input
                required
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 bg-transparent py-3 text-sm outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-bold uppercase tracking-widest shadow-glow transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send OTP <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login"
              ? <>New here? <Link to="/signup" className="font-semibold text-primary hover:underline">Create account</Link></>
              : <>Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link></>}
          </p>
          <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
            By continuing you agree to our <Link to="/terms" className="text-foreground/70 hover:text-primary">Terms</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.44.36-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.15-3.15C17.45 2.09 14.96 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
