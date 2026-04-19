import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import { useCountries, useRegions, useDistricts } from "@/hooks/useCountries";
import { useLanguage } from "@/contexts/LanguageContext";

export const HeroSearch = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [dealType, setDealType] = useState<"sale" | "rent" | "lease">("sale");
  const [countryId, setCountryId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [keyword, setKeyword] = useState("");

  const { data: countries = [], isLoading: cLoading } = useCountries();
  const { data: regions = [] } = useRegions(countryId || null);
  const { data: districts = [] } = useDistricts(regionId || null);

  const dealTypes = [
    { value: "sale" as const, label: t('search.buy') },
    { value: "rent" as const, label: t('search.rent') },
    { value: "lease" as const, label: t('search.lease') },
  ];

  const handleCountryChange = (v: string) => {
    setCountryId(v);
    setRegionId("");
    setDistrictId("");
  };

  const handleRegionChange = (v: string) => {
    setRegionId(v);
    setDistrictId("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ type: dealType });
    if (countryId) params.set("country", countryId);
    if (regionId) params.set("region", regionId);
    if (districtId) params.set("district", districtId);
    if (keyword.trim()) params.set("q", keyword.trim());
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="bg-background/95 backdrop-blur shadow-luxe rounded-xl p-4 md:p-5 border border-gold/20"
    >
      {/* Deal type tabs */}
      <div className="flex gap-1 mb-4 bg-muted/60 rounded-lg p-1 w-fit">
        {dealTypes.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setDealType(value)}
            className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all ${
              dealType === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Location + keyword row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.2fr_auto] gap-2.5">
        {/* Country */}
        <Select value={countryId || ANY_LOCATION} onValueChange={(value) => handleCountryChange(value === ANY_LOCATION ? "" : value)} disabled={cLoading}>
          <SelectTrigger className="h-12 bg-background gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
            <SelectValue placeholder={cLoading ? t('listings.loading') : t('search.country')} />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto">
            <SelectItem value="">{t('search.country')}</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.flag_emoji ? `${c.flag_emoji} ` : ""}{c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Region */}
          <Select
            value={regionId || ANY_LOCATION}
            onValueChange={(value) => handleRegionChange(value === ANY_LOCATION ? "" : value)}
          >
          <SelectTrigger className="h-12 bg-background">
            <SelectValue placeholder={t('search.region')} />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto">
            <SelectItem value="">{t('search.region')}</SelectItem>
            {regions.map((r) => (
              <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* District */}
          <Select
            value={districtId || ANY_LOCATION}
            onValueChange={(value) => setDistrictId(value === ANY_LOCATION ? "" : value)}
          >
          <SelectTrigger className="h-12 bg-background">
            <SelectValue placeholder={t('search.district')} />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto">
            <SelectItem value="">{t('search.district')}</SelectItem>
            {districts.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Keyword */}
        <Input
          placeholder={t('search.keyword_ph')}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="h-12 bg-background"
        />

        {/* Search */}
        <Button type="submit" variant="gold" size="lg" className="h-12 px-7 gap-2 sm:col-span-2 lg:col-span-1">
          <Search className="h-4 w-4" />
          {t('search.button')}
        </Button>
      </div>
    </form>
  );
};
