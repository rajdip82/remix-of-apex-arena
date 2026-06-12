import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { LeaderboardTable } from "@/components/site/LeaderboardTable";

export const Route = createFileRoute("/app/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — TournamentX" }] }),
  component: () => <AppShell title="Leaderboard"><LeaderboardTable /></AppShell>,
});
