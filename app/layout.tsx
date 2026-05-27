import type { ReactNode } from "react";
import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "@/app/globals.css";
import "@/styles/leaflet-overrides.css";
import { AppHeader } from "@/components/app-header";
import { DemoPlatformProvider } from "@/components/providers/demo-platform-provider";

export const metadata: Metadata = {
  title: "AgroSphere GIS Portal",
  description:
    "MVP GIS portal for precision farming, smart agriculture analytics, and agricultural decision support."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-ink font-body">
        <DemoPlatformProvider>
          <div className="relative min-h-screen">
            <AppHeader />
            <main className="mx-auto flex w-full max-w-[1920px] flex-col px-3 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6 lg:px-8 2xl:px-10">
              {children}
            </main>
          </div>
        </DemoPlatformProvider>
      </body>
    </html>
  );
}
