import { Link } from "react-router-dom";

export const SiteFooter = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="container py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-baseline gap-0.5 mb-2">
            <span className="font-bold text-2xl tracking-tight">TZ</span>
            <span className="font-serif text-2xl text-gold font-semibold">Dalali</span>
          </div>
          <p className="text-sm text-gold/80 italic mb-4">Dalali Wako wa Kweli Duniani Kote</p>
          <div className="gold-divider mb-6" />
          <p className="text-sm opacity-80 max-w-md leading-relaxed">
            TzDalali is your trusted global property broker — connecting buyers and sellers in every
            country, backed by verified local law firms and tax consultants, with every transaction
            legally guaranteed and escrow-protected.
          </p>
          <div className="mt-6 text-xs opacity-60 space-y-1">
            <p>📧 <a href="mailto:support@tzdalali.com" className="hover:text-gold">support@tzdalali.com</a></p>
            <p>🌐 <a href="https://tzdalali.com" className="hover:text-gold">tzdalali.com</a></p>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-gold">Explore</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/listings?type=sale" className="hover:text-gold">For Sale</Link></li>
            <li><Link to="/listings?type=rent" className="hover:text-gold">For Rent</Link></li>
            <li><Link to="/listings?type=commercial" className="hover:text-gold">Commercial</Link></li>
            <li><Link to="/partners" className="hover:text-gold">Verified Partners</Link></li>
            <li><Link to="/how-it-works" className="hover:text-gold">How It Works</Link></li>
            <li><Link to="/pricing" className="hover:text-gold">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-gold">Company</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/about" className="hover:text-gold">About TzDalali</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link to="/auth" className="hover:text-gold">Sign In</Link></li>
            <li><Link to="/seller/listings/new" className="hover:text-gold">List a Property</Link></li>
            <li><Link to="/legal/terms" className="hover:text-gold">Terms of Service</Link></li>
            <li><Link to="/legal/privacy" className="hover:text-gold">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6 text-xs opacity-60 flex flex-col md:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} TzDalali — All rights reserved. Tanzania's Global Broker.</p>
          <p>Founding legal partner: GODVIL Consult · Founding tax partner: PRIME AUDITORS</p>
        </div>
      </div>
    </footer>
  );
};
