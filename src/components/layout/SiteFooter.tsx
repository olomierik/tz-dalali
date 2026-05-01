import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, Mail, Phone, MapPin } from "lucide-react";

export const SiteFooter = () => {
  const { lang } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16">
      {/* Main footer content */}
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-booking-blue rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">TZ</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-booking-blue">Dalali</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {lang === 'en' 
                ? 'Your trusted global property broker with legal guarantee and escrow protection.'
                : '您值得信赖的全球房产中介，提供法律保障和托管保护。'}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Globe className="h-4 w-4" />
              <span>195 {lang === 'en' ? 'countries' : '个国家'}</span>
            </div>
          </div>

          {/* For Guests */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">
              {lang === 'en' ? 'For Guests' : '为客人服务'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/listings?type=sale" className="text-gray-500 hover:text-booking-blue transition-colors">
                  {lang === 'en' ? 'Properties for Sale' : '出售房产'}
                </Link>
              </li>
              <li>
                <Link to="/listings?type=rent" className="text-gray-500 hover:text-booking-blue transition-colors">
                  {lang === 'en' ? 'Rentals' : '租房'}
                </Link>
              </li>
              <li>
                <Link to="/listings?property_type=commercial" className="text-gray-500 hover:text-booking-blue transition-colors">
                  {lang === 'en' ? 'Commercial' : '商业地产'}
                </Link>
              </li>
              <li>
                <Link to="/listings?ai=true" className="text-gray-500 hover:text-booking-blue transition-colors">
                  {lang === 'en' ? 'AI Smart Search' : 'AI智能搜索'}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Property Owners */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">
              {lang === 'en' ? 'For Owners' : '为业主服务'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/seller/listings/new" className="text-gray-500 hover:text-booking-blue transition-colors">
                  {lang === 'en' ? 'List Your Property' : '发布房产'}
                </Link>
              </li>
              <li>
                <Link to="/seller" className="text-gray-500 hover:text-booking-blue transition-colors">
                  {lang === 'en' ? 'Owner Dashboard' : '业主面板'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-500 hover:text-booking-blue transition-colors">
                  {lang === 'en' ? 'Pricing' : '定价'}
                </Link>
              </li>
              <li>
                <Link to="/partner" className="text-gray-500 hover:text-booking-blue transition-colors">
                  {lang === 'en' ? 'Become a Partner' : '成为合作伙伴'}
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">
              {lang === 'en' ? 'About' : '关于'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-gray-500 hover:text-booking-blue transition-colors">
                  {lang === 'en' ? 'About TzDalali' : '关于 TzDalali'}
                </Link>
              </li>
              <li>
                <Link to="/location" className="text-gray-500 hover:text-booking-blue transition-colors">
                  {lang === 'en' ? 'All Locations' : '所有地区'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-booking-blue transition-colors">
                  {lang === 'en' ? 'Contact Us' : '联系我们'}
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-gray-500 hover:text-booking-blue transition-colors">
                  {lang === 'en' ? 'Sign In' : '登录'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm">
              {lang === 'en' ? 'Support' : '支持'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="mailto:support@tzdalali.com" className="text-gray-500 hover:text-booking-blue transition-colors flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {lang === 'en' ? 'Help Center' : '帮助中心'}
                </a>
              </li>
              <li>
                <a href="tel:+255123456789" className="text-gray-500 hover:text-booking-blue transition-colors flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {lang === 'en' ? 'Call Us' : '致电我们'}
                </a>
              </li>
              <li>
                <Link to="/about" className="text-gray-500 hover:text-booking-blue transition-colors flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {lang === 'en' ? 'Find Us' : '找到我们'}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>© {currentYear} TzDalali</span>
              <span className="hidden md:inline">·</span>
              <Link to="/" className="hover:text-booking-blue">{lang === 'en' ? 'Terms' : '条款'}</Link>
              <Link to="/" className="hover:text-booking-blue">{lang === 'en' ? 'Privacy' : '隐私'}</Link>
              <Link to="/" className="hover:text-booking-blue">{lang === 'en' ? 'Cookies' : 'Cookies'}</Link>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{lang === 'en' ? 'Legal partners: ' : '法律合作伙伴: '}</span>
              <span className="font-medium">GODVIL Consult</span>
              <span>·</span>
              <span className="font-medium">PRIME AUDITORS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};