import "./globals.css";

export const metadata = {
  title: "AI SaaS Platform",
  description: "ChatGPT-style business AI system"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b1120] text-white">
        {children}
      </body>
    </html>
  );
}