import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users, Star, TrendingUp, Building2, Home, Shield, Zap, ChevronRight } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useProperties, type Property } from "@/hooks/useProperties";
import { useCountries } from "@/hooks/useCountries";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80";

const POPULAR_LOCATIONS = [
  { name: "Tanzania", flag: "🇹🇿", count: 245 },
  { name: "Kenya", flag: "🇰🇪", count: 189 },
  { name: "Uganda", flag: "🇺🇬", count: 134 },
  { name: "Rwanda", flag: "🇷🇼", count: 98 },
  { name: "South Africa", flag: "🇿🇦", count: 312 },
  { name: "Nigeria", flag: "🇳🇬", count: 156 },
  { name: "Ghana", flag: "🇬🇭", count: 87 },
  { name: "UAE", flag: "🇦🇪", count: 203 },
];

const DEAL_TYPES = [
  { value: "sale", labelEn: "Buy", labelZh: "购买" },
  { value: "rent", labelEn: "Rent", labelZh: "租房" },
  { value: "lease", labelEn: "Lease", labelZh: "长租" },
];

const Home = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  const { data: featured = [] } = useProperties({ limit: 12 });
  const { data: countries = [] } = useCountries();
  const { data: recent = [] } = useProperties({ limit: 8 });

  // Search state
  const [searchType, setSearchType] = useState<string>("sale");
  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");

  const onFind = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (country) params.set("country", country);
    if (propertyType) params.set("property_type", propertyType);
    if (searchType) params.set("type", searchType);
    navigate(`/listings?${params.toString()}`);
  };

  const handleLocationClick = (countryId: string) => {
    navigate(`/listings?country=${countryId}&type=${searchType}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Booking.com Style */}
      <section className="relative bg-booking-blue text-white">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-booking-blue via-booking-blue-light to-booking-blue" />
        
        <div className="container relative py-16 md:py-24">
          {/* Hero Header */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4 animate-fade-in">
              {lang === 'en' ? 'Find your next stay' : '寻找您的下一个住所'}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {lang === 'en' 
                ? 'Search properties across 195 countries with legal guarantee and escrow protection'
                : '在195个国家搜索房产，享受法律保障和托管保护'}
            </p>
          </div>

          {/* Main Search Bar - Booking.com Style */}
          <div className="max-w-5xl mx-auto animate-slide-up">
            <div className="bg-white rounded-xl shadow-booking-hover p-2 md:p-3">
              <div className="flex flex-col md:flex-row gap-2">
                {/* Where input */}
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <Input
                    placeholder={lang === 'en' ? "Where are you going?" : "您要去哪里？"}
                    className="pl-10 h-12 md:h-14 border-0 text-foreground text-base focus-visible:ring-booking-blue"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onFind()}
                  />
                </div>

                {/* Check-in (placeholder) */}
                <div className="relative hidden md:block">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <Input
                    placeholder={lang === 'en' ? "Check in" : "入住日期"}
                    type="date"
                    className="pl-10 h-12 md:h-14 border-0 border-l border-gray-200 text-foreground"
                  />
                </div>

                {/* Check-out (placeholder) */}
                <div className="relative hidden md:block">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <Input
                    placeholder={lang === 'en' ? "Check out" : "退房日期"}
                    type="date"
                    className="pl-10 h-12 md:h-14 border-0 border-l border-gray-200 text-foreground"
                  />
                </div>

                {/* Guests (placeholder) */}
                <div className="relative hidden lg:block">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <Input
                    placeholder={lang === 'en' ? "Guests" : "客人"}
                    type="number"
                    min="1"
                    className="pl-10 h-12 md:h-14 border-0 border-l border-gray-200 text-foreground"
                  />
                </div>

                {/* Search Button */}
                <Button 
                  size="lg" 
                  className="h-12 md:h-14 px-8 bg-booking-yellow text-booking-blue hover:bg-yellow-400 font-semibold rounded-lg"
                  onClick={onFind}
                >
                  <Search className="h-5 w-5 md:mr-2" />
                  <span className="hidden md:inline">
                    {lang === 'en' ? 'Search' : '搜索'}
                  </span>
                </Button>
              </div>

              {/* Deal type tabs */}
              <div className="flex items-center gap-1 mt-3 px-2">
                {DEAL_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSearchType(type.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      searchType === type.value
                        ? "bg-booking-blue text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {lang === 'en' ? type.labelEn : type.labelZh}
                  </button>
                ))}

                {/* Property type filter */}
                <Select value={propertyType || "__any__"} onValueChange={(v) => setPropertyType(v === "__any__" ? "" : v)}>
                  <SelectTrigger className="h-9 w-auto ml-2 border-0 bg-gray-100 text-sm">
                    <SelectValue placeholder={lang === 'en' ? "Property type" : "房产类型"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__any__">{lang === 'en' ? "Any type" : "所有类型"}</SelectItem>
                    <SelectItem value="house">{lang === 'en' ? "House" : "别墅"}</SelectItem>
                    <SelectItem value="apartment">{lang === 'en' ? "Apartment" : "公寓"}</SelectItem>
                    <SelectItem value="villa">{lang === 'en' ? "Villa" : "豪宅"}</SelectItem>
                    <SelectItem value="land">{lang === 'en' ? "Land" : "土地"}</SelectItem>
                    <SelectItem value="commercial">{lang === 'en' ? "Commercial" : "商业"}</SelectItem>
                  </SelectContent>
                </Select>

                {/* Country filter */}
                <Select value={country || "__any__"} onValueChange={(v) => setCountry(v === "__any__" ? "" : v)}>
                  <SelectTrigger className="h-9 w-auto border-0 bg-gray-100 text-sm">
                    <SelectValue placeholder={lang === 'en' ? "Any country" : "任何国家"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-64 overflow-y-auto">
                    <SelectItem value="__any__">{lang === 'en' ? "Any country" : "任何国家"}</SelectItem>
                    {countries.filter((c) => c.is_active).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.flag_emoji ? `${c.flag_emoji} ` : ""}{c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center justify-center gap-8 mt-8 text-white/80">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <span className="text-sm">{lang === 'en' ? '12,500+ Properties' : '12,500+ 房产'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">{lang === 'en' ? '195 Countries' : '195 个国家'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span className="text-sm">{lang === 'en' ? '4.8/5 Rating' : '4.8/5 评分'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Banner */}
      <section className="bg-booking-yellow/10 border-b border-booking-yellow/20">
        <div className="container py-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/listings?ai=true" className="flex items-center gap-2 text-sm font-medium text-booking-blue hover:underline">
              <Zap className="h-4 w-4" />
              {lang === 'en' ? '✨ Smart Search with AI' : '✨ AI智能搜索'}
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-600">
              {lang === 'en' ? 'Try: "3 bedroom villa in Dar es Salaam under $200k"' : '试试："达累斯萨拉姆20万美元以下的3室别墅"'}
            </span>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-header mb-0">
              {lang === 'en' ? 'Popular destinations' : '热门目的地'}
            </h2>
            <Link to="/listings" className="text-sm font-medium text-booking-blue hover:underline flex items-center gap-1">
              {lang === 'en' ? 'View all' : '查看全部'}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {POPULAR_LOCATIONS.map((loc, i) => {
              const country = countries.find(c => c.name === loc.name);
              return (
                <button
                  key={loc.name}
                  onClick={() => country && handleLocationClick(country.id)}
                  className={`group relative overflow-hidden rounded-xl ${
                    i === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-[4/3]'
                  }`}
                >
                  <img
                    src={`https://source.unsplash.com/800x600/?${loc.name.toLowerCase()},city,africa`}
                    alt={loc.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className={`font-semibold ${i === 0 ? 'text-2xl' : 'text-lg'}`}>{loc.name}</h3>
                    <p className="text-sm text-white/80">{loc.count} {lang === 'en' ? 'properties' : '处房产'}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recently Listed Properties */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-header mb-0">
              {lang === 'en' ? 'Recently listed' : '最新发布'}
            </h2>
            <Link to="/listings" className="text-sm font-medium text-booking-blue hover:underline flex items-center gap-1">
              {lang === 'en' ? 'View all' : '查看全部'}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recent.slice(0, 4).map((property, i) => (
              <div key={property.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-header mb-2">
              {lang === 'en' ? 'Why book with us' : '选择我们的理由'}
            </h2>
            <p className="section-subheader">
              {lang === 'en' 
                ? 'Every property transaction backed by legal guarantee and escrow protection'
                : '每笔房产交易均享受法律保障和托管保护'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-booking-blue-lighter rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-booking-blue" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-2">
                {lang === 'en' ? 'Legal Guarantee' : '法律保障'}
              </h3>
              <p className="text-gray-500 text-sm">
                {lang === 'en' 
                  ? 'Every transaction handled by verified local law firms. Your property rights protected.'
                  : '每笔交易由当地认证律师事务所处理，保护您的产权。'}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-booking-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-booking-yellow" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-2">
                {lang === 'en' ? 'Best Price Guarantee' : '最佳价格保障'}
              </h3>
              <p className="text-gray-500 text-sm">
                {lang === 'en' 
                  ? 'We negotiate on your behalf and offer transparent pricing with no hidden fees.'
                  : '我们代表您谈判，提供透明定价，无隐藏费用。'}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-booking-green" />
              </div>
              <h3 className="font-serif text-xl text-gray-900 mb-2">
                {lang === 'en' ? 'Instant AI Assistance' : '即时AI助手'}
              </h3>
              <p className="text-gray-500 text-sm">
                {lang === 'en' 
                  ? 'Our AI chatbot helps you find the perfect property 24/7 with natural language search.'
                  : '我们的AI聊天机器人全天候帮助您使用自然语言搜索找到理想房产。'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-booking-blue text-white py-16">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            {lang === 'en' ? 'Ready to find your dream property?' : '准备好找到您的梦想房产了吗？'}
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {lang === 'en' 
              ? 'Join thousands of satisfied buyers and sellers who trust TzDalali for their property transactions.'
              : '加入成千上万信任TzDalali进行房产交易的满意买卖双方。'}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button asChild size="lg" className="bg-booking-yellow text-booking-blue hover:bg-yellow-400 font-semibold">
              <Link to="/listings">
                {lang === 'en' ? 'Browse Properties' : '浏览房产'}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-booking-blue">
              <Link to="/auth">
                {lang === 'en' ? 'Create Account' : '创建账户'}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;