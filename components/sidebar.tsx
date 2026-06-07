"use client";

import { useState } from "react";

export default function Sidebar() {
  return (
    <aside className="w-72 hidden lg:flex flex-col border-r border-white/10 bg-slate-900">
      <div className="p-4 text-xl font-bold">
        AI SaaS
      </div>

      <button className="m-2 p-2 bg-blue-600 rounded-lg">
        + New Chat
      </button>

      <div className="p-3 text-sm text-gray-400">
        Conversations
      </div>
    </aside>
  );
}