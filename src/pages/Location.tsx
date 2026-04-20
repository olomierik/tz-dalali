import { Link } from "react-router-dom";
import { useCountries } from "@/hooks/useCountries";
import { MapPin } from "lucide-react";

const Location = () => {
  const { data: countries = [], isLoading } = useCountries();
  const active = countries.filter((c) => c.is_active);

  return (
    <div className="container py-16 max-w-5xl">
      <h1 className="font-serif text-4xl md:text-5xl mb-2">Location</h1>
      <p className="text-white/80 mb-10">Browse properties by country.</p>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-16 rounded-md bg-white/10 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {active.map((c) => (
            <Link
              key={c.id}
              to={`/listings?country=${c.id}`}
              className="flex items-center gap-3 px-4 py-4 rounded-md bg-card hover:bg-gold/20 hover:border-gold border border-white/15 transition-all"
            >
              {c.flag_emoji && <span className="text-2xl">{c.flag_emoji}</span>}
              <span className="font-medium">{c.name}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 flex items-center gap-2 text-sm text-white/70">
        <MapPin className="h-4 w-4 text-gold" />
        Don't see your country? <Link to="/contact" className="text-gold hover:underline">Get in touch</Link>.
      </div>
    </div>
  );
};

export default Location;
