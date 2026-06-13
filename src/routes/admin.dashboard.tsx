import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { motion } from "framer-motion";
import { Swords, Users, Wallet, Ticket, TrendingUp, CheckCircle2, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — TX Admin" }] }),
  component: AdminDashboard,
});

interface Stats {
  totalUsers: number;
  totalTournaments: number;
  liveTournaments: number;
  pendingPayments: number;
  approvedPayments: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  totalPrize: number;
  activeRedeemCodes: number;
}

function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, totalTournaments: 0, liveTournaments: 0,
    pendingPayments: 0, approvedPayments: 0, pendingRegistrations: 0,
    approvedRegistrations: 0, totalPrize: 0, activeRedeemCodes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [
        { count: totalUsers },
        { data: tournaments },
        { count: pendingPayments },
        { count: approvedPayments },
        { count: pendingReg },
        { count: approvedReg },
        { count: activeCodes },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("tournaments").select("prize_pool, status"),
        supabase.from("payment_submissions").select("*", { count: "exact", head: true }).eq("payment_status", "pending"),
        supabase.from("payment_submissions").select("*", { count: "exact", head: true }).eq("payment_status", "approved"),
        supabase.from("registrations").select("*", { count: "exact", head: true }).eq("registration_status", "pending"),
        supabase.from("registrations").select("*", { count: "exact", head: true }).eq("registration_status", "approved"),
        supabase.from("redeem_codes").select("*", { count: "exact", head: true }).eq("status", true),
      ]);

      const totalPrize = (tournaments ?? []).reduce((a, t) => a + (t.prize_pool ?? 0), 0);
      const liveTournaments = (tournaments ?? []).filter((t) => t.status === "Live").length;

      setStats({
        totalUsers: totalUsers ?? 0,
        totalTournaments: (tournaments ?? []).length,
        liveTournaments,
        pendingPayments: pendingPayments ?? 0,
        approvedPayments: approvedPayments ?? 0,
        pendingRegistrations: pendingReg ?? 0,
        approvedRegistrations: approvedReg ?? 0,
        totalPrize,
        activeRedeemCodes: activeCodes ?? 0,
      });
      setLoading(false);
    };
    load();
  }, []);

  const kpis = [
    { icon: Users, label: "Total Players", value: stats.totalUsers.toLocaleString("en-IN"), color: "text-primary" },
    { icon: Swords, label: "Tournaments", value: String(stats.totalTournaments), sub: `${stats.liveTournaments} live`, color: "text-success" },
    { icon: TrendingUp, label: "Total Prize Pool", value: `₹${stats.totalPrize.toLocaleString("en-IN")}`, color: "text-warning" },
    { icon: Ticket, label: "Active Codes", value: String(stats.activeRedeemCodes), color: "text-accent" },
  ];

  const actionItems = [
    { icon: Clock, label: "Pending Payments", value: stats.pendingPayments, href: "/admin/payments", color: "text-warning", urgent: stats.pendingPayments > 0 },
    { icon: CheckCircle2, label: "Approved Payments", value: stats.approvedPayments, href: "/admin/payments", color: "text-success", urgent: false },
    { icon: Clock, label: "Pending Registrations", value: stats.pendingRegistrations, href: "/admin/approvals", color: "text-warning", urgent: stats.pendingRegistrations > 0 },
    { icon: CheckCircle2, label: "Approved Registrations", value: stats.approvedRegistrations, href: "/admin/approvals", color: "text-success", urgent: false },
  ];

  return (
    <AdminShell title="Dashboard">
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-card h-24 animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((k, i) => (
              <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{k.label}</p>
                    <p className={`mt-1 font-display text-3xl ${k.color}`}>{k.value}</p>
                    {k.sub && <p className="text-xs text-muted-foreground">{k.sub}</p>}
                  </div>
                  <span className={`grid h-12 w-12 place-items-center rounded-xl bg-white/5 ${k.color}`}><k.icon className="h-6 w-6" /></span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {actionItems.map((a) => (
              <motion.a
                key={a.label}
                href={a.href}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`glass-card flex items-center gap-4 p-5 transition hover:border-primary/40 ${a.urgent ? "border-warning/30" : ""}`}
              >
                <span className={`grid h-11 w-11 place-items-center rounded-xl bg-white/5 ${a.color}`}><a.icon className="h-5 w-5" /></span>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{a.label}</p>
                  <p className={`font-display text-2xl ${a.color}`}>{a.value}</p>
                </div>
                {a.urgent && a.value > 0 && (
                  <span className="rounded-full bg-warning px-2 py-0.5 text-[10px] font-bold text-black">Action needed</span>
                )}
              </motion.a>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
