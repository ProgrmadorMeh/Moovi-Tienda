
import type { Metadata } from "next";
import { Poppins, PT_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-provider";
import ParticlesComponent from "@/app/Js/animacion_particula.jsx";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-headline",
  display: 'swap',
});

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "MooviTech",
  description:
    "Explora lo último en tecnología móvil con MooviTech. Encuentra el smartphone perfecto para tu estilo de vida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={cn(
          "min-h-screen font-body antialiased bg-background",
          poppins.variable,
          ptSans.variable
        )}
      >
        <AuthProvider>
          <div className="relative flex min-h-dvh flex-col">
            <ParticlesComponent />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
