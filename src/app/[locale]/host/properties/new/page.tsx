"use client";

import { useState } from "react";
import { AIListingWriter } from "@/components/dashboard/AIListingWriter";
import { PriceRecommender } from "@/components/dashboard/PriceRecommender";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function NewPropertyListing() {
  const [specs, setSpecs] = useState({
    type: "Apartment",
    location: "Dar es Salaam",
    bedrooms: 2,
    bathrooms: 2,
    price: 150000,
    currency: "USD"
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">List a New Property</h1>
        <p className="text-gray-500">Provide details about your property to reach global buyers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Property Type</Label>
            <Input value={specs.type} onChange={(e) => setSpecs({...specs, type: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={specs.location} onChange={(e) => setSpecs({...specs, location: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bedrooms</Label>
              <Input type="number" value={specs.bedrooms} onChange={(e) => setSpecs({...specs, bedrooms: parseInt(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Input type="number" value={specs.bathrooms} onChange={(e) => setSpecs({...specs, bathrooms: parseInt(e.target.value)})} />
            </div>
          </div>
          <PriceRecommender type="property" specs={specs} />
        </div>

        <div className="space-y-6">
          <AIListingWriter type="property" specs={specs} />
          <Button className="w-full bg-[#003580]">Publish Listing</Button>
        </div>
      </div>
    </div>
  );
}
