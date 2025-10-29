import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Importe o ThemeProvider e o seu tema
import { ThemeProvider } from '@mui/material/styles';
import theme from '../app/styles/theme';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Chamados CTI",
  description: "Gerenciamento de chamados de TI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {/* 2. Envolva todo o conteúdo com o ThemeProvider */}
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}