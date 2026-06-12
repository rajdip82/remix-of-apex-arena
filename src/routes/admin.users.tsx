import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminUsers } from "@/lib/mock-data";
import { Search, ShieldCheck, ShieldOff } from "lucide-react";
import { StatusBadge } from "../routes/app.home";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Admin · Users" }] }),
  component: () => (
    <AdminShell title="Users">
      <div className="glass-card flex items-center gap-2 p-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input className="flex-1 bg-transparent text-sm outline-none" placeholder="Search by username, email, or UID..." />
      </div>
      <div className="mt-6 glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-black/30 text-left text-[10px] uppercase tracking-widest text-muted-foreground"><th className="p-3">User</th><th className="p-3">Email</th><th className="p-3">Joined</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr></thead>
          <tbody>
            {adminUsers.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${u.username}`} className="h-9 w-9 rounded-full bg-surface" />
                    <div>
                      <p className="font-semibold">{u.username}</p>
                      {u.verified && <span className="text-[10px] text-success">Verified</span>}
                    </div>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3 text-muted-foreground">{u.joined}</td>
                <td className="p-3"><StatusBadge status={u.status} /></td>
                <td className="p-3 text-right space-x-1">
                  <button className="rounded-lg border border-border p-1.5 hover:border-success"><ShieldCheck className="h-3.5 w-3.5" /></button>
                  <button className="rounded-lg border border-border p-1.5 hover:border-danger"><ShieldOff className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  ),
});
