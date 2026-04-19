import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/home/HeroSearch";
import heroVilla from "@/assets/hero-villa.jpg";
import { useCountries, type Country } from "@/hooks/useCountries";
import { useProperties, type Property } from "@/hooks/useProperties";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Building2,
  Home as HomeIcon,
  Store,
  ArrowRight,
  ShieldCheck,
  Scale,
  Globe2,
  BadgeCheck,
  Lock,
  MapPin,
} from "lucide-react";

// ─── Featured country pills ───────────────────────────────────────────────────

const HIGHLIGHT_ISO = ["TZ", "KE", "UG", "RW", "ET", "CD", "MZ", "MG"];

function FeaturedLocations({ t }: { t: (key: string) => string }) {
  const navigate = useNavigate();
  const { data: countries = [] } = useCountries();

  const featured = HIGHLIGHT_ISO
    .map((iso) => countries.find((c) => c.iso_code === iso))
    .filter((c): c is Country => !!c);

  if (featured.length === 0) return null;

  return (
    <div className="mb-16">
      <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4 text-center">{t("home.cat_countries")}</p>
      <div className="flex flex-wrap justify-center gap-2.5">
        {featured.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => navigate(`/listings?country=${c.id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:border-gold hover:shadow-md transition-all text-sm font-medium text-foreground"
          >
            {c.flag_emoji && <span className="text-base leading-none">{c.flag_emoji}</span>}
            {c.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => navigate("/listings")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-dashed border-border bg-transparent hover:border-gold text-sm text-muted-foreground hover:text-foreground transition-all"
        >
          <Globe2 className="h-3.5 w-3.5" />
          {t("home.cat_all")}
        </button>
      </div>
    </div>
  );
}

// ─── Property photo card (image-dominant) ─────────────────────────────────────

const FALLBACK_IMG = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";

function PropertyPhotoCard({ property }: { property: Property }) {
  const fmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: "compact",
  });

  return (
    <Link
      to={`/listings/${property.id}`}
      className="group relative block aspect-[4/3] rounded-xl overflow-hidden shadow-card hover:shadow-luxe transition-all duration-500"
    >
      <img
        src={property.featured_image || FALLBACK_IMG}
        alt={property.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      {/* Deal type badge */}
      <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded ${
        property.deal_type === "sale"
          ? "bg-primary text-primary-foreground"
          : property.deal_type === "rent"
          ? "bg-gold text-white"
          : "bg-white/80 text-foreground"
      }`}>
        {property.deal_type === "sale" ? "For Sale" : property.deal_type === "rent" ? "For Rent" : "Lease"}
      </span>

      {/* Bottom info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="font-serif text-base font-semibold leading-tight line-clamp-1 mb-0.5">
          {property.title}
        </p>
        <p className="text-gold font-semibold text-sm">{fmt.format(property.price)}</p>
        {property.neighborhood && (
          <p className="text-xs text-white/70 mt-0.5 flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 shrink-0" />
            {property.neighborhood}
          </p>
        )}
      </div>
    </Link>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ─── Nearby / latest properties section ──────────────────────────────────────

function NearbyPropertiesSection({ t }: { t: (key: string) => string }) {
  const { profile, loading: authLoading } = useAuthContext();
  const { data: countries = [] } = useCountries();

  const countryId = profile?.country_id ?? undefined;
  const regionId = profile?.region_id ?? undefined;

  // Prefer region-level results when available, fall back to country, then global
  const { data: properties = [], isLoading } = useProperties(
    regionId
      ? { region_id: regionId, limit: 30 }
      : countryId
      ? { country_id: countryId, limit: 30 }
      : { limit: 30 }
  );

  // Stable shuffle per data load — reshuffle only when the fetched list changes
  const displayed = useMemo(() => shuffle(properties).slice(0, 6), [properties]);

  if (authLoading || isLoading) {
    return (
      <section className="container py-16">
        <div className="h-5 w-36 bg-muted rounded animate-pulse mb-2" />
        <div className="h-9 w-60 bg-muted rounded animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (displayed.length === 0) return null;

  const regionName = regionId
    ? undefined // We'd need useRegions to resolve the name; skip for now
    : undefined;
  const countryName = countryId
    ? countries.find((c) => c.id === countryId)?.name
    : undefined;

  const heading = regionName ?? countryName
    ? t("home.nearby_title_loc").replace("{location}", regionName ?? countryName ?? "")
    : t("home.nearby_title_global");
  const subheading = countryName
    ? t("home.nearby_location")
    : t("home.nearby_global");
  const browseHref = regionId
    ? `/listings?region=${regionId}`
    : countryId
    ? `/listings?country=${countryId}`
    : "/listings";

  return (
    <section className="container py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-2">
            {subheading}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-primary">{heading}</h2>
        </div>
        <Button asChild variant="outline" size="sm" className="hidden sm:flex gap-1.5 shrink-0">
          <Link to={browseHref}>
            {t("home.view_all")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayed.map((p) => (
          <PropertyPhotoCard key={p.id} property={p} />
        ))}
      </div>

      <div className="mt-6 text-center sm:hidden">
        <Button asChild variant="outline" size="sm">
          <Link to={browseHref}>
            {t("home.view_all")} <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const Home = () => {
  const { t } = useLanguage();

  const categories = [
    {
      icon: HomeIcon,
      label: t("home.cat_residential"),
      desc: t("home.cat_residential_desc"),
      to: "/listings?type=sale",
    },
    {
      icon: Building2,
      label: t("home.cat_rentals"),
      desc: t("home.cat_rentals_desc"),
      to: "/listings?type=rent",
    },
    {
      icon: Store,
      label: t("home.cat_commercial"),
      desc: t("home.cat_commercial_desc"),
      to: "/listings?property_type=commercial",
    },
  ];

  const trustFeatures = [
    { icon: Scale, title: t("home.trust_legal"), desc: t("home.trust_legal_desc") },
    { icon: Lock, title: t("home.trust_escrow"), desc: t("home.trust_escrow_desc") },
    { icon: BadgeCheck, title: t("home.trust_partners"), desc: t("home.trust_partners_desc") },
    { icon: Globe2, title: t("home.trust_global"), desc: t("home.trust_global_desc") },
  ];

  const howItWorks = [
    {
      step: "01",
      title: t("home.step1_title"),
      desc: t("home.step1_desc"),
    },
    {
      step: "02",
      title: t("home.step2_title"),
      desc: t("home.step2_desc"),
    },
    {
      step: "03",
      title: t("home.step3_title"),
      desc: t("home.step3_desc"),
    },
  ];

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
                {t("hero.tagline")}
              </span>
              <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6">
                {t("hero.title_1")}<em className="text-gold not-italic">{t("hero.title_em")}</em>{t("hero.title_2")}
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-xl mb-8 font-light">
                {t("hero.body")}{" "}
                <span className="text-gold/90">Dalali Wako wa Kweli Duniani Kote.</span>
              </p>
            </div>
            <div className="-mb-12 md:-mb-16 max-w-5xl">
              <HeroSearch />
            </div>
          </div>
        </div>
      </section>

      {/* Country pills + Categories */}
      <section className="container pt-32 md:pt-40">
        <FeaturedLocations t={t} />
        <div className="text-center mb-14">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">{t("home.browse_label")}</span>
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">{t("home.browse_title")}</h2>
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
                {t("home.explore")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Properties near the user (or latest global) */}
      <NearbyPropertiesSection t={t} />

      {/* How It Works */}
      <section className="container py-24 md:py-32">
        <div className="text-center mb-14">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">{t("home.process_label")}</span>
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">{t("home.process_title")}</h2>
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
            <Link to="/how-it-works">{t("home.guide")}</Link>
          </Button>
        </div>
      </section>

      {/* Trust Features */}
      <section className="container pb-24 md:pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">{t("home.why_label")}</span>
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-6 leading-tight">
              {t("home.why_title")}
            </h2>
            <div className="gold-divider mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t("home.why_body")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="gold" size="lg">
                <Link to="/listings">{t("home.browse_props")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/pricing">{t("home.commission")}</Link>
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
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">{t("home.seller_label")}</span>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">{t("home.seller_title")}</h2>
          <p className="text-gold/80 italic mb-2">Dalali Wako wa Kweli Duniani Kote</p>
          <p className="opacity-80 max-w-2xl mx-auto mb-8 font-light">
            {t("home.seller_body")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="gold" size="lg">
              <Link to="/seller/listings/new">{t("home.list_cta")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/partners">{t("home.partner_cta")}</Link>
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
