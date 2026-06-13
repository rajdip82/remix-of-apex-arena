import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swords, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/verify-otp")({
  head: () => ({ meta: [{ title: "Verify OTP — TournamentX" }] }),
  component: VerifyOtp,
});

function VerifyOtp() {
  const { user, needsProfileSetup } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const nav = useNavigate();
  const phone = typeof window !== "undefined" ? sessionStorage.getItem("tx_otp_phone") ?? "" : "";

  useEffect(() => {
    if (user) nav({ to: needsProfileSetup ? "/app/profile-setup" : "/app/home" });
  }, [user, needsProfileSetup]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (i: number, v: string) => {
    const c = v.slice(-1).replace(/\D/, "");
    const next = [...otp];
    next[i] = c;
    setOtp(next);
    if (c && i < 5) refs.current[i + 1]?.focus();
    if (!c && i > 0) refs.current[i - 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("");
    if (token.length !== 6) { toast.error("Enter the full 6-digit OTP"); return; }
    if (!phone) { toast.error("Session expired. Please restart login."); nav({ to: "/login" }); return; }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      sessionStorage.removeItem("tx_otp_phone");
      toast.success("Phone verified!");
    }
  };

  const handleResend = async () => {
    if (!phone) return;
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) { toast.error(error.message); return; }
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    toast.success("OTP resent!");
  };

  const displayPhone = phone
    ? phone.replace("+91", "+91 ").replace(/(\d{5})(\d{5})/, "$1 $2")
    : "your phone";

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: "var(--gradient-radial)" }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-strong w-full max-w-md p-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-glow">
            <Swords className="h-5 w-5" />
          </span>
          <span className="font-display text-xl tracking-widest">Tournament<span className="text-gradient-primary">X</span></span>
        </Link>
        <ShieldCheck className="mx-auto mt-6 h-10 w-10 text-primary" />
        <h1 className="mt-3 font-display text-3xl">Verify Phone</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the 6-digit OTP sent to <span className="text-foreground">{displayPhone}</span>
        </p>
        <form onSubmit={handleVerify} className="mt-6 space-y-5">
          <div className="flex justify-center gap-2">
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="h-14 w-12 rounded-xl border border-border bg-black/30 text-center font-display text-2xl outline-none focus:border-primary focus:ring-glow"
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-bold uppercase tracking-widest shadow-glow transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Continue"}
          </button>
          <p className="text-xs text-muted-foreground">
            Didn't receive code?{" "}
            {resendTimer > 0
              ? <span>Resend in {resendTimer}s</span>
              : <button type="button" onClick={handleResend} className="font-semibold text-primary hover:underline">Resend OTP</button>
            }
          </p>
        </form>
        <Link to="/login" className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Back to login
        </Link>
      </motion.div>
    </div>
  );
}
