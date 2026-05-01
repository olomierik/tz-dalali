"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CarCard } from "@/components/listings/CarCard";
import { SmartSearch } from "@/components/search/SmartSearch";

export default function CarsPage() {
  const cars = useQuery(api.listings.searchListings, { query: "", type: "car" });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#003580] py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-serif text-white text-center mb-8">Car Marketplace</h1>
          <SmartSearch />
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-bold mb-4">Filters</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-500 italic">Advanced filters coming soon</p>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars?.cars?.map((c: any) => (
                <CarCard key={c._id} car={c} />
              ))}
              {cars?.cars?.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-500">No cars found matching your criteria.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
