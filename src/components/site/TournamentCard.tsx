import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, Users, Trophy, Gamepad2 } from "lucide-react";
import { type Tournament, countdown, inr, shortInr } from "@/lib/mock-data";

export function TournamentCard({ t, index = 0 }: { t: Tournament; index?: number }) {
  const pct = Math.round((t.filled / t.slots) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="group glass-card overflow-hidden transition hover:shadow-glow"
    >
      <div className={`relative h-36 overflow-hidden bg-gradient-to-br ${t.banner}`}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur">
            <Gamepad2 className="mr-1 inline h-3 w-3" />
            {t.game}
          </span>
          {t.status === "Live" && (
            <span className="flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-glow animate-pulse-glow">
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> Live
            </span>
          )}
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur">
          {t.mode}
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <h3 className="font-display text-2xl leading-none drop-shadow-lg">{t.name}</h3>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat icon={Trophy} label="Prize" value={shortInr(t.prizePool)} accent />
          <Stat icon={Users} label="Slots" value={`${t.filled}/${t.slots}`} />
          <Stat icon={Clock} label="Starts" value={countdown(t.startsAt)} suppressHydration />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Registration</span>
            <span>{pct}% full</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
            <div className="h-full gradient-primary animate-shimmer bg-gradient-to-r from-primary via-primary-glow to-accent" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Entry</p>
            <p className="font-display text-xl">{t.entryFee === 0 ? "FREE" : inr(t.entryFee)}</p>
          </div>
          <Link
            to="/app/tournament/$id"
            params={{ id: t.id }}
            className="rounded-xl gradient-primary px-5 py-2.5 text-sm font-bold shadow-glow transition hover:brightness-110"
          >
            {t.status === "Completed" ? "View" : "Join Now"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value, accent, suppressHydration }: { icon: typeof Trophy; label: string; value: string; accent?: boolean; suppressHydration?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-black/30 p-2.5">
      <Icon className={`mx-auto h-3.5 w-3.5 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      <p suppressHydrationWarning={suppressHydration} className={`mt-1 text-sm font-bold ${accent ? "text-gradient-primary" : ""}`}>{value}</p>
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
