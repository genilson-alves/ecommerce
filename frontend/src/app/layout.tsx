import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import Providers from "./providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ECOMMERCE | Curated Essentials",
  description: "High-end minimalist digital shop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-deep-olive selection:text-bone`}
      >
        <Providers>
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: "bg-bone border-sage text-deep-olive rounded-none font-bold uppercase tracking-widest text-[10px]",
            }}
          />
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
