import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useProperty, type Property } from "@/hooks/useProperties";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BedDouble, Bath, Maximize2, MapPin, Phone, Mail, Calendar, 
  ShieldCheck, Car, Trees, Wifi, Wind, Utensils, Tv, Shield, 
  ChevronLeft, ChevronRight, Heart, Share2, GitCompare, Check,
  Loader2, ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyComparisonBar } from "@/components/properties/PropertyComparisonBar";
import { useProperties } from "@/hooks/useProperties";
import { toast } from "sonner";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80";

const dealTypeLabel: Record<string, string> = {
  sale: "For Sale",
  rent: "For Rent",
  lease: "For Lease",
};

const amenityIcons: Record<string, React.ElementType> = {
  pool: Trees,
  garden: Trees,
  parking: Car,
  security: Shield,
  elevator: Wind,
  furnished: Utensils,
  wifi: Wifi,
  ac: Wind,
  tv: Tv,
};

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: property, isLoading } = useProperty(id);
  const { data: similarProperties } = useProperties({
    property_type: property?.property_type,
    limit: 4,
  });
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const images = property?.images?.length 
    ? property.images 
    : property?.featured_image 
      ? [property.featured_image, FALLBACK_IMAGE]
      : [FALLBACK_IMAGE];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: property?.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-[500px] bg-gray-200 rounded-xl" />
            <div className="h-10 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <p className="text-gray-500 mb-6">This property may have been removed or doesn't exist.</p>
          <Button asChild>
            <Link to="/listings">Browse Properties</Link>
          </Button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const amenities = property.amenities || [];
  const features = property.features || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gold">Home</Link>
            <span>/</span>
            <Link to="/listings" className="hover:text-gold">Listings</Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{property.title}</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="relative mb-8">
          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-200">
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      i === currentImageIndex ? "bg-white" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={cn(
                "p-2 rounded-full shadow transition-colors",
                isSaved ? "bg-red-500 text-white" : "bg-white/90 hover:bg-white text-gray-600"
              )}
            >
              <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-white/90 hover:bg-white rounded-full shadow text-gray-600 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-booking-blue text-white">
              {dealTypeLabel[property.deal_type]}
            </Badge>
            {property.is_featured && (
              <Badge className="bg-booking-yellow text-booking-blue">Featured</Badge>
            )}
            {property.is_verified && (
              <Badge className="bg-green-500 text-white flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Verified
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
                  <p className="flex items-center gap-1 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    {property.neighborhood || 'Location not specified'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-serif text-3xl font-bold text-gold">
                    {formatPrice(property.price, property.price_currency)}
                  </div>
                  {property.deal_type === 'rent' && property.rent_period && (
                    <span className="text-gray-500 text-sm">/ {property.rent_period}</span>
                  )}
                  {property.price_negotiable && (
                    <Badge variant="outline" className="ml-2 text-xs">Negotiable</Badge>
                  )}
                </div>
              </div>

              {/* Key Stats */}
              <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border border-gray-200">
                {property.bedrooms != null && (
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                {property.size_sqm != null && (
                  <div className="flex items-center gap-2">
                    <Maximize2 className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{property.size_sqm.toLocaleString()} m²</span>
                  </div>
                )}
                <div className="ml-auto text-sm text-gray-400 capitalize">{property.property_type}</div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {(features.length > 0 || property.year_built || property.floors || property.parking_spaces) && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Property Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.year_built && (
                      <div>
                        <p className="text-gray-500 text-sm">Year Built</p>
                        <p className="font-medium">{property.year_built}</p>
                      </div>
                    )}
                    {property.floors && (
                      <div>
                        <p className="text-gray-500 text-sm">Floors</p>
                        <p className="font-medium">{property.floors}</p>
                      </div>
                    )}
                    {property.parking_spaces && (
                      <div>
                        <p className="text-gray-500 text-sm">Parking</p>
                        <p className="font-medium">{property.parking_spaces} spaces</p>
                      </div>
                    )}
                    {property.title_deed_type && (
                      <div>
                        <p className="text-gray-500 text-sm">Title Deed</p>
                        <p className="font-medium">{property.title_deed_type}</p>
                      </div>
                    )}
                    {features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity, i) => {
                      const Icon = amenityIcons[amenity.toLowerCase()] || Check;
                      return (
                        <div key={i} className="flex items-center gap-2 text-gray-600">
                          <Icon className="h-4 w-4 text-gold" />
                          <span className="text-sm capitalize">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            {property.latitude && property.longitude && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Location</h2>
                  <div className="aspect-[16/9] rounded-lg bg-gray-100 overflow-hidden">
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.01},${property.latitude - 0.01},${property.longitude + 0.01},${property.latitude + 0.01}&layer=mapnik&marker=${property.latitude},${property.longitude}`}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                  {property.full_address && (
                    <p className="mt-3 text-gray-600 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {property.full_address}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Legal Info */}
            {(property.legal_status || property.legal_notes) && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-gold" />
                    Legal Information
                  </h2>
                  {property.legal_status && (
                    <div className="mb-4">
                      <p className="text-gray-500 text-sm">Legal Status</p>
                      <p className="font-medium">{property.legal_status}</p>
                    </div>
                  )}
                  {property.legal_notes && (
                    <p className="text-gray-600 text-sm">{property.legal_notes}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-8 w-8 text-gold" />
                  </div>
                  <h3 className="font-bold text-lg">Schedule a Viewing</h3>
                  <p className="text-gray-500 text-sm">Contact the seller to arrange a visit</p>
                </div>
                <div className="space-y-3">
                  <Button className="w-full bg-gold hover:bg-gold/90 text-black" asChild>
                    <a href="tel:+255123456789">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="mailto:seller@example.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </a>
                  </Button>
                </div>
                <Separator className="my-6" />
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span>Verified by TzDalali Partner</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold mb-4">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Views</span>
                    <span className="font-medium">{property.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Listed</span>
                    <span className="font-medium">
                      {new Date(property.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Updated</span>
                    <span className="font-medium">
                      {new Date(property.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties && similarProperties.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-bold">Similar Properties</h2>
              <Button variant="ghost" asChild>
                <Link to="/listings">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties
                .filter(p => p.id !== property.id)
                .slice(0, 4)
                .map(p => (
                  <PropertyCard key={p.id} property={p} showCompare={false} />
                ))}
            </div>
          </section>
        )}
      </main>

      <PropertyComparisonBar />
      <SiteFooter />
    </div>
  );
}