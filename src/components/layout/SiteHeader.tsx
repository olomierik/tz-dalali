import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/listings?type=sale", label: "For Sale" },
  { to: "/listings?type=rent", label: "For Rent" },
  { to: "/listings?type=commercial", label: "Commercial" },
  { to: "/partners", label: "Partners" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
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
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button asChild variant="gold" size="sm">
            <Link to="/seller/listings/new">List Property</Link>
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
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to="/auth" onClick={() => setOpen(false)}>Sign In</Link>
              </Button>
              <Button asChild variant="gold" size="sm" className="flex-1">
                <Link to="/seller/listings/new" onClick={() => setOpen(false)}>List Property</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
