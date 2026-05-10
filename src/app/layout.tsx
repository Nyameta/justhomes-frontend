import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  title: "JustHomes — Find Your Perfect Home in Kenya",
  description: "AI-powered property discovery for Kenya.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}