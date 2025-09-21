import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Banco Colaborativo de Recursos Didáticos",
  description: "Plataforma para compartilhamento de materiais educacionais entre professores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
