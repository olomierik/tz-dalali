import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, ChevronDown, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { lang, toggle } = useLanguage();
  const { user } = useAuthContext();

  const mainNav = [
    { to: "/", label: lang === 'en' ? 'Home' : '首页', end: true },
    { to: "/listings?type=sale", label: lang === 'en' ? 'Stays' : '住宿' },
    { to: "/listings?type=rent", label: lang === 'en' ? 'Rentals' : '租房' },
    { to: "/listings?property_type=commercial", label: lang === 'en' ? 'Commercial' : '商业' },
    { to: "/about", label: lang === 'en' ? 'About' : '关于' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-booking-blue rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">TZ</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-booking-blue">Dalali</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive 
                      ? "bg-booking-blue.text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
            
            {/* More dropdown */}
            <div className="relative">
              <button 
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                More
                <ChevronDown className="h-4 w-4" />
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 animate-fade-in">
                  <Link to="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {lang === 'en' ? 'Contact' : '联系我们'}
                  </Link>
                  <Link to="/location" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {lang === 'en' ? 'Locations' : '地区'}
                  </Link>
                  <Link to="/sold" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {lang === 'en' ? 'Sold & Rented' : '已售/已租'}
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button 
              onClick={toggle}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium">{lang === 'en' ? 'EN' : '中'}</span>
            </button>

            {/* Currency placeholder */}
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              <span className="font-medium">USD</span>
            </button>

            {/* User menu */}
            {user ? (
              <Button asChild variant="outline" size="sm" className="hidden md:flex gap-1.5 border-booking-blue text-booking-blue hover:bg-booking-blue-lighter">
                <Link to="/dashboard">
                  <User className="h-4 w-4" />
                  {lang === 'en' ? 'Dashboard' : '控制台'}
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm" className="hidden md:flex border-booking-blue text-booking-blue hover:bg-booking-blue-lighter">
                <Link to="/auth">
                  {lang === 'en' ? 'Sign in' : '登录'}
                </Link>
              </Button>
            )}

            {/* List Property CTA */}
            <Button asChild size="sm" className="hidden md:flex bg-booking-yellow text-booking-blue hover:bg-yellow-400 font-semibold">
              <Link to="/seller/listings/new">
                {lang === 'en' ? 'List Property' : '发布房产'}
              </Link>
            </Button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-200 animate-slide-up">
          <div className="container py-4 flex flex-col gap-2">
            {mainNav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                {n.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 my-2 pt-2">
              <Link to="/contact" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                {lang === 'en' ? 'Contact' : '联系我们'}
              </Link>
              <Link to="/location" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                {lang === 'en' ? 'Locations' : '地区'}
              </Link>
              <Link to="/sold" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                {lang === 'en' ? 'Sold & Rented' : '已售/已租'}
              </Link>
            </div>
            <div className="border-t border-gray-200 pt-2 flex flex-col gap-2">
              <button onClick={toggle} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                <Globe className="h-4 w-4" />
                {lang === 'en' ? 'Switch to 中文' : '切换到 English'}
              </button>
              {!user ? (
                <Link to="/auth" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-medium text-booking-blue hover:bg-gray-100 rounded-md">
                  {lang === 'en' ? 'Sign in' : '登录'}
                </Link>
              ) : (
                <Link to="/dashboard" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-medium text-booking-blue hover:bg-gray-100 rounded-md">
                  {lang === 'en' ? 'Dashboard' : '控制台'}
                </Link>
              )}
              <Link to="/seller/listings/new" onClick={() => setOpen(false)} className="mx-4 py-3 text-sm font-semibold text-center text-booking-blue bg-booking-yellow rounded-md">
                {lang === 'en' ? 'List Property' : '发布房产'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};