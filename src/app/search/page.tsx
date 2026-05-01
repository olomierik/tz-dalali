"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/listings/PropertyCard";
import { CarCard } from "@/components/listings/CarCard";
import { SmartSearch } from "@/components/search/SmartSearch";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const results = useQuery(api.listings.searchListings, { query, type: "all" });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#003580] py-8 px-4">
        <div className="container mx-auto">
          <SmartSearch />
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-8">Search Results for "{query}"</h1>
        
        <div className="space-y-12">
          {results?.properties?.length! > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results?.properties.map((p: any) => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
            </section>
          )}

          {results?.cars?.length! > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Cars</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results?.cars.map((c: any) => (
                  <CarCard key={c._id} car={c} />
                ))}
              </div>
            </section>
          )}

          {results && results.properties.length === 0 && results.cars.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500">No results found for your search.</p>
            </div>
          )}
          
          {!results && (
            <div className="text-center py-20">
              <p className="text-gray-500">Loading results...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
