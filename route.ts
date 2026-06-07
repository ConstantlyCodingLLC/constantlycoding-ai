import { NextResponse } from "next/server";
import { checkUsage, incrementUsage } from "@/lib/usage";

export async function POST(req: Request) {
  const { message, userId } = await req.json();

  // LIMIT CHECK
  const allowed = await checkUsage(userId);
  if (!allowed.allowed) {
    return NextResponse.json(
      { error: "Upgrade to Pro ($21.99/month)" },
      { status: 403 }
    );
  }

  // CALL OPENAI
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a production SaaS AI assistant that can answer deeply and perform business tasks."
        },
        { role: "user", content: message }
      ]
    })
  });

  const data = await res.json();

  // INCREMENT USAGE
  await incrementUsage(userId);

  return NextResponse.json({
    reply: data.choices[0].message.content
  });
}