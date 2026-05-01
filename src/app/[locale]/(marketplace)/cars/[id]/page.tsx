"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gauge, Settings2, Fuel, MapPin, Shield, CheckCircle2 } from "lucide-react";
import { GoogleMap } from "@/components/shared/GoogleMap";

export default function CarDetailPage() {
  const params = useParams();
  const id = params.id as any;
  const car = useQuery(api.listings.getCarById, { id });

  if (!car) return <div className="container mx-auto py-20 text-center">Loading car details...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
              <div className="p-2">
                <img src={car.images[0]} className="w-full h-[450px] object-cover rounded-lg" alt="" />
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {car.images.slice(1, 5).map((img: string, i: number) => (
                    <img key={i} src={img} className="w-full h-24 object-cover rounded-lg" alt="" />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{car.year} {car.make} {car.model}</h1>
                  <p className="text-gray-500 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {car.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#003580]">{car.currency} {car.price.toLocaleString()}</div>
                  <Badge variant="outline" className="mt-2">{car.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y my-6">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Gauge className="h-6 w-6 text-[#003580] mb-2" />
                  <span className="text-xs text-gray-500">Mileage</span>
                  <span className="font-bold">{car.mileage.toLocaleString()} km</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Settings2 className="h-6 w-6 text-[#003580] mb-2" />
                  <span className="text-xs text-gray-500">Transmission</span>
                  <span className="font-bold">{car.transmission}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Fuel className="h-6 w-6 text-[#003580] mb-2" />
                  <span className="text-xs text-gray-500">Fuel Type</span>
                  <span className="font-bold">{car.fuelType}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Shield className="h-6 w-6 text-[#003580] mb-2" />
                  <span className="text-xs text-gray-500">Body Type</span>
                  <span className="font-bold">{car.bodyType}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{car.description}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4">Location</h3>
                  <GoogleMap location={car.location} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-8">
              <h3 className="text-xl font-bold mb-6">Purchase Options</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-semibold">Inspection Guarantee</p>
                    <p className="text-sm text-gray-500">Book a professional inspection before final payment.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#003580] mt-1" />
                  <div>
                    <p className="font-semibold">Secure Escrow</p>
                    <p className="text-sm text-gray-500">Your money is safe until you receive the car and documents.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full h-12 text-lg bg-[#003580] hover:bg-[#003580]/90">
                  Buy Now
                </Button>
                <Button variant="outline" className="w-full h-12 text-lg border-[#003580] text-[#003580]">
                  Book Inspection
                </Button>
              </div>
              
              <p className="text-center text-xs text-gray-400 mt-4">
                Shipping and registration services available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
