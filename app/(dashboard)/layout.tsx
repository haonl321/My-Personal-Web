"use client"

import { Navbar } from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isTodos = pathname.startsWith("/todos");
  const isProfile = pathname.startsWith("/profile");
  const isHub = pathname === "/";
  const bgImage = isHub ? "/image4.png" : isTodos ? "/image3.png" : isProfile ? "/image6.png" : "/image1.png";

  return (
    <div 
      className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/30 transition-all duration-1000"
      style={{
        backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0) 0%, var(--background) 100%), url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Darken Overlay for busy backgrounds - reduced for more brightness */}
      <div className="fixed inset-0 bg-black/15 pointer-events-none" />

      {/* Immersive Depth Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-30%] left-[20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen" style={{ animationDelay: "3s" }} />
      </div>

      <Navbar />

      <main className="relative z-10 container mx-auto px-4 py-20 md:py-24 max-w-4xl min-h-screen flex flex-col items-center">
        {children}
      </main>
    </div>
  );
}
