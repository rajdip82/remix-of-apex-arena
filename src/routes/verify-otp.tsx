import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/verify-otp")({
  beforeLoad: () => { throw redirect({ to: "/login" }); },
  component: () => null,
});
