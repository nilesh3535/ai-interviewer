import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Interviewer: AI-Powered Real-Time Interview Platform for Smarter Hiring",
  description: "Interviewer.AI is an intelligent voice-driven interview platform that helps companies assess candidates in real time using conversational AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ overflowY: "scroll" }}>
      <head>
        <style>
          {`
            ::-webkit-scrollbar {
              width: 12px;
            }

            ::-webkit-scrollbar-track {
              background: transparent;
            }

            ::-webkit-scrollbar-thumb {
              background-color: #3B82F6; /* Tailwind blue-500 */
              border-radius: 8px;
              border: 2px solid transparent;
              background-clip: content-box;
            }

            ::-webkit-scrollbar-thumb:hover {
              background-color: #2563EB; /* Tailwind blue-600 */
            }

            /* Firefox support */
            html {
              scrollbar-width: thin;
              scrollbar-color: #3B82F6 transparent;
            }
          `}
        </style>
      </head>
      <body className={`${monaSans.variable} antialiased pattern`}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
