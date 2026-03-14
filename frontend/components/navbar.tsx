"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/": "Overview",
  "/employees": "Employees",
  "/meetings/create": "New Meeting",
};

function getTitle(pathname: string) {
  if (pathname === "/") return "Overview";
  if (pathname.startsWith("/employees/") && pathname.split("/").length === 3) return "Employee";
  if (pathname.startsWith("/employees")) return "Employees";
  if (pathname.startsWith("/meetings/create")) return "New Meeting";
  if (pathname.startsWith("/meetings/")) return "Meeting";
  return "OmniSync";
}

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="h-16 bg-white/90 backdrop-blur border-b border-[oklch(0.88_0_0)] sticky top-0 z-10 flex items-center justify-between px-8">
      <p className="text-[15px] font-semibold text-[oklch(0.18_0_0)]">{getTitle(pathname)}</p>
      <div className="flex items-center gap-2 text-[12px] text-[oklch(0.52_0_0)]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
        HR Portal · Connected
      </div>
    </header>
  );
}
