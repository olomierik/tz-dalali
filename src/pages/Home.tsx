import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useProperties, type Property } from "@/hooks/useProperties";
import { useCountries } from "@/hooks/useCountries";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80";

const fmtPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  notation: "compact",
});

/** Full-bleed rotating hero matching tzagents.com layout. */
const Home = () => {
  const navigate = useNavigate();

  const { data: featured = [] } = useProperties({ limit: 12 });
  const { data: countries = [] } = useCountries();

  // Filter to those with a usable image
  const slides = useMemo<Property[]>(
    () => featured.filter((p) => !!p.featured_image),
    [featured],
  );

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const current = slides[idx];

  // Search bar state
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<string>("");
  const [type, setType] = useState<string>("");

  const onFind = () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (country) params.set("country", country);
    if (type) params.set("property_type", type);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Crossfading photo layers */}
      <div className="absolute inset-0 -z-10">
        {slides.length === 0 && (
          <img
            src={FALLBACK_IMG}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {slides.map((p, i) => (
          <img
            key={p.id}
            src={p.featured_image || FALLBACK_IMG}
            alt={p.title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out"
            style={{ opacity: i === idx ? 1 : 0 }}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        {/* Soft scrim only at edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/55" />
      </div>

      {/* Property caption (bottom-right, like tzagents) */}
      {current && (
        <div className="flex-1 container flex items-end pb-32 md:pb-40">
          <div className="ml-auto text-right max-w-xl">
            <Link
              to={`/listings/${current.id}`}
              className="block font-serif text-3xl md:text-5xl text-white hover:text-gold transition-colors"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.6)" }}
            >
              {current.title}
            </Link>
            <p
              className="mt-2 text-2xl md:text-3xl font-semibold text-white"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.6)" }}
            >
              {current.price_negotiable ? "Price on request" : fmtPrice.format(current.price)}
            </p>
            <Button asChild variant="gold" className="mt-4">
              <Link to={`/listings/${current.id}`}>View</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Bottom search bar */}
      <div className="absolute bottom-0 inset-x-0">
        <div className="container">
          <div className="bg-white/95 backdrop-blur rounded-md p-3 mb-6 shadow-luxe grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-9 h-10 border-0 text-foreground"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onFind()}
              />
            </div>

            <Select value={country || "__any__"} onValueChange={(v) => setCountry(v === "__any__" ? "" : v)}>
              <SelectTrigger className="h-10 min-w-[160px] border-0 text-foreground">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-y-auto">
                <SelectItem value="__any__">Any location</SelectItem>
                {countries.filter((c) => c.is_active).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.flag_emoji ? `${c.flag_emoji} ` : ""}{c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={type || "__any__"} onValueChange={(v) => setType(v === "__any__" ? "" : v)}>
              <SelectTrigger className="h-10 min-w-[160px] border-0 text-foreground">
                <SelectValue placeholder="Property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any__">Any type</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="gold" className="h-10 px-6" onClick={onFind}>
              Find homes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
