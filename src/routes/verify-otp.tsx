import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Swords, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/verify-otp")({
  head: () => ({ meta: [{ title: "Verify OTP — TournamentX" }] }),
  component: VerifyOtp,
});

function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const nav = useNavigate();

  const onChange = (i: number, v: string) => {
    const c = v.slice(-1).replace(/\D/, "");
    const next = [...otp];
    next[i] = c;
    setOtp(next);
    if (c && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: "var(--gradient-radial)" }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-strong w-full max-w-md p-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-glow"><Swords className="h-5 w-5" /></span>
          <span className="font-display text-xl tracking-widest">Tournament<span className="text-gradient-primary">X</span></span>
        </Link>
        <ShieldCheck className="mx-auto mt-6 h-10 w-10 text-primary" />
        <h1 className="mt-3 font-display text-3xl">Verify Phone</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter the 6-digit OTP sent to <span className="text-foreground">+91 98765 43210</span></p>
        <form
          onSubmit={(e) => { e.preventDefault(); nav({ to: "/app/home" }); }}
          className="mt-6 space-y-5"
        >
          <div className="flex justify-center gap-2">
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => onChange(i, e.target.value)}
                className="h-14 w-12 rounded-xl border border-border bg-black/30 text-center font-display text-2xl outline-none focus:border-primary focus:ring-glow"
              />
            ))}
          </div>
          <button className="w-full rounded-xl gradient-primary py-3 text-sm font-bold uppercase tracking-widest shadow-glow transition hover:brightness-110">Verify & Continue</button>
          <p className="text-xs text-muted-foreground">Didn't receive code? <button type="button" className="font-semibold text-primary hover:underline">Resend in 30s</button></p>
        </form>
      </motion.div>
    </div>
  );
}
