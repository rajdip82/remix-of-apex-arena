import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Tournament = Tables<"tournaments">;
export type Registration = Tables<"registrations"> & {
  tournaments: Tournament | null;
  teams: Tables<"teams"> | null;
};

export function useTournaments(status?: Tournament["status"]) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub: ReturnType<typeof supabase.channel> | null = null;

    const load = async () => {
      try {
        let q = supabase.from("tournaments").select("*").order("start_time", { ascending: true });
        if (status) q = q.eq("status", status);
        const { data, error } = await q;
        if (!error && data) setTournaments(data as Tournament[]);
      } catch (_) {}
      setLoading(false);
    };

    load();

    try {
      sub = supabase
        .channel("tournaments-changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "tournaments" }, load)
        .subscribe();
    } catch (_) {}

    return () => { try { sub?.unsubscribe(); } catch (_) {} };
  }, [status]);

  return { tournaments, loading };
}

export function useTournament(id: string) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.from("tournaments").select("*").eq("id", id).single();
        if (!error && data) setTournament(data as Tournament);
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, [id]);

  return { tournament, loading };
}

export function useMyRegistrations() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setRegistrations([]); setLoading(false); return; }
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("registrations")
          .select("*, tournaments(*), teams(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (!error && data) setRegistrations(data as Registration[]);
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, [user?.id]);

  const register = async (tournamentId: string, teamId?: string | null) => {
    if (!user) return { error: "Not logged in" };
    try {
      const insert: TablesInsert<"registrations"> = {
        tournament_id: tournamentId,
        user_id: user.id,
        team_id: teamId ?? null,
      };
      const { error } = await supabase.from("registrations").insert(insert);
      return { error: error?.message ?? null };
    } catch (e: any) {
      return { error: e?.message ?? "Unknown error" };
    }
  };

  return { registrations, loading, register };
}

export function useAdminTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setTournaments(data as Tournament[]);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const createTournament = async (data: TablesInsert<"tournaments">) => {
    try {
      const { error } = await supabase.from("tournaments").insert(data);
      if (!error) fetch();
      return error;
    } catch (e: any) { return e; }
  };

  const updateTournament = async (id: string, data: Partial<Tournament>) => {
    try {
      const { error } = await supabase.from("tournaments").update(data).eq("id", id);
      if (!error) fetch();
      return error;
    } catch (e: any) { return e; }
  };

  return { tournaments, loading, createTournament, updateTournament, refetch: fetch };
}
