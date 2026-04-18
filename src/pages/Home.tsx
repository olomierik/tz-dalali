import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/home/HeroSearch";
import heroVilla from "@/assets/hero-villa.jpg";
import {
  Building2,
  Home as HomeIcon,
  Store,
  ArrowRight,
  ShieldCheck,
  Handshake,
  Scale,
  Globe2,
  BadgeCheck,
  Lock,
} from "lucide-react";

const categories = [
  {
    icon: HomeIcon,
    label: "Residential",
    desc: "Houses, apartments, villas, and land across every country — legally transferred with title guarantee.",
    to: "/listings?type=sale",
  },
  {
    icon: Building2,
    label: "Rentals & Leases",
    desc: "Short-term and long-term rental agreements handled end-to-end with TzDalali-verified contracts.",
    to: "/listings?type=rent",
  },
  {
    icon: Store,
    label: "Commercial",
    desc: "Offices, warehouses, hotels, and investment assets. Global reach with local legal expertise.",
    to: "/listings?type=commercial",
  },
];

const trustFeatures = [
  { icon: Scale, title: "Legal Guarantee", desc: "Verified law firm partner in every country" },
  { icon: Lock, title: "Escrow-Protected", desc: "Your funds held safely until transfer complete" },
  { icon: BadgeCheck, title: "Verified Partners", desc: "Vetted law firms and tax consultants globally" },
  { icon: Globe2, title: "Every Country", desc: "Active in 195 countries and growing" },
];

const howItWorks = [
  {
    step: "01",
    title: "List for $50",
    desc: "Property owners pay a one-time $50 flat fee to list on TzDalali. Your property goes live globally.",
  },
  {
    step: "02",
    title: "TzDalali Acts as Your Broker",
    desc: "When a buyer proceeds, TzDalali assigns a verified local law firm and tax consultant to the deal.",
  },
  {
    step: "03",
    title: "Legally Guaranteed Completion",
    desc: "8-step transaction flow: due diligence, tax clearance, contract, escrow, title transfer — all handled.",
  },
];

const Home = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[560px] w-full overflow-hidden">
          <img
            src={heroVilla}
            alt="Property with a beautiful view"
            className="absolute inset-0 h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="relative container h-full flex flex-col justify-end pb-20 md:pb-28">
            <div className="max-w-3xl text-primary-foreground animate-fade-in">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-4">
                Your Trusted Global Property Broker
              </span>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6">
                Buy and sell property <em className="text-gold not-italic">anywhere</em> on Earth.
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-xl mb-8 font-light">
                Legally guaranteed, escrow-protected, with verified local law firms and tax
                consultants in every country. <span className="text-gold/90">Dalali Wako wa Kweli Duniani Kote.</span>
              </p>
            </div>
            <div className="-mb-12 md:-mb-16 max-w-5xl">
              <HeroSearch />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container pt-32 md:pt-40">
        <div className="text-center mb-14">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">Browse</span>
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">Find your property</h2>
          <div className="gold-divider mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="group bg-card border border-border rounded-lg p-8 shadow-card hover:shadow-luxe hover:-translate-y-1 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-full bg-gold-soft flex items-center justify-center mb-6 group-hover:bg-gold transition-colors">
                <c.icon className="h-6 w-6 text-gold-foreground" />
              </div>
              <h3 className="font-serif text-2xl text-primary mb-2">{c.label}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{c.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm text-gold font-medium">
                Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-24 md:py-32">
        <div className="text-center mb-14">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">Process</span>
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">How TzDalali works</h2>
          <div className="gold-divider mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {howItWorks.map((item) => (
            <div key={item.step} className="relative pl-6 border-l-2 border-gold/30">
              <span className="font-serif text-5xl text-gold/20 font-bold absolute -left-4 top-0 select-none">
                {item.step}
              </span>
              <h3 className="font-serif text-xl text-primary mb-3 mt-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/how-it-works">Full Transaction Guide</Link>
          </Button>
        </div>
      </section>

      {/* Trust Features */}
      <section className="container pb-24 md:pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">Why TzDalali</span>
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-6 leading-tight">
              Every deal backed by real legal protection.
            </h2>
            <div className="gold-divider mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-8">
              TzDalali earns only when your deal closes — 10% commission split between the platform,
              your assigned law firm (3%), and your tax consultant (2%). No hidden fees.
              A transparent, legally guaranteed transaction every time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="gold" size="lg">
                <Link to="/listings">Browse Properties</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/pricing">See Commission Breakdown</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {trustFeatures.map((f) => (
              <div key={f.title} className="bg-secondary rounded-lg p-6 border border-border">
                <f.icon className="h-6 w-6 text-gold mb-3" />
                <h4 className="font-serif text-lg text-primary mb-1">{f.title}</h4>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller / Listing CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20 text-center">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">For Property Owners</span>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">List your property for just $50.</h2>
          <p className="text-gold/80 italic mb-2">Dalali Wako wa Kweli Duniani Kote</p>
          <p className="opacity-80 max-w-2xl mx-auto mb-8 font-light">
            One flat fee. Your property reaches buyers worldwide. TzDalali earns only when you close —
            10% commission on the deal value, handled through our verified partner network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="gold" size="lg">
              <Link to="/seller/listings/new">List a Property — $50</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/partners">Become a Partner Firm</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Founding Partners */}
      <section className="container py-24">
        <div className="text-center mb-12">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">Founding Partners</span>
          <h2 className="font-serif text-4xl text-primary mb-4">Backed by verified Tanzanian professionals</h2>
          <div className="gold-divider mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[
            {
              icon: Scale,
              name: "GODVIL Consult",
              role: "Founding Legal Partner",
              desc: "Specializing in Tanzanian property law, title verification, contract drafting, and legal guarantees for all TzDalali transactions.",
            },
            {
              icon: ShieldCheck,
              name: "PRIME AUDITORS",
              role: "Founding Tax Partner",
              desc: "Expert in Tanzanian property taxation, TRA compliance, stamp duty calculation, and financial due diligence for all TzDalali transactions.",
            },
          ].map((p) => (
            <div key={p.name} className="bg-card border border-border rounded-lg p-8 shadow-card">
              <p.icon className="h-8 w-8 text-gold mb-4" />
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-serif text-xl text-primary">{p.name}</h3>
                <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">Elite Partner</span>
              </div>
              <p className="text-xs text-gold mb-3 uppercase tracking-wide">{p.role}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild variant="outline">
            <Link to="/partners">View All Verified Partners</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Home;
