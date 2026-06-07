export async function incrementUsage(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("message_count")
    .eq("id", userId)
    .single();

  await supabase
    .from("profiles")
    .update({ message_count: (data?.message_count || 0) + 1 })
    .eq("id", userId);
}