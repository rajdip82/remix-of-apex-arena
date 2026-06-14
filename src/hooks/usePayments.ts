import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type PaymentSubmission = Tables<"payment_submissions"> & {
  tournaments: Tables<"tournaments"> | null;
  profiles: Tables<"profiles"> | null;
};

export function useAdminPayments() {
  const [payments, setPayments] = useState<PaymentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const { data, error } = await supabase
        .from("payment_submissions")
        .select("*, tournaments(*), profiles(*)")
        .order("created_at", { ascending: false });
      if (!error && data) setPayments(data as PaymentSubmission[]);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const approve = async (id: string, adminId: string) => {
    try {
      const { error } = await supabase
        .from("payment_submissions")
        .update({ payment_status: "approved", verified_by: adminId })
        .eq("id", id);
      if (!error) fetch();
      return error;
    } catch (e: any) { return e; }
  };

  const reject = async (id: string, adminId: string) => {
    try {
      const { error } = await supabase
        .from("payment_submissions")
        .update({ payment_status: "rejected", verified_by: adminId })
        .eq("id", id);
      if (!error) fetch();
      return error;
    } catch (e: any) { return e; }
  };

  return { payments, loading, approve, reject, refetch: fetch };
}

export function useSubmitPayment() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const submit = async (data: Omit<TablesInsert<"payment_submissions">, "user_id">) => {
    if (!user) return { error: "Not authenticated" };
    setLoading(true);
    try {
      const { error } = await supabase
        .from("payment_submissions")
        .insert({ ...data, user_id: user.id });
      return { error: error?.message ?? null };
    } catch (e: any) {
      return { error: e?.message ?? "Unknown error" };
    } finally {
      setLoading(false);
    }
  };

  const uploadProof = async (file: File): Promise<string | null> => {
    if (!user) return null;
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("payment-proofs").upload(path, file);
      if (error) return null;
      const { data } = supabase.storage.from("payment-proofs").getPublicUrl(path);
      return data.publicUrl;
    } catch (_) { return null; }
  };

  return { submit, uploadProof, loading };
}
