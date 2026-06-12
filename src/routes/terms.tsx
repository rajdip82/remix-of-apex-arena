import { createFileRoute } from "@tanstack/react-router";
import { Legal } from "./privacy-policy";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — TournamentX" }] }),
  component: () => <Legal title="Terms of Service" body="By using TournamentX you agree to fair play rules, accurate UID submission, and admin verification authority for results and refunds. Entry fees are non-refundable once a tournament starts. Cheating, account sharing, or stream sniping result in permanent ban without refund. Full ruleset published per-tournament." />,
});
