import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Verified, Trophy, Crosshair, Target, Award, Settings, Gamepad2 } from "lucide-react";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [{ title: "Profile — TournamentX" }] }),
  component: Profile,
});

function Profile() {
  return (
    <AppShell title="Profile">
      <div className="glass-card-strong relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-radial)" }} />
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
          <div className="relative">
            <img src="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=ShadowBlade" alt="" className="h-28 w-28 rounded-2xl border-2 border-primary bg-surface shadow-glow" />
            <span className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-full gradient-primary"><Verified className="h-4 w-4" /></span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h2 className="font-display text-4xl">ShadowBlade</h2>
              <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-success">Verified</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Mumbai, India · Joined Sep 2025</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              <UidPill label="FF MAX" value="123456789" />
              <UidPill label="BGMI" value="5544332211" />
            </div>
          </div>
          <button className="rounded-xl border border-border px-4 py-2 text-sm hover:border-primary"><Settings className="mr-1 inline h-4 w-4" />Edit</button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { icon: Trophy, label: "Tournaments", value: "62" },
          { icon: Award, label: "Wins", value: "14" },
          { icon: Crosshair, label: "Kills", value: "248" },
          { icon: Target, label: "Win Rate", value: "23%" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <s.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 font-display text-2xl">{s.value}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="font-display text-xl">Achievements</h3>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {["Top 10", "Sniper", "Streak 5", "First Win", "MVP", "Squad Up", "Pro", "Legend"].map((a, i) => (
              <div key={a} className={`grid aspect-square place-items-center rounded-xl border ${i < 5 ? "border-primary/40 bg-primary/10 shadow-glow" : "border-border bg-black/30"} text-center`}>
                <div>
                  <Award className={`mx-auto h-6 w-6 ${i < 5 ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="mt-1 text-[9px] uppercase tracking-widest">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="font-display text-xl">Recent Matches</h3>
          <div className="mt-4 space-y-2">
            {["Won · FF MAX Squad", "Top 3 · BGMI Solo", "Lost · BGMI Duo", "Won · FF MAX Squad", "Top 5 · BGMI Squad"].map((m, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-black/30 p-3 text-sm">
                <span className="flex items-center gap-2"><Gamepad2 className="h-4 w-4 text-muted-foreground" />{m}</span>
                <span className="text-xs text-muted-foreground">{i + 1}d ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function UidPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full border border-border bg-black/30 px-3 py-1 text-xs">
      <span className="text-muted-foreground">{label}:</span> <span className="font-mono">{value}</span>
    </span>
  );
}
