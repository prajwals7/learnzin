import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/layout/AuthGuard";
import { ChatBot } from "@/components/ai/ChatBot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "ZoneIn | Modern LMS Platform",
  description: "Level up your skills with ZoneIn LMS - Build, Learn, Master.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <AuthGuard>
          {children}
        </AuthGuard>
        <ChatBot />
      </body>
    </html>
  );
}

