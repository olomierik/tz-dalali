import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useProperties } from "@/hooks/useProperties";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, MapPin, Building2, BedDouble, DollarSign } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

const DEAL_TYPES = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'lease', label: 'For Lease' },
];

const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'office', label: 'Office' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'hotel', label: 'Hotel' },
];

const BEDROOM_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
];

export default function Listings() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [dealType, setDealType] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [minBeds, setMinBeds] = useState<string>("any");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");

  const { data: properties, isLoading } = useProperties({
    search: search || undefined,
    deal_type: dealType as 'sale' | 'rent' | 'lease' || undefined,
    property_type: propertyType || undefined,
    bedrooms_min: minBeds !== 'any' ? parseInt(minBeds) : undefined,
    price_min: priceMin ? parseInt(priceMin) : undefined,
    price_max: priceMax ? parseInt(priceMax) : undefined,
  });

  const clearFilters = () => {
    setSearch("");
    setDealType("");
    setPropertyType("");
    setMinBeds("any");
    setPriceMin("");
    setPriceMax("");
  };

  const hasFilters = search || dealType || propertyType || minBeds !== 'any' || priceMin || priceMax;

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-serif text-3xl font-bold mb-2">{t('vertical.real_estate')}</h1>
          <p className="text-gray-500">
            {t('vertical.real_estate_desc')} | {properties?.length || 0} listings
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                className="pl-10 h-12" 
                placeholder="Search by location, keyword, or property name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={dealType} onValueChange={setDealType}>
                <SelectTrigger className="w-[140px] h-12">
                  <SelectValue placeholder="Deal Type" />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-[140px] h-12">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={minBeds} onValueChange={setMinBeds}>
                <SelectTrigger className="w-[100px] h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BEDROOM_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label} Beds</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Advanced Filters Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-12">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Advanced Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                      <Label>Price Range (USD)</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="number" 
                          placeholder="Min" 
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                        />
                        <Input 
                          type="number" 
                          placeholder="Max" 
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input placeholder="Country, region, or district" />
                    </div>
                    <div className="space-y-2">
                      <Label>Amenities</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Pool', 'Garden', 'Parking', 'Security', 'Elevator', 'Furnished'].map(a => (
                          <label key={a} className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="rounded" /> {a}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button onClick={clearFilters} variant="outline" className="w-full">
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {hasFilters && (
                <Button variant="ghost" onClick={clearFilters} className="text-gold">
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {dealType && (
              <span className="px-3 py-1 bg-gold/10 text-gold text-sm rounded-full flex items-center gap-1">
                {DEAL_TYPES.find(t => t.value === dealType)?.label}
                <button onClick={() => setDealType("")} className="hover:text-gold/70">×</button>
              </span>
            )}
            {propertyType && (
              <span className="px-3 py-1 bg-gold/10 text-gold text-sm rounded-full flex items-center gap-1">
                {PROPERTY_TYPES.find(t => t.value === propertyType)?.label}
                <button onClick={() => setPropertyType("")} className="hover:text-gold/70">×</button>
              </span>
            )}
            {minBeds !== 'any' && (
              <span className="px-3 py-1 bg-gold/10 text-gold text-sm rounded-full flex items-center gap-1">
                {minBeds}+ Beds
                <button onClick={() => setMinBeds("any")} className="hover:text-gold/70">×</button>
              </span>
            )}
            {(priceMin || priceMax) && (
              <span className="px-3 py-1 bg-gold/10 text-gold text-sm rounded-full flex items-center gap-1">
                ${priceMin || '0'} - ${priceMax || '∞'}
                <button onClick={() => { setPriceMin(""); setPriceMax(""); }} className="hover:text-gold/70">×</button>
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <PropertyGrid properties={[]} loading />
        ) : properties && properties.length > 0 ? (
          <PropertyGrid properties={properties} />
        ) : (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
            <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}