"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Bell, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TopBar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 w-full sticky top-0 z-10 shrink-0">
      <SidebarTrigger />
      <div className="flex-1 flex items-center">
        <div className="relative max-w-md w-full ml-auto md:ml-0 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search employees, meetings..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          HR Assistant
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 border border-background"></span>
        </Button>
        <Avatar className="h-8 w-8 ml-2">
          <AvatarImage src="https://ui.shadcn.com/avatars/01.png" alt="Avatar" />
          <AvatarFallback>CXO</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
