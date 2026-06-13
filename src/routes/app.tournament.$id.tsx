import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Trophy, Users, Clock, Map, Gamepad2, Check, Copy, ArrowLeft, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTournament, useMyRegistrations } from "@/hooks/useTournaments";
import { useMyTeams } from "@/hooks/useTeams";
import { useSubmitPayment } from "@/hooks/usePayments";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/tournament/$id")({
  head: () => ({ meta: [{ title: "Tournament — TournamentX" }] }),
  component: TournamentDetail,
});

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Live: "border-success/40 bg-success/10 text-success",
    Upcoming: "border-warning/40 bg-warning/10 text-warning",
    Completed: "border-border text-muted-foreground",
    Cancelled: "border-red-500/40 bg-red-500/10 text-red-400",
    Approved: "border-success/40 bg-success/10 text-success",
    Pending: "border-warning/40 bg-warning/10 text-warning",
  };
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${styles[status] ?? "border-border text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function TournamentDetail() {
  const { id } = Route.useParams();
  const { tournament: t, loading } = useTournament(id);
  const { user } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"overview" | "rules" | "teams" | "register">("overview");

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading]);

  if (loading) return (
    <AppShell title="Tournament">
      <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    </AppShell>
  );

  if (!t) return (
    <AppShell title="Not Found">
      <p className="text-muted-foreground">Tournament not found.</p>
    </AppShell>
  );

  const gameBanners: Record<string, string> = {
    "Free Fire MAX": "from-orange-600 via-red-500 to-rose-600",
    "BGMI": "from-blue-700 via-indigo-600 to-violet-600",
  };
  const bannerGradient = gameBanners[t.game] ?? "from-red-600 via-rose-500 to-orange-500";
  const startDate = new Date(t.start_time).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const startTime = new Date(t.start_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  const pct = t.total_slots > 0 ? Math.round((t.filled_slots / t.total_slots) * 100) : 0;

  return (
    <AppShell title={t.title}>
      <Link to="/app/tournaments" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All tournaments
      </Link>

      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bannerGradient} p-8 md:p-12`}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur">
              <Gamepad2 className="mr-1 inline h-3 w-3" />{t.game}
            </span>
            <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur">{t.mode}</span>
            <StatusBadge status={t.status} />
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl">{t.title}</h1>
          <p className="mt-2 text-white/80">{t.map} · {startDate} at {startTime}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <KPI icon={Trophy} label="Prize Pool" value={`₹${t.prize_pool.toLocaleString("en-IN")}`} accent />
        <KPI icon={Users} label="Slots" value={`${t.filled_slots}/${t.total_slots}`} />
        <KPI icon={Clock} label="Entry Fee" value={t.entry_fee === 0 ? "FREE" : `₹${t.entry_fee}`} />
        <KPI icon={Map} label="Map" value={t.map} />
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Slots filled</span><span>{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-border">
          <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-border">
        {(["overview", "rules", "register"] as const).map((x) => (
          <button key={x} onClick={() => setTab(x as any)} className={`relative -mb-px whitespace-nowrap px-4 py-3 text-sm font-semibold uppercase tracking-widest transition ${tab === x ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {x.charAt(0).toUpperCase() + x.slice(1)}
            {tab === x && <span className="absolute inset-x-2 -bottom-px h-0.5 gradient-primary" />}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "overview" && <Overview t={t} />}
        {tab === "rules" && <Rules rules={t.rules} />}
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

function Overview({ t }: { t: ReturnType<typeof useTournament>["tournament"] }) {
  if (!t) return null;
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="glass-card p-6 lg:col-span-2">
        <h3 className="font-display text-xl">About</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t.game} {t.mode} tournament on {t.map}. Top teams share the ₹{t.prize_pool.toLocaleString("en-IN")} prize pool. Custom room with anti-cheat monitoring.
        </p>
        <h4 className="mt-6 font-display tracking-wider">Prize Distribution</h4>
        <div className="mt-3 space-y-2">
          {[{ p: "1st", v: 0.5 }, { p: "2nd", v: 0.3 }, { p: "3rd", v: 0.15 }, { p: "MVP", v: 0.05 }].map((r) => (
            <div key={r.p} className="flex items-center justify-between rounded-xl border border-border bg-black/30 p-3 text-sm">
              <span className="font-semibold">{r.p}</span>
              <span className="text-gradient-primary font-display text-lg">₹{Math.round(t.prize_pool * r.v).toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card p-6">
        <h3 className="font-display text-xl">Details</h3>
        <div className="mt-3 space-y-3 text-sm">
          {[
            { label: "Game", value: t.game },
            { label: "Mode", value: t.mode },
            { label: "Map", value: t.map },
            { label: "Total Slots", value: String(t.total_slots) },
            { label: "Entry Fee", value: t.entry_fee === 0 ? "Free" : `₹${t.entry_fee}` },
            { label: "Status", value: t.status },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Rules({ rules }: { rules: string | null }) {
  const defaultRules = [
    "All players must use registered Gaming UID. Substitutes need admin approval.",
    "No emulators. Mobile devices only.",
    "Stream sniping results in instant disqualification and ban.",
    "Reconnect grace period: 90 seconds per match.",
    "Disputes settled by admin within 30 minutes post-match.",
  ];
  const ruleList = rules ? rules.split("\n").filter(Boolean) : defaultRules;
  return (
    <div className="glass-card p-6">
      <h3 className="font-display text-xl">Official Rules</h3>
      <ul className="mt-4 space-y-3">
        {ruleList.map((r, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Register({ t }: { t: NonNullable<ReturnType<typeof useTournament>["tournament"]> }) {
  const { user } = useAuth();
  const { teams } = useMyTeams();
  const { register } = useMyRegistrations();
  const { submit: submitPayment, uploadProof, loading: paymentLoading } = useSubmitPayment();
  const [step, setStep] = useState(1);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [utr, setUtr] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [regId, setRegId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  if (!user) return (
    <div className="glass-card p-6 text-center">
      <p className="text-muted-foreground">Please <Link to="/login" className="text-primary hover:underline">sign in</Link> to register.</p>
    </div>
  );

  if (t.status === "Completed" || t.status === "Cancelled") return (
    <div className="glass-card p-6 text-center">
      <p className="text-muted-foreground">This tournament is {t.status.toLowerCase()} and no longer accepting registrations.</p>
    </div>
  );

  const handleRegister = async () => {
    const { error } = await register(t.id, selectedTeamId ?? undefined);
    if (error) { toast.error(error); return false; }
    return true;
  };

  const handlePaymentSubmit = async () => {
    if (!utr.trim()) { toast.error("Enter UTR number"); return; }
    let screenshotUrl: string | null = null;
    if (screenshotFile) {
      screenshotUrl = await uploadProof(screenshotFile);
    }
    const { error } = await submitPayment({
      tournament_id: t.id,
      utr_number: utr.trim(),
      screenshot_url: screenshotUrl,
      amount: t.entry_fee,
    });
    if (error) { toast.error(error); return; }
    toast.success("Payment submitted for verification!");
    setStep(5);
  };

  const proceed = async () => {
    if (step === 1) {
      if (t.mode === "Squad" && !selectedTeamId && teams.length > 0) {
        toast.error("Select a team to register");
        return;
      }
      const ok = await handleRegister();
      if (!ok) return;
      setRegId(`TX-${Math.floor(Math.random() * 90000) + 10000}`);
      if (t.entry_fee === 0) { setStep(5); return; }
    }
    setStep((s) => s + 1);
  };

  return (
    <div className="glass-card p-6">
      <div className="mb-6 flex items-center gap-2 overflow-x-auto">
        {(t.entry_fee === 0 ? ["Team", "Done"] : ["Team", "Payment", "Proof", "Done"]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${step >= i + 1 ? "gradient-primary shadow-glow text-white" : "border border-border text-muted-foreground"}`}>{i + 1}</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">{s}</span>
            {i < (t.entry_fee === 0 ? 1 : 3) && <span className="h-px w-6 bg-border" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t.mode === "Solo" ? "Solo registration — no team needed." : "Select the team you're competing with."}
          </p>
          {t.mode !== "Solo" && (
            teams.length === 0 ? (
              <div className="rounded-xl border border-border bg-black/30 p-4 text-center">
                <p className="text-sm text-muted-foreground">No teams found. <Link to="/app/my-teams" className="text-primary hover:underline">Create a team</Link> first.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeamId(team.id)}
                    className={`rounded-xl border bg-black/30 p-4 text-left transition ${selectedTeamId === team.id ? "border-primary shadow-glow" : "border-border hover:border-primary/50"}`}
                  >
                    <p className="font-display text-lg">{team.name}</p>
                    <p className="text-xs text-muted-foreground">{team.team_members.length} members · {team.game}</p>
                  </button>
                ))}
              </div>
            )
          )}
          <button
            onClick={proceed}
            className="rounded-xl gradient-primary px-5 py-2.5 text-sm font-bold shadow-glow hover:brightness-110"
          >
            {t.entry_fee === 0 ? "Register (Free)" : "Continue to Payment"}
          </button>
        </div>
      )}

      {step === 2 && t.entry_fee > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-black/30 p-6 text-center">
            <div className="mx-auto h-32 w-32 rounded-xl bg-white/10 flex items-center justify-center text-muted-foreground text-xs">QR Code</div>
            <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Scan to pay</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-black/30 p-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">UPI ID</p>
              <div className="mt-1 flex items-center justify-between">
                <code className="font-mono text-sm">tournamentx@upi</code>
                <button onClick={() => { navigator.clipboard.writeText("tournamentx@upi"); toast.success("Copied!"); }} className="rounded-lg border border-border p-2 hover:border-primary"><Copy className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="rounded-xl border border-primary/40 bg-primary/10 p-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Amount</p>
              <p className="font-display text-3xl text-gradient-primary">₹{t.entry_fee}</p>
            </div>
            <button onClick={() => setStep(3)} className="w-full rounded-xl gradient-primary py-3 text-sm font-bold shadow-glow">I've Paid — Submit Proof</button>
          </div>
        </div>
      )}

      {step === 3 && t.entry_fee > 0 && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">UTR Number</label>
            <input value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="12-digit UTR" className="tx-input" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Screenshot (optional)</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="grid place-items-center cursor-pointer rounded-xl border-2 border-dashed border-border bg-black/20 p-8 text-center text-sm text-muted-foreground hover:border-primary transition"
            >
              <Upload className="mb-2 h-6 w-6" />
              {screenshotFile ? <span className="text-success">{screenshotFile.name}</span> : "Drop or click to upload screenshot"}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setScreenshotFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="rounded-xl border border-border px-5 py-2.5 text-sm hover:border-primary">Back</button>
            <button
              onClick={handlePaymentSubmit}
              disabled={paymentLoading}
              className="flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-bold shadow-glow disabled:opacity-60"
            >
              {paymentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit For Verification"}
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="text-center py-6">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full gradient-primary shadow-glow"><Check className="h-8 w-8 text-white" /></div>
          <h3 className="mt-4 font-display text-2xl">Registration Submitted!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t.entry_fee === 0
              ? "Your free registration is submitted. Wait for admin approval."
              : "Payment submitted for verification. Admin approval usually completes in under 30 minutes."
            }
          </p>
          {regId && <p className="mt-1 text-sm text-muted-foreground">Registration ID: <span className="font-mono text-primary">{regId}</span></p>}
          <Link to="/app/my-registrations" className="mt-6 inline-block rounded-xl gradient-primary px-5 py-2.5 text-sm font-bold shadow-glow">View My Registrations</Link>
        </div>
      )}
    </div>
  );
}
