import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { tournaments, countdown, inr } from "@/lib/mock-data";
import { Trophy, Users, Clock, Map, Gamepad2, Check, Copy, ArrowLeft, QrCode, Upload } from "lucide-react";
import { StatusBadge } from "./app.home";

export const Route = createFileRoute("/app/tournament/$id")({
  head: () => ({ meta: [{ title: "Tournament — TournamentX" }] }),
  loader: ({ params }) => {
    const t = tournaments.find((x) => x.id === params.id);
    if (!t) throw notFound();
    return { tournament: t };
  },
  component: TournamentDetail,
  notFoundComponent: () => <AppShell title="Not found"><p className="text-muted-foreground">Tournament not found.</p></AppShell>,
  errorComponent: ({ error }) => <AppShell title="Error"><p className="text-danger">{error.message}</p></AppShell>,
});

function TournamentDetail() {
  const { tournament: t } = Route.useLoaderData();
  const [tab, setTab] = useState<"overview" | "rules" | "teams" | "register">("overview");

  return (
    <AppShell title={t.name}>
      <Link to="/app/tournaments" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> All tournaments</Link>

      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${t.banner} p-8 md:p-12`}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur"><Gamepad2 className="mr-1 inline h-3 w-3" />{t.game}</span>
            <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur">{t.mode}</span>
            <StatusBadge status={t.status} />
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl">{t.name}</h1>
          <p className="mt-2 text-white/80">Map: {t.map} · Starts in {countdown(t.startsAt)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <KPI icon={Trophy} label="Prize Pool" value={inr(t.prizePool)} accent />
        <KPI icon={Users} label="Slots" value={`${t.filled}/${t.slots}`} />
        <KPI icon={Clock} label="Starts" value={countdown(t.startsAt)} />
        <KPI icon={Map} label="Entry Fee" value={t.entryFee === 0 ? "FREE" : inr(t.entryFee)} />
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-border">
        {(["overview", "rules", "teams", "register"] as const).map((x) => (
          <button key={x} onClick={() => setTab(x)} className={`relative -mb-px whitespace-nowrap px-4 py-3 text-sm font-semibold uppercase tracking-widest transition ${tab === x ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {x === "register" ? "Register" : x.charAt(0).toUpperCase() + x.slice(1)}
            {tab === x && <span className="absolute inset-x-2 -bottom-px h-0.5 gradient-primary" />}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "overview" && <Overview t={t} />}
        {tab === "rules" && <Rules />}
        {tab === "teams" && <Teams filled={t.filled} />}
        {tab === "register" && <Register t={t} />}
      </div>
    </AppShell>
  );
}

function KPI({ icon: Icon, label, value, accent }: { icon: typeof Trophy; label: string; value: string; accent?: boolean }) {
  return (
    <div className="glass-card p-4">
      <Icon className={`h-5 w-5 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      <p className={`mt-3 font-display text-2xl ${accent ? "text-gradient-primary" : ""}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function Overview({ t }: { t: typeof tournaments[number] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="glass-card p-6 lg:col-span-2">
        <h3 className="font-display text-xl">About</h3>
        <p className="mt-2 text-sm text-muted-foreground">High-stakes {t.mode.toLowerCase()} match on {t.map}. Top 3 teams split the {inr(t.prizePool)} prize pool. Custom room with anti-cheat monitoring. Match casting available on TX Live.</p>
        <h4 className="mt-6 font-display tracking-wider">Prize Distribution</h4>
        <div className="mt-3 space-y-2">
          {[{ p: "1st", v: 0.5 }, { p: "2nd", v: 0.3 }, { p: "3rd", v: 0.15 }, { p: "MVP", v: 0.05 }].map((r) => (
            <div key={r.p} className="flex items-center justify-between rounded-xl border border-border bg-black/30 p-3 text-sm">
              <span className="font-semibold">{r.p}</span>
              <span className="text-gradient-primary font-display text-lg">{inr(Math.round(t.prizePool * r.v))}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card p-6">
        <h3 className="font-display text-xl">Schedule</h3>
        <ul className="mt-3 space-y-3 text-sm">
          {["Registration closes", "Lobby opens", "Match 1 — Erangel", "Match 2 — Miramar", "Finals"].map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-full border border-border bg-black/30 text-xs">{i + 1}</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Rules() {
  const rules = [
    "All players must use registered Gaming UID. Substitutes need admin approval.",
    "No emulators. Mobile devices only.",
    "Stream sniping = instant DQ + ban.",
    "Reconnect grace: 90 seconds per match.",
    "Disputes settled by admin within 30 min post-match.",
  ];
  return (
    <div className="glass-card p-6">
      <h3 className="font-display text-xl">Official Rules</h3>
      <ul className="mt-4 space-y-3">
        {rules.map((r) => (
          <li key={r} className="flex gap-3 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Teams({ filled }: { filled: number }) {
  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border bg-black/30 text-left text-[10px] uppercase tracking-widest text-muted-foreground"><th className="p-3">#</th><th className="p-3">Team</th><th className="p-3">Captain</th><th className="p-3 text-right">Status</th></tr></thead>
        <tbody>
          {Array.from({ length: Math.min(filled, 12) }).map((_, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="p-3 text-muted-foreground">{i + 1}</td>
              <td className="p-3 font-semibold">{["Phantom Squad", "Iron Wolves", "Crimson Duo", "Apex Strike", "Zero Day", "Neon Reapers"][i % 6]}</td>
              <td className="p-3 text-muted-foreground">{["ShadowBlade", "IronWolf", "CrimsonFury", "ApexLynx", "ZeroDayX", "NeonReaper"][i % 6]}</td>
              <td className="p-3 text-right"><StatusBadge status="Approved" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Register({ t }: { t: typeof tournaments[number] }) {
  const [step, setStep] = useState(1);
  return (
    <div className="glass-card p-6">
      <div className="mb-6 flex items-center gap-2 overflow-x-auto">
        {["Team", "Code", "Payment", "Proof", "Done"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${step >= i + 1 ? "gradient-primary shadow-glow text-white" : "border border-border text-muted-foreground"}`}>{i + 1}</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">{s}</span>
            {i < 4 && <span className="h-px w-6 bg-border" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Select your team</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Phantom Squad", "Iron Wolves"].map((tm) => (
              <button key={tm} onClick={() => setStep(2)} className="rounded-xl border border-border bg-black/30 p-4 text-left transition hover:border-primary">
                <p className="font-display text-lg">{tm}</p>
                <p className="text-xs text-muted-foreground">4 members · Free Fire MAX</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Redeem Code (optional)</label>
          <div className="flex gap-2">
            <input placeholder="e.g. FREEFF2026" className="flex-1 rounded-xl border border-border bg-black/30 px-4 py-3 text-sm uppercase outline-none focus:border-primary focus:ring-glow" />
            <button className="rounded-xl border border-border px-4 text-sm font-semibold hover:border-primary">Apply</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="rounded-xl border border-border px-5 py-2.5 text-sm">Back</button>
            <button onClick={() => setStep(3)} className="rounded-xl gradient-primary px-5 py-2.5 text-sm font-bold shadow-glow">Continue</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-black/30 p-6 text-center">
            <QrCode className="mx-auto h-32 w-32 text-foreground" />
            <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Scan to pay</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-black/30 p-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">UPI ID</p>
              <div className="mt-1 flex items-center justify-between">
                <code className="font-mono text-sm">tournamentx@upi</code>
                <button className="rounded-lg border border-border p-2 hover:border-primary"><Copy className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="rounded-xl border border-primary/40 bg-primary/10 p-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Amount</p>
              <p className="font-display text-3xl text-gradient-primary">{inr(t.entryFee)}</p>
            </div>
            <button onClick={() => setStep(4)} className="w-full rounded-xl gradient-primary py-3 text-sm font-bold shadow-glow">I've Paid — Submit Proof</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">UTR Number</label>
          <input placeholder="12-digit UTR" className="w-full rounded-xl border border-border bg-black/30 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-glow" />
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground">OR Upload Screenshot</label>
          <div className="grid place-items-center rounded-xl border-2 border-dashed border-border bg-black/20 p-8 text-center text-sm text-muted-foreground">
            <Upload className="mb-2 h-6 w-6" /> Drop screenshot here
          </div>
          <button onClick={() => setStep(5)} className="w-full rounded-xl gradient-primary py-3 text-sm font-bold shadow-glow">Submit For Verification</button>
        </div>
      )}

      {step === 5 && (
        <div className="text-center py-6">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full gradient-primary shadow-glow"><Check className="h-8 w-8 text-white" /></div>
          <h3 className="mt-4 font-display text-2xl">Registration Submitted</h3>
          <p className="mt-2 text-sm text-muted-foreground">Your registration ID is <span className="font-mono text-primary">TX-{Math.floor(Math.random() * 99999)}</span>. Admin verification usually completes in under 30 minutes.</p>
          <Link to="/app/my-registrations" className="mt-6 inline-block rounded-xl gradient-primary px-5 py-2.5 text-sm font-bold shadow-glow">View My Registrations</Link>
        </div>
      )}
    </div>
  );
}
