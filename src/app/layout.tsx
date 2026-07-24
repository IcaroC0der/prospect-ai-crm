import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProspectAI CRM",
  description: "CRM Inteligente para Prospecção Comercial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="h-screen flex font-sans bg-[var(--background)] text-[var(--foreground)] overflow-hidden transition-colors">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Sidebar />
          <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[var(--background)]">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
