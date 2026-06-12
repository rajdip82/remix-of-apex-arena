import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { LeaderboardTable } from "@/components/site/LeaderboardTable";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — TournamentX" },
      { name: "description", content: "Top Free Fire MAX & BGMI players ranked by points, kills, and win rate." },
    ],
  }),
  component: () => (
    <div className="bg-background pt-24">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Hall of Fame</p>
          <h1 className="font-display text-5xl sm:text-6xl">Global <span className="text-gradient-primary">Leaderboard</span></h1>
        </header>
        <div className="mt-8"><LeaderboardTable /></div>
      </main>
      <Footer />
    </div>
  ),
});
