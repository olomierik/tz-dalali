import { Badge } from "@/components/ui/badge";
import { Gauge, Settings2, Fuel, MapPin } from "lucide-react";
import Link from "next/link";

export function CarCard({ car }: { car: any }) {
  return (
    <Link href={`/cars/${car._id}`} className="group block bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img src={car.images[0]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2 right-2">
          <Badge className="bg-[#003580]">{car.year}</Badge>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg line-clamp-1">{car.make} {car.model}</h3>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="h-3 w-3 mr-1" />
          {car.location}
        </div>
        <div className="flex gap-4 text-sm text-gray-600 mb-4 border-t pt-4">
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4" /> {car.mileage.toLocaleString()} km
          </div>
          <div className="flex items-center gap-1">
            <Settings2 className="h-4 w-4" /> {car.transmission}
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4" /> {car.fuelType}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-[#003580]">{car.currency} {car.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400">Available</span>
        </div>
      </div>
    </Link>
  );
}
