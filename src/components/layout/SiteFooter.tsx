import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from "lucide-react";

export const SiteFooter = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">TZ</span>
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-white">
                Dalali<span className="text-gold">.</span>
              </span>
            </Link>
            <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
              The world's first global marketplace for high-value assets with integrated legal protection and escrow.
              Operating in 195 countries with a network of verified law firms.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-black transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-black transition-all">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-black transition-all">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-gold uppercase tracking-widest text-sm">{t('vertical.real_estate')}</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/real-estate?type=sale" className="hover:text-gold transition-colors">Residential For Sale</Link></li>
              <li><Link to="/real-estate?type=rent" className="hover:text-gold transition-colors">Rentals & Stays</Link></li>
              <li><Link to="/real-estate?type=commercial" className="hover:text-gold transition-colors">Commercial Assets</Link></li>
              <li><Link to="/real-estate?type=land" className="hover:text-gold transition-colors">Land & Plots</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-gold uppercase tracking-widest text-sm">{t('vertical.cars')}</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/cars?body=luxury" className="hover:text-gold transition-colors">Luxury Collection</Link></li>
              <li><Link to="/cars?body=suv" className="hover:text-gold transition-colors">SUVs & Off-road</Link></li>
              <li><Link to="/cars?condition=new" className="hover:text-gold transition-colors">Brand New Cars</Link></li>
              <li><Link to="/cars?type=electric" className="hover:text-gold transition-colors">Electric Vehicles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-gold uppercase tracking-widest text-sm">Company</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-gold transition-colors">About TzDalali</Link></li>
              <li><Link to="/partners" className="hover:text-gold transition-colors">Global Partners</Link></li>
              <li><Link to="/how-it-works" className="hover:text-gold transition-colors">How It Works</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span>© {currentYear} TzDalali Global Ltd.</span>
            <Link to="/terms" className="hover:text-gold">Terms</Link>
            <Link to="/privacy" className="hover:text-gold">Privacy</Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="h-4 w-4 text-gold" />
            <span>Encrypted Transactions & Escrow Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
