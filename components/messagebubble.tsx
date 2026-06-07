export default function MessageBubble({ role, content }: any) {
  return (
    <div
      className={`max-w-2xl p-3 rounded-2xl ${
        role === "user"
          ? "ml-auto bg-blue-600/20"
          : "bg-slate-800"
      }`}
    >
      {content}
    </div>
  );
}