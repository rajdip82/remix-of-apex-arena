import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up — TournamentX" }] }),
  component: () => <AuthShell mode="signup" />,
});
