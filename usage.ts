import { supabase } from "./supabase";

export async function checkUsage(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("plan, message_count")
    .eq("id", userId)
    .single();

  if (data?.plan === "free" && data?.message_count >= 25) {
    return { allowed: false };
  }

  return { allowed: true };
}