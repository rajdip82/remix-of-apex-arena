import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swords, User, Loader2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

export const Route = createFileRoute("/app/profile-setup")({
  head: () => ({ meta: [{ title: "Setup Profile — TournamentX" }] }),
  component: ProfileSetup,
});

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

function ProfileSetup() {
  const { user, loading } = useAuth();
  const { updateProfile, saving } = useProfile();
  const nav = useNavigate();

  const [form, setForm] = useState({
    username: "",
    full_name: "",
    free_fire_uid: "",
    bgmi_uid: "",
    favorite_game: "" as "Free Fire MAX" | "BGMI" | "",
    state: "",
  });

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim()) { toast.error("Username is required"); return; }
    if (form.username.length < 3) { toast.error("Username must be at least 3 characters"); return; }
    const err = await updateProfile({
      username: form.username.trim().toLowerCase(),
      full_name: form.full_name.trim() || null,
      free_fire_uid: form.free_fire_uid.trim() || null,
      bgmi_uid: form.bgmi_uid.trim() || null,
      favorite_game: (form.favorite_game || null) as "Free Fire MAX" | "BGMI" | null,
      state: form.state || null,
    });
    if (err) {
      if (err.message.includes("unique")) {
        toast.error("Username already taken. Try another.");
      } else {
        toast.error(err.message);
      }
    } else {
      toast.success("Profile set up! Welcome to TournamentX.");
      nav({ to: "/app/home" });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ background: "var(--gradient-radial)" }} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg"
      >
        <div className="mb-8 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary shadow-glow mx-auto">
            <Swords className="h-7 w-7" />
          </span>
          <h1 className="mt-4 font-display text-4xl">Set Up Your Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">Tell us who you are before entering the arena.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card-strong space-y-5 p-6 sm:p-8">
          <Field label="Username *" hint="Your public gamer tag (lowercase, no spaces)">
            <input
              required
              value={form.username}
              onChange={(e) => set("username", e.target.value.toLowerCase().replace(/\s/g, ""))}
              placeholder="shadowblade99"
              className="tx-input"
            />
          </Field>

          <Field label="Full Name">
            <input
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              placeholder="Arjun Sharma"
              className="tx-input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Free Fire MAX UID">
              <input
                value={form.free_fire_uid}
                onChange={(e) => set("free_fire_uid", e.target.value.replace(/\D/g, ""))}
                placeholder="123456789"
                className="tx-input"
              />
            </Field>
            <Field label="BGMI UID">
              <input
                value={form.bgmi_uid}
                onChange={(e) => set("bgmi_uid", e.target.value.replace(/\D/g, ""))}
                placeholder="5544332211"
                className="tx-input"
              />
            </Field>
          </div>

          <Field label="Favourite Game">
            <select
              value={form.favorite_game}
              onChange={(e) => set("favorite_game", e.target.value)}
              className="tx-input"
            >
              <option value="">Select a game</option>
              <option value="Free Fire MAX">Free Fire MAX</option>
              <option value="BGMI">BGMI</option>
            </select>
          </Field>

          <Field label="State">
            <select
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
              className="tx-input"
            >
              <option value="">Select your state</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-bold uppercase tracking-widest shadow-glow transition hover:brightness-110 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Enter the Arena <ChevronRight className="h-4 w-4" /></>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground/60">{hint}</p>}
    </div>
  );
}
