import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import React from "react";
import { Provider } from "./provider";
import Navbar from "@/components/navbar/navbar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Planora",
  description: "AI-Powered House Planning & Blueprint Generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressContentEditableWarning
      suppressHydrationWarning
      lang="en"
      className={`h-full antialiased ${inter.variable} ${playfair.variable}`}
    >
      <body className="min-h-full flex flex-col bg-slate-950  text-white font-inter">
        <Provider>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
