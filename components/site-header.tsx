import { siteConfig } from "@/config/site";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";

import MobileNav from "./mobile-nav";
import Profile from "./profile";
import SideNav from "./side-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center space-x-4 px-4 sm:container sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <DropdownMenu>
          <DropdownMenuTrigger className="block font-bold md:hidden">
            PlayLater
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <MobileNav />
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Profile />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
