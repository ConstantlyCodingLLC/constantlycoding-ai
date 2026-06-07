"use client";

import { useState } from "react";

export default function ChatInput({ messages, setMessages }: any) {
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input }
    ];

    setMessages(newMessages);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "assistant", content: data.reply }
    ]);
  };

  return (
    <div className="p-3 border-t border-white/10 flex gap-2">
      <input
        className="flex-1 p-2 bg-slate-900 rounded-lg"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything..."
      />

      <button
        onClick={sendMessage}
        className="bg-blue-600 px-4 rounded-lg"
      >
        Send
      </button>
    </div>
  );
}