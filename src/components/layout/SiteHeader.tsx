import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const { lang, toggle, t } = useLanguage();

  const nav = [
    { to: "/listings?type=sale", label: t('nav.sale') },
    { to: "/listings?type=rent", label: t('nav.rent') },
    { to: "/listings?property_type=commercial", label: t('nav.commercial') },
    { to: "/partners", label: t('nav.partners') },
    { to: "/how-it-works", label: t('nav.how_it_works') },
    { to: "/about", label: t('nav.about') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-baseline gap-0.5">
          <span className="font-bold text-2xl tracking-tight text-primary">TZ</span>
          <span className="font-serif text-2xl text-gold font-semibold">Dalali</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium tracking-wide uppercase transition-colors",
                  isActive ? "text-gold" : "text-foreground/80 hover:text-gold",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggle}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border/50 hover:border-border"
            title={lang === 'en' ? 'Switch to Chinese' : '切换到英文'}
          >
            {lang === 'en' ? '中文' : 'EN'}
          </button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">{t('nav.sign_in')}</Link>
          </Button>
          <Button asChild variant="gold" size="sm">
            <Link to="/seller/listings/new">{t('nav.list_property')}</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="container py-4 flex flex-col gap-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-sm font-medium uppercase tracking-wide py-2"
              >
                {n.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <button
                onClick={toggle}
                className="text-xs font-medium text-muted-foreground border border-border/50 rounded px-3 py-1.5"
              >
                {lang === 'en' ? '中文' : 'EN'}
              </button>
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to="/auth" onClick={() => setOpen(false)}>{t('nav.sign_in')}</Link>
              </Button>
              <Button asChild variant="gold" size="sm" className="flex-1">
                <Link to="/seller/listings/new" onClick={() => setOpen(false)}>{t('nav.list_property')}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
