"use client";

import { useState } from "react";
import { AIListingWriter } from "@/components/dashboard/AIListingWriter";
import { PriceRecommender } from "@/components/dashboard/PriceRecommender";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function NewCarListing() {
  const [specs, setSpecs] = useState({
    make: "Toyota",
    model: "Land Cruiser",
    year: 2022,
    mileage: 15000,
    fuelType: "Diesel",
    transmission: "Automatic",
    price: 85000,
    currency: "USD"
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">List a New Car</h1>
        <p className="text-gray-500">Provide details about your car to reach global buyers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Make</Label>
              <Input value={specs.make} onChange={(e) => setSpecs({...specs, make: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Model</Label>
              <Input value={specs.model} onChange={(e) => setSpecs({...specs, model: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Year</Label>
              <Input type="number" value={specs.year} onChange={(e) => setSpecs({...specs, year: parseInt(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <Label>Mileage (km)</Label>
              <Input type="number" value={specs.mileage} onChange={(e) => setSpecs({...specs, mileage: parseInt(e.target.value)})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fuel Type</Label>
              <Input value={specs.fuelType} onChange={(e) => setSpecs({...specs, fuelType: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Transmission</Label>
              <Input value={specs.transmission} onChange={(e) => setSpecs({...specs, transmission: e.target.value})} />
            </div>
          </div>
          <PriceRecommender type="car" specs={specs} />
        </div>

        <div className="space-y-6">
          <AIListingWriter type="car" specs={specs} />
          <Button className="w-full bg-[#003580]">Publish Listing</Button>
        </div>
      </div>
    </div>
  );
}
