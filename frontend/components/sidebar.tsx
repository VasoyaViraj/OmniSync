"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, PlusCircle, LogOut } from "lucide-react";
import { clearSession } from "../lib/auth";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/meetings/create", label: "New Meeting", icon: PlusCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-[oklch(0.88_0_0)] h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[oklch(0.88_0_0)]">
        <span className="text-[15px] font-semibold tracking-tight text-[oklch(0.18_0_0)]">
          OmniSync
        </span>
        <span className="ml-1.5 text-[10px] font-medium text-[oklch(0.62_0.16_250)] bg-[oklch(0.62_0.16_250)]/10 px-1.5 py-0.5 rounded-full uppercase tracking-widest">
          AI
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
              isActive(href)
                ? "bg-[oklch(0.12_0_0)] text-white"
                : "text-[oklch(0.45_0_0)] hover:bg-[oklch(0.95_0_0)] hover:text-[oklch(0.18_0_0)]"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[oklch(0.88_0_0)]">
        <button
          onClick={() => { clearSession(); router.push("/login"); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[oklch(0.52_0_0)] hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
