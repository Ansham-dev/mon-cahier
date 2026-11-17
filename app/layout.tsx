import type { Metadata } from "next";
import "./globals.css";
import { ProgressProvider } from "@/lib/progress";
import { AudioProvider } from "@/lib/audio";
import PlayerBar from "@/components/PlayerBar";
import { Toasts } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mon Cahier de Français",
  description: "A cozy pixel-art French study town. Apprendre. Réviser. Réussir.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ProgressProvider>
          <AudioProvider>
            {children}
            <PlayerBar />
            <Toasts />
          </AudioProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
