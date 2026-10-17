"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSection } from "@/types/dashboard.interface";
import { UserInfo } from "@/types/user.interface";
import { Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import UserDropdown from "./UserDropdown";

interface DashboardNavbarContentProps {
  userInfo: UserInfo;
  navItems?: NavSection[];
  dashboardHome?: string;
}

const DashboardNavbarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardNavbarContentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#f0ece4] bg-white/92 backdrop-blur-md shadow-[0_1px_12px_rgba(0,0,0,0.06)]">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* ── Mobile Menu ── */}
        <Sheet open={isMobile && isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border-[#e5e0d8] bg-white hover:bg-amber-50 hover:border-amber-200 transition-colors"
            >
              <Menu className="h-6 w-6 cursor-pointer" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <DashboardMobileSidebar
              userInfo={userInfo}
              navItems={navItems || []}
              dashboardHome={dashboardHome || ""}
              onClose={() => setIsOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* ── Search ── */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="relative hidden w-full max-w-sm sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search doctors by symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[38px] w-full rounded-xl border border-[#e5e0d8] bg-[#fafaf8] pl-9 pr-4 text-sm text-gray-700 placeholder:text-[#b0a99a] outline-none transition-all focus:border-amber-400 focus:bg-white focus:ring-3 focus:ring-amber-400/12"
            />
          </div>
        </div>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2">
          {/* <NotificationDropdown /> */}
          <UserDropdown userInfo={userInfo} />
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbarContent;
