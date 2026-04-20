import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);

  const nav = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" },
    { to: "/location", label: "Location" },
    { to: "/listings?type=sale", label: "For Sale" },
    { to: "/listings?type=rent", label: "For Rent" },
    { to: "/sold", label: "Sold & Rented" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-black/40 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-baseline gap-0.5">
          <span className="font-bold text-xl tracking-tight text-white">TZ</span>
          <span className="font-serif text-xl text-gold font-semibold">Dalali</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  "text-sm tracking-wide transition-colors",
                  isActive ? "text-gold" : "text-white/85 hover:text-gold",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center">
          <Button asChild variant="ghost" size="sm" className="text-white/85 hover:text-gold hover:bg-transparent">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-white"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/70 backdrop-blur-md">
          <div className="container py-4 flex flex-col gap-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-sm py-2 text-white/90 hover:text-gold"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="text-sm py-2 text-gold"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
