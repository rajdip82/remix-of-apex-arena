import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { TournamentCard } from "@/components/site/TournamentCard";
import { tournaments } from "@/lib/mock-data";
import { Filter, ArrowDownUp } from "lucide-react";

export const Route = createFileRoute("/app/tournaments")({
  head: () => ({ meta: [{ title: "Tournaments — TournamentX" }] }),
  component: AppTournaments,
});

function AppTournaments() {
  const [game, setGame] = useState<"all" | "Free Fire MAX" | "BGMI">("all");
  const [mode, setMode] = useState<"all" | "Solo" | "Duo" | "Squad">("all");
  const [sort, setSort] = useState<"newest" | "prize" | "soon">("soon");

  let list = tournaments.filter((t) => (game === "all" || t.game === game) && (mode === "all" || t.mode === mode));
  list = [...list].sort((a, b) => sort === "prize" ? b.prizePool - a.prizePool : sort === "soon" ? new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime() : 0);

  return (
    <AppShell title="Tournaments">
      <div className="glass-card flex flex-wrap items-center gap-3 p-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Chips value={game} onChange={(v) => setGame(v as typeof game)} options={["all", "Free Fire MAX", "BGMI"]} />
        <Chips value={mode} onChange={(v) => setMode(v as typeof mode)} options={["all", "Solo", "Duo", "Squad"]} />
        <div className="ml-auto flex items-center gap-2">
          <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-lg border border-border bg-black/30 px-2 py-1.5 text-xs">
            <option value="soon">Starting Soon</option>
            <option value="prize">Highest Prize</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t, i) => <TournamentCard key={t.id} t={t} index={i} />)}
      </div>
    </AppShell>
  );
}

function Chips({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex gap-1 overflow-x-auto">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${value === o ? "gradient-primary shadow-glow text-white" : "border border-border text-muted-foreground hover:border-primary hover:text-foreground"}`}>
          {o === "all" ? "All" : o}
        </button>
      ))}
    </div>
  );
}
