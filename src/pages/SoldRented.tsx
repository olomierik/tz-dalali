import { useProperties } from "@/hooks/useProperties";
import { PropertyGrid } from "@/components/properties/PropertyGrid";

const SoldRented = () => {
  // We pull all and filter client-side since useProperties accepts a single status via deal_type, not status.
  const { data: all = [], isLoading } = useProperties({ limit: 60 });
  const closed = all.filter((p) => p.status === "sold" || p.status === "rented" || p.status === "under_offer");

  return (
    <div className="container py-12">
      <h1 className="font-serif text-4xl md:text-5xl mb-2">Sold &amp; Rented</h1>
      <p className="text-white/80 mb-8">A selection of recently completed deals.</p>

      <PropertyGrid
        properties={closed}
        loading={isLoading}
        emptyMessage="No completed deals to show yet."
      />
    </div>
  );
};

export default SoldRented;
