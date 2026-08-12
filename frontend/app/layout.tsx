import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { PatientsProvider } from "@/lib/patients-context";
import { SocketProvider } from "@/lib/socket-context";

export const metadata: Metadata = {
  title: "AI-Path Assist | Precision Pathology at Scale",
  description: "Multi-modal clinical pathology intelligence platform — AI-assisted IHC biomarker prediction, Grad-CAM explainability, and secure diagnostic workflows.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background min-h-screen">
        <AuthProvider>
          <SocketProvider>
            <PatientsProvider>{children}</PatientsProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
