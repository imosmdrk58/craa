import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multilingual Graphic Novel Reader",
  description: "Read and learn languages through interactive graphic novels",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <AuthProvider>
          <Navigation />
          <main className="min-h-full pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
