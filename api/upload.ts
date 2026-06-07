import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const filePath = `${Date.now()}-${file.name}`;

  const { data } = await supabase.storage
    .from("uploads")
    .upload(filePath, file);

  return NextResponse.json({ url: data?.path });
}