import { useSearchParams } from "react-router-dom";

const Listings = () => {
  const [params] = useSearchParams();
  const type = params.get("type") ?? "all";
  return (
    <div className="container py-20">
      <span className="inline-block text-xs uppercase tracking-[0.3em] text-gold mb-3">Listings</span>
      <h1 className="font-serif text-5xl text-primary mb-3 capitalize">{type === "all" ? "All Properties" : `For ${type}`}</h1>
      <div className="gold-divider mb-8" />
      <p className="text-muted-foreground max-w-xl">
        Listings, filters, and map view will appear here once the backend schema and properties are in place.
      </p>
    </div>
  );
};

export default Listings;
