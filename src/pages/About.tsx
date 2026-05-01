import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Globe2, Zap, Users, Building2, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <SiteHeader />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-gold/5 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-gold/10 text-gold border-gold/20">About Us</Badge>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            The World's Safest <span className="text-gold">Marketplace</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            TzDalali connects buyers and sellers across 195 countries with legal guarantees, 
            escrow protection, and verified local partners.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                We believe everyone deserves access to safe, transparent global trade. 
                Whether you're buying your dream home in Bali or selling a car in Lagos, 
                TzDalali ensures every transaction is protected by verified local experts.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Our platform combines cutting-edge technology with local expertise. 
                Every deal is assigned a verified law firm for due diligence and title transfer, 
                giving you peace of mind across borders.
              </p>
              <Button asChild size="lg" className="bg-black text-gold hover:bg-black/90">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-gold/5 text-center">
                <div className="text-4xl font-bold text-gold mb-2">195</div>
                <div className="text-gray-600">Countries</div>
              </div>
              <div className="p-8 rounded-2xl bg-gold/5 text-center">
                <div className="text-4xl font-bold text-gold mb-2">500+</div>
                <div className="text-gray-600">Law Firms</div>
              </div>
              <div className="p-8 rounded-2xl bg-gold/5 text-center">
                <div className="text-4xl font-bold text-gold mb-2">10K+</div>
                <div className="text-gray-600">Properties</div>
              </div>
              <div className="p-8 rounded-2xl bg-gold/5 text-center">
                <div className="text-4xl font-bold text-gold mb-2">50K+</div>
                <div className="text-gray-600">Cars</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#F9F7F5]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">Why Choose TzDalali</h2>
            <p className="text-gray-600">Built on trust, powered by technology</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-gold/30 transition-colors">
              <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-7 w-7 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-3">Legal Guarantees</h3>
              <p className="text-gray-600">
                Every transaction is protected by verified local law firms. Due diligence, 
                title verification, and contract review included.
              </p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-gold/30 transition-colors">
              <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-6">
                <Globe2 className="h-7 w-7 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Coverage</h3>
              <p className="text-gray-600">
                From Tanzania to Thailand, we operate in 195 countries with local support 
                and multi-currency payment options.
              </p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-gold/30 transition-colors">
              <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-gold" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered</h3>
              <p className="text-gray-600">
                Our AI listing writer creates professional descriptions in 10 languages. 
                Semantic search finds exactly what you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-600">Built by a global team passionate about safe commerce</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center">
                <Users className="h-16 w-16 text-gold" />
              </div>
              <h3 className="font-bold text-lg">Global Team</h3>
              <p className="text-gray-600">Engineers, designers, and legal experts</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center">
                <Building2 className="h-16 w-16 text-gold" />
              </div>
              <h3 className="font-bold text-lg">Partner Network</h3>
              <p className="text-gray-600">500+ verified law firms worldwide</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center">
                <Globe2 className="h-16 w-16 text-gold" />
              </div>
              <h3 className="font-bold text-lg">Local Experts</h3>
              <p className="text-gray-600">Native speakers in every region</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-400 mb-8">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:hello@tzdalali.com" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors">
                <Mail className="h-5 w-5 text-gold" />
                hello@tzdalali.com
              </a>
              <a href="tel:+255123456789" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors">
                <Phone className="h-5 w-5 text-gold" />
                +255 123 456 789
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}