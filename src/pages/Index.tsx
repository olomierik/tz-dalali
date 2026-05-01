import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProperties } from "@/hooks/useProperties";
import { useCars } from "@/hooks/useCars";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { CarCard } from "@/components/cars/CarCard";
import { Search, Sparkles, ShieldCheck, Globe2, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Index() {
  const { t } = useLanguage();
  const { data: properties } = useProperties({ limit: 4 });
  const { data: cars } = useCars({ limit: 4 });

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(212,175,55,0.1),transparent)]" />
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-gold/10 text-gold hover:bg-gold/20 border-none px-4 py-1">
            <Sparkles className="h-3 w-3 mr-2" />
            {t('hero.tagline')}
          </Badge>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-black mb-6 tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Unified Search Widget */}
          <div className="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-2xl border border-gold/10 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 gap-2 border-r border-gray-100">
              <Search className="h-5 w-5 text-gray-400" />
              <input 
                className="w-full py-4 text-sm focus:outline-none" 
                placeholder={t('search.placeholder')}
              />
            </div>
            <div className="md:w-48 px-4 flex items-center border-r border-gray-100">
              <select className="w-full bg-transparent text-sm focus:outline-none">
                <option>{t('vertical.real_estate')}</option>
                <option>{t('vertical.cars')}</option>
              </select>
            </div>
            <Button size="lg" className="bg-black text-gold hover:bg-black/90 px-8 py-7 rounded-xl font-bold">
              {t('search.button')}
            </Button>
          </div>

          {/* AI Search Link */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Sparkles className="h-4 w-4 text-gold" />
            <span>Try our <Link to="/ai-search" className="text-black font-bold hover:underline">AI Semantic Search</Link></span>
          </div>
        </div>
      </section>

      {/* Marketplaces */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-4">{t('real_estate.title')}</h2>
              <p className="text-gray-500">{t('vertical.real_estate_desc')}</p>
            </div>
            <Button asChild variant="ghost" className="text-gold hover:text-gold hover:bg-gold/5">
              <Link to="/real-estate" className="flex items-center gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {properties?.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#F9F7F5]">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-4">{t('cars.title')}</h2>
              <p className="text-gray-500">{t('vertical.cars_desc')}</p>
            </div>
            <Button asChild variant="ghost" className="text-gold hover:text-gold hover:bg-gold/5">
              <Link to="/cars" className="flex items-center gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cars?.map(c => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100" fill="white" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-gold text-black border-none px-4 py-1">AI-POWERED</Badge>
            <h2 className="font-serif text-5xl font-bold mb-8 leading-tight">
              List faster, search smarter with <span className="text-gold">TzDalali AI</span>.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-2xl font-bold">{t('ai.writer.title')}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {t('ai.writer.description')} No more writer's block. Let our AI draft your premium listings in any of our 10 supported languages.
                </p>
                <Button variant="link" className="text-gold p-0 h-auto">Try Listing Writer →</Button>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
                  <Search className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-2xl font-bold">{t('ai.search.title')}</h3>
                <p className="text-gray-400 leading-relaxed">
                  Search like you talk. Find exactly what you need without fiddling with complex filters. 
                  "A family house in Lagos with a pool for under $500k."
                </p>
                <Button variant="link" className="text-gold p-0 h-auto">Try AI Search →</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Trust */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold mb-16">The World's Safest Marketplace</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-2xl border border-gray-100 hover:border-gold/30 transition-colors">
              <ShieldCheck className="h-12 w-12 text-gold mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4">Legal Guarantees</h3>
              <p className="text-gray-500">Every transaction is assigned a verified local law firm to handle due diligence and title transfer.</p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-100 hover:border-gold/30 transition-colors">
              <Globe2 className="h-12 w-12 text-gold mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4">195 Countries</h3>
              <p className="text-gray-500">Buy property or cars anywhere on Earth with the same level of security and convenience.</p>
            </div>
            <div className="p-8 rounded-2xl border border-gray-100 hover:border-gold/30 transition-colors">
              <Sparkles className="h-12 w-12 text-gold mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4">Multi-Currency</h3>
              <p className="text-gray-500">Pay in your local currency or USD via Stripe, Flutterwave, or Paystack.</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
