"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { getSession } from "../lib/auth";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const session = getSession();
      if (!session && pathname !== "/login") {
        router.push("/login");
      } else {
        setIsAuthenticated(session);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  // If on login page, just render children without sidebar/navbar
  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
