import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, ChevronDown, User, Car, Home, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { languages, type Lang } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { user } = useAuthContext();

  const mainNav = [
    { to: "/", label: t('nav.home'), end: true },
    { to: "/real-estate", label: t('nav.real_estate'), icon: <Home className="h-4 w-4" /> },
    { to: "/cars", label: t('nav.cars'), icon: <Car className="h-4 w-4" /> },
    { to: "/ai-search", label: "AI Search", icon: <Search className="h-4 w-4" /> },
    { to: "/about", label: t('nav.about'), icon: <Globe className="h-4 w-4" /> },
    { to: "/contact", label: "Contact", icon: <User className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gold/20 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
              <span className="text-gold font-bold text-lg">TZ</span>
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight text-black">
              Dalali<span className="text-gold">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {mainNav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 text-sm font-medium transition-all hover:text-gold",
                    isActive ? "text-gold" : "text-gray-600"
                  )
                }
              >
                {n.icon}
                {n.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="uppercase">{lang}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languages.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={cn(lang === l.code && "bg-gray-100 font-bold")}
                  >
                    <span className="mr-2">{l.flag}</span>
                    {l.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth */}
            {user ? (
              <Button asChild variant="outline" size="sm" className="hidden md:flex gap-2 border-gold text-black hover:bg-gold hover:text-white transition-all">
                <Link to="/dashboard">
                  <User className="h-4 w-4" />
                  {t('nav.dashboard') || 'Dashboard'}
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                <Link to="/auth">{t('nav.sign_in')}</Link>
              </Button>
            )}

            {/* List CTA */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="hidden md:flex bg-black text-gold hover:bg-black/90 font-semibold border border-gold/50">
                  {t('nav.list_now') || 'List Item'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/seller/listings/new?type=property" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    {t('nav.list_property')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/seller/listings/new?type=car" className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    {t('nav.list_car')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-700"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {mainNav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-3 text-lg font-medium text-gray-700 hover:text-gold"
              >
                {n.icon}
                {n.label}
              </Link>
            ))}
            <hr className="border-gray-100" />
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('nav.language') || 'Language'}</p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setOpen(false); }}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md text-sm",
                      lang === l.code ? "bg-black text-gold" : "bg-gray-50 text-gray-600"
                    )}
                  >
                    <span>{l.flag}</span>
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
