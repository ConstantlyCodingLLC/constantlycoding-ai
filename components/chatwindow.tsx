"use client";

import { useState } from "react";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

export default function ChatWindow() {
  const [messages, setMessages] = useState<any[]>([]);

  return (
    <div className="flex flex-col flex-1 h-screen">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
      </div>

      {/* Input */}
      <ChatInput setMessages={setMessages} messages={messages} />

    </div>
  );
}