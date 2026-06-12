import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { TournamentCard } from "@/components/site/TournamentCard";
import { tournaments } from "@/lib/mock-data";
import { Filter } from "lucide-react";

export const Route = createFileRoute("/tournaments")({
  head: () => ({
    meta: [
      { title: "Tournaments — TournamentX" },
      { name: "description", content: "Browse all live and upcoming Free Fire MAX & BGMI tournaments." },
    ],
  }),
  component: TournamentsPage,
});

function TournamentsPage() {
  const [game, setGame] = useState<"all" | "Free Fire MAX" | "BGMI">("all");
  const [status, setStatus] = useState<"all" | "Live" | "Upcoming" | "Completed">("all");

  const list = tournaments.filter((t) =>
    (game === "all" || t.game === game) && (status === "all" || t.status === status)
  );

  return (
    <div className="bg-background pt-24">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">All Battles</p>
          <h1 className="font-display text-5xl sm:text-6xl">Tournament <span className="text-gradient-primary">Arena</span></h1>
          <p className="max-w-xl text-muted-foreground">Filter by game, mode, and status to find your next match.</p>
        </header>

        <div className="glass-card mt-8 flex flex-wrap items-center gap-3 p-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <FilterGroup label="Game" value={game} onChange={(v) => setGame(v as typeof game)} options={["all", "Free Fire MAX", "BGMI"]} />
          <FilterGroup label="Status" value={status} onChange={(v) => setStatus(v as typeof status)} options={["all", "Live", "Upcoming", "Completed"]} />
          <div className="ml-auto text-xs text-muted-foreground">{list.length} tournaments</div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t, i) => <TournamentCard key={t.id} t={t} index={i} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FilterGroup({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex items-center gap-1">
      <span className="hidden text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">{label}:</span>
      <div className="flex gap-1 overflow-x-auto">
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${value === o ? "gradient-primary shadow-glow text-white" : "border border-border text-muted-foreground hover:border-primary hover:text-foreground"}`}>
            {o === "all" ? "All" : o}
          </button>
        ))}
      </div>
    </div>
  );
}
