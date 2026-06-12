import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { notifications } from "@/lib/mock-data";
import { Bell, Trophy, ClipboardCheck, KeyRound, Megaphone, Settings as SettingsIcon } from "lucide-react";

const iconMap = {
  tournament: Trophy,
  registration: ClipboardCheck,
  room: KeyRound,
  result: Bell,
  system: SettingsIcon,
} as const;

export const Route = createFileRoute("/app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — TournamentX" }] }),
  component: () => (
    <AppShell title="Notifications">
      <div className="glass-card divide-y divide-border">
        {notifications.map((n) => {
          const Icon = iconMap[n.type] ?? Megaphone;
          return (
            <div key={n.id} className={`flex items-start gap-4 p-5 ${!n.read ? "bg-primary/5" : ""}`}>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${!n.read ? "gradient-primary shadow-glow" : "border border-border bg-black/30 text-muted-foreground"}`}><Icon className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary shadow-glow" />}
                </div>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  ),
});
