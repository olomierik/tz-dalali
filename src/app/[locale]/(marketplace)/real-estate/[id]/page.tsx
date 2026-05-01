"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Maximize, MapPin, Shield, CheckCircle2 } from "lucide-react";
import { GoogleMap } from "@/components/shared/GoogleMap";

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as any;
  const property = useQuery(api.listings.getPropertyById, { id });

  if (!property) return <div className="container mx-auto py-20 text-center">Loading property...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
              <div className="grid grid-cols-2 gap-2 p-2">
                <img src={property.images[0]} className="col-span-2 w-full h-[400px] object-cover rounded-lg" alt="" />
                {property.images.slice(1, 3).map((img: string, i: number) => (
                  <img key={i} src={img} className="w-full h-48 object-cover rounded-lg" alt="" />
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <p className="text-gray-500 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#003580]">{property.currency} {property.price.toLocaleString()}</div>
                  <Badge variant="outline" className="mt-2">{property.type}</Badge>
                </div>
              </div>

              <div className="flex gap-8 py-6 border-y my-6">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-[#003580]" />
                  <span className="font-semibold">{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-[#003580]" />
                  <span className="font-semibold">{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-[#003580]" />
                  <span className="font-semibold">{property.area} m² Area</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Location</h3>
                  <GoogleMap location={property.location} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-8">
              <h3 className="text-xl font-bold mb-6">Secure Transaction</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-semibold">Verified Listing</p>
                    <p className="text-sm text-gray-500">Ownership documents verified by our legal team.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#003580] mt-1" />
                  <div>
                    <p className="font-semibold">Escrow Protection</p>
                    <p className="text-sm text-gray-500">Funds held securely until title transfer is complete.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Property Price</span>
                  <span>{property.currency} {property.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Legal & Admin Fees</span>
                  <span>{property.currency} {(property.price * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                  <span>Total Due</span>
                  <span>{property.currency} {(property.price * 1.05).toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full h-12 text-lg bg-[#003580] hover:bg-[#003580]/90">
                Initiate Transaction
              </Button>
              <p className="text-center text-xs text-gray-400 mt-4">
                By clicking, you agree to our Terms of Service and Escrow Agreement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
