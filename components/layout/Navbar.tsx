"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, CheckCircle, User, LayoutGrid, History, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/", label: "Home", icon: LayoutGrid },
  { href: "/failures", label: "Failures", icon: Sparkles },
  { href: "/todos", label: "Todos", icon: CheckCircle },
  { href: "/profile", label: "Profile", icon: User },
];

const subNavItems = {
  failures: [
    { href: "/failures", label: "Counter", icon: Sparkles },
    { href: "/failures/timeline", label: "History", icon: History },
    { href: "/failures/stats", label: "Stats", icon: BarChart2 },
  ],
  todos: [
    { href: "/todos", label: "List", icon: CheckCircle },
    // { href: "/todos/calendar", label: "Calendar", icon: CalendarIcon },
  ],
};

export function Navbar() {
  const pathname = usePathname();

  const isFailures = pathname.startsWith("/failures");
  const isTodos = pathname.startsWith("/todos");

  const currentSubNav = isFailures ? subNavItems.failures : isTodos ? subNavItems.todos : null;

  return (
    <>
      {/* Desktop Navbar */}
      <header className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 p-2 pl-6 pr-6 justify-between items-center rounded-full glass-dark">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 font-black text-2xl text-primary transition-all hover:scale-110 drop-shadow-lg group">
            <LayoutGrid className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-pop tracking-tighter">HOME</span>
          </Link>
          <div className="h-8 w-px bg-white/10 mx-2" />
          <Link href="/failures" className="flex items-center gap-2 font-bold text-xl text-white/50 transition-all hover:text-white">
             <span className="text-pop text-sm tracking-widest uppercase">Resilience Hub</span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-1.5">
          {mainNavItems.slice(1).map((item) => { // Skip Home in the middle
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300",
                  isActive 
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.4)] scale-105" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-[0.15em] text-pop">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Sub-navigation for Modules (Desktop - Positioned Right) */}
      <AnimatePresence>
        {currentSubNav && (
          <motion.nav 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="hidden md:flex fixed top-24 right-10 z-40 flex-col gap-3 p-2 rounded-[2rem] glass-dark"
          >
            <div className="px-4 py-2 border-b border-white/10 mb-1">
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{isFailures ? "Failures" : "Todos"}</span>
            </div>
            {currentSubNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group",
                    isActive 
                      ? "bg-primary/20 text-primary border border-primary/30 shadow-lg" 
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("w-6 h-6 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                  <span className="text-sm font-black uppercase tracking-widest text-pop">{item.label}</span>
                  {isActive && (
                    <motion.div layoutId="subnav-active" className="absolute right-2 w-1.5 h-6 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50 rounded-[2rem] p-2 glass-dark">
        <div className="flex justify-around items-center">
          {mainNavItems.slice(1).map((item) => { // Skip Home on mobile bottom for cleaner 3-icon look
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-500 w-full",
                  isActive 
                    ? "bg-white/10 text-white scale-105" 
                    : "text-white/30"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive && "fill-current text-primary")} />
                <span className="text-[10px] mt-1 font-black uppercase tracking-widest leading-none">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-dot"
                    className="w-1 h-1 bg-primary rounded-full mt-1 shadow-[0_0_8px_rgba(var(--primary),1)]" 
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/profile"
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-2xl transition-all w-full",
              pathname.startsWith("/profile") ? "bg-white/10 text-white scale-105" : "text-white/30"
            )}
          >
            <User className={cn("w-6 h-6", pathname.startsWith("/profile") && "fill-current text-primary")} />
            <span className="text-[10px] mt-1 font-black uppercase tracking-widest leading-none">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

import { AnimatePresence, motion } from "framer-motion";

