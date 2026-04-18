import { Link } from "react-router-dom";

export const SiteFooter = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="container py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-baseline gap-1 mb-4">
            <span className="font-serif text-3xl">tzdalali</span>
            <span className="font-serif text-3xl text-gold">.</span>
            <span className="font-serif text-xl opacity-70">com</span>
          </div>
          <div className="gold-divider mb-6" />
          <p className="text-sm opacity-80 max-w-md leading-relaxed">
            A luxury brokerage connecting discerning buyers with extraordinary properties.
            From private estates to prime commercial assets — discover residences worthy of your story.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-gold">Explore</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/listings?type=sale" className="hover:text-gold">For Sale</Link></li>
            <li><Link to="/listings?type=rent" className="hover:text-gold">For Rent</Link></li>
            <li><Link to="/listings?type=commercial" className="hover:text-gold">Commercial</Link></li>
            <li><Link to="/agents" className="hover:text-gold">Our Agents</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-gold">Company</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/about" className="hover:text-gold">About</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link to="/auth" className="hover:text-gold">Sign In</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6 text-xs opacity-60 flex flex-col md:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} tzdalali.com — All rights reserved.</p>
          <p>Luxury real estate brokerage</p>
        </div>
      </div>
    </footer>
  );
};
