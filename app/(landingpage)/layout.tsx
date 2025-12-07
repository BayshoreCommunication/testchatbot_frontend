import { auth } from "@/auth";
import Footer from "@/components/landingPage/Footer";
import Navbar from "@/components/landingPage/Navbar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Assistant",
  description: "Your intelligent workflow partner",
};

export default async function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // Transform user to match Navbar's expected type
  const safeUser = session?.user
    ? {
        email: session.user.email || undefined,
        name: session.user.name === null ? undefined : session.user.name,
        companyName: session.user.companyName,
        avatar: session.user.avatar,
      }
    : null;

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
    >
      <Navbar
        isAuthenticated={!!session}
        user={safeUser}
        glowAnimation={null}
      />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
