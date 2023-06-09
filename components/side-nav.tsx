"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

export default function SideNav() {
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <div className="hidden h-screen border-r bg-background py-4 pr-6 md:block">
      {siteConfig.sideNav.map((nav) => {
        const isActive = pathname.startsWith(nav.href);
        return (
          <nav className="flex-col md:flex" key={nav.title}>
            <Link href={nav.href}>
              <Button variant="link" className={cn({ "font-bold": isActive })}>
                {nav.title}
              </Button>
            </Link>
            {nav.subNavs !== undefined &&
              nav?.subNavs.map((sub) => {
                const status = params.get("status");
                return (
                  <nav className="ml-2" key={sub.key}>
                    <Link href={sub.href}>
                      <Button
                        variant="link"
                        className={cn({ "font-bold": sub.key === status })}
                      >
                        {sub.title}
                      </Button>
                    </Link>
                  </nav>
                );
              })}
          </nav>
        );
      })}
    </div>
  );
}
