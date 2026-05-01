"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, ChevronDown, User, Car, Building2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const locales = ['en', 'sw', 'ar', 'zh', 'yo', 'ha', 'ig', 'zu', 'af', 'fr'];

  const handleLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const mainNav = [
    { href: "/", label: t("home") },
    { href: "/real-estate", label: t("stays") },
    { href: "/cars", label: t("cars") },
    { href: "/real-estate?property_type=commercial", label: t("commercial") },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#003580] text-white border-b border-white/10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#febb02] rounded flex items-center justify-center">
              <span className="text-[#003580] font-bold text-sm">TZ</span>
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-white">Dalali</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-white/10",
                  pathname === n.href && "bg-white/20"
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 hover:bg-white/10 text-white">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium uppercase">{locale}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {locales.map((l) => (
                  <DropdownMenuItem key={l} onClick={() => handleLanguageChange(l)} className="uppercase">
                    {l}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <SignedIn>
              <NotificationBell />
              <Button asChild variant="ghost" size="sm" className="hidden md:flex gap-1.5 hover:bg-white/10 text-white">
                <Link href="/dashboard">
                  <User className="h-4 w-4" />
                  {t("dashboard")}
                </Link>
              </Button>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <Button asChild variant="ghost" size="sm" className="hidden md:flex hover:bg-white/10 text-white">
                <Link href="/sign-in">{t("signIn")}</Link>
              </Button>
            </SignedOut>

            {/* List CTA */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="hidden md:flex bg-[#febb02] text-[#003580] hover:bg-[#febb02]/90 font-bold border-none">
                  {t("more")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/host/properties/new" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {t("listProperty")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/host/cars/new" className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    {t("listCar")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-md"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#003580] border-t border-white/10 animate-slide-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {mainNav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium hover:bg-white/10 rounded-md"
              >
                {n.label}
              </Link>
            ))}
            <div className="border-t border-white/10 my-2 pt-2">
              <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm hover:bg-white/10 rounded-md">
                {t("dashboard")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
