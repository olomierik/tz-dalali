import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/home/HeroSearch";
import heroVilla from "@/assets/hero-villa.jpg";
import { Building2, Home as HomeIcon, Store, ArrowRight, Award, ShieldCheck, Handshake } from "lucide-react";

const categories = [
  { icon: HomeIcon, label: "Residential", desc: "Villas, penthouses, and private estates", to: "/listings?type=sale" },
  { icon: Building2, label: "Rentals", desc: "Long-term leases in prime locations", to: "/listings?type=rent" },
  { icon: Store, label: "Commercial", desc: "Offices, retail, and investment assets", to: "/listings?type=commercial" },
];

const Home = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[560px] w-full overflow-hidden">
          <img
            src={heroVilla}
            alt="Luxury villa at twilight with infinity pool"
            className="absolute inset-0 h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="relative container h-full flex flex-col justify-end pb-20 md:pb-28">
            <div className="max-w-3xl text-primary-foreground animate-fade-in">
              <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-4">
                Luxury Real Estate Brokerage
              </span>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6">
                Where extraordinary <em className="text-gold not-italic">homes</em> meet discerning buyers.
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-xl mb-8 font-light">
                Curated residences and prime commercial assets — represented by an elite network of brokers.
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
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">Find your category</h2>
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

      {/* Featured CTA */}
      <section className="container py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">Featured</span>
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-6 leading-tight">
              An obsession with the exceptional.
            </h2>
            <div className="gold-divider mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-8">
              From oceanfront estates to architecturally significant penthouses, every listing is hand-selected
              and represented by a broker who understands its value — and yours.
            </p>
            <Button asChild variant="gold" size="lg">
              <Link to="/listings">View Featured Listings</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Award, title: "Elite Brokers", desc: "Top 1% representation" },
              { icon: ShieldCheck, title: "Verified Listings", desc: "Every property vetted" },
              { icon: Handshake, title: "End-to-end", desc: "Offer to closing" },
              { icon: Building2, title: "Global Reach", desc: "International network" },
            ].map((f) => (
              <div key={f.title} className="bg-secondary rounded-lg p-6 border border-border">
                <f.icon className="h-6 w-6 text-gold mb-3" />
                <h4 className="font-serif text-lg text-primary mb-1">{f.title}</h4>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent CTA strip */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20 text-center">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">For Brokers</span>
          <h2 className="font-serif text-4xl md:text-5xl mb-6">Join our network of elite agents.</h2>
          <p className="opacity-80 max-w-2xl mx-auto mb-8 font-light">
            Manage listings, leads, viewings, offers, deals and commissions — all in one luxurious workspace.
          </p>
          <Button asChild variant="gold" size="lg">
            <Link to="/auth?mode=signup&role=agent">Become an Agent</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default Home;
