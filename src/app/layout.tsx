import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CopyZap Clone - Copy que fecha venda",
  description: "Gerador de copy inteligente focado em WhatsApp e Instagram.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-background text-foreground selection:bg-brand-orange selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
