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

  const fetch = () => {
    supabase
      .from("payment_submissions")
      .select("*, tournaments(*), profiles(*)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPayments((data ?? []) as PaymentSubmission[]);
        setLoading(false);
      });
  };

  useEffect(() => { fetch(); }, []);

  const approve = async (id: string, adminId: string) => {
    const { error } = await supabase
      .from("payment_submissions")
      .update({ payment_status: "approved", verified_by: adminId })
      .eq("id", id);
    if (!error) fetch();
    return error;
  };

  const reject = async (id: string, adminId: string) => {
    const { error } = await supabase
      .from("payment_submissions")
      .update({ payment_status: "rejected", verified_by: adminId })
      .eq("id", id);
    if (!error) fetch();
    return error;
  };

  return { payments, loading, approve, reject, refetch: fetch };
}

export function useSubmitPayment() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const submit = async (data: Omit<TablesInsert<"payment_submissions">, "user_id">) => {
    if (!user) return { error: "Not authenticated" };
    setLoading(true);
    const { error } = await supabase
      .from("payment_submissions")
      .insert({ ...data, user_id: user.id });
    setLoading(false);
    return { error: error?.message ?? null };
  };

  const uploadProof = async (file: File): Promise<string | null> => {
    if (!user) return null;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("payment-proofs")
      .upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from("payment-proofs").getPublicUrl(path);
    return data.publicUrl;
  };

  return { submit, uploadProof, loading };
}
