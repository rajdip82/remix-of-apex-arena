import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Bell, CheckCheck, Loader2, Trophy, Wallet, Shield, Star, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — TournamentX" }] }),
  component: Notifications,
});

const typeIcon: Record<string, React.ElementType> = {
  tournament: Trophy,
  registration: CheckCheck,
  room: Shield,
  result: Star,
  system: Info,
  payment: Wallet,
};

const typeColor: Record<string, string> = {
  tournament: "text-primary",
  registration: "text-success",
  room: "text-accent",
  result: "text-warning",
  system: "text-muted-foreground",
  payment: "text-primary",
};

function Notifications() {
  const { user, loading: authLoading } = useAuth();
  const { notifications, loading, unreadCount, markRead, markAllRead } = useNotifications();
  const nav = useNavigate();

  useEffect(() => { if (!authLoading && !user) nav({ to: "/login" }); }, [user, authLoading]);

  return (
    <AppShell title="Notifications">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
        </p>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs hover:border-primary transition">
            <CheckCheck className="h-3 w-3" /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : notifications.length === 0 ? (
        <div className="mt-10 py-20 text-center glass-card">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 font-display text-2xl">No Notifications</h3>
          <p className="mt-2 text-sm text-muted-foreground">You're all caught up. Check back after registering for a tournament.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {notifications.map((n) => <NotificationCard key={n.id} n={n} onRead={markRead} />)}
        </div>
      )}
    </AppShell>
  );
}

function NotificationCard({ n, onRead }: { n: Tables<"notifications">; onRead: (id: string) => void }) {
  const Icon = typeIcon[n.type] ?? Info;
  const color = typeColor[n.type] ?? "text-muted-foreground";
  const ago = getAgo(n.created_at);

  return (
    <div
      onClick={() => { if (!n.read) onRead(n.id); }}
      className={`flex cursor-pointer gap-4 rounded-xl border p-4 transition hover:border-primary/40 ${n.read ? "border-border bg-black/10 opacity-70" : "border-primary/20 bg-primary/5"}`}
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-black/30 ${color}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight">{n.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.message}</p>
        <p className="mt-1.5 text-[10px] text-muted-foreground/60">{ago}</p>
      </div>
      {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
    </div>
  );
}

function getAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
