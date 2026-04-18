import { useSearchParams } from "react-router-dom";

const typeLabels: Record<string, string> = {
  sale: "For Sale",
  rent: "For Rent",
  commercial: "Commercial",
  all: "All Properties",
};

const Listings = () => {
  const [params] = useSearchParams();
  const type = params.get("type") ?? "all";
  const label = typeLabels[type] ?? "All Properties";

  return (
    <div className="container py-20">
      <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">TzDalali Listings</span>
      <h1 className="font-serif text-5xl text-primary mb-3">{label}</h1>
      <div className="gold-divider mb-8" />
      <p className="text-muted-foreground max-w-xl leading-relaxed">
        Property listings, advanced filters, map view, and search are coming in the next phase.
        TzDalali will display properties from every country, filterable by region, district, type,
        price, and deal type.
      </p>
    </div>
  );
};

export default Listings;
