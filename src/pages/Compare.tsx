import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Check, AlertCircle, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComparison } from '@/contexts/ComparisonContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const COMPARISON_FIELDS = [
  { key: 'price', labelEn: 'Price', labelZh: '价格', format: (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v) },
  { key: 'property_type', labelEn: 'Type', labelZh: '类型', format: (v: string) => v.charAt(0).toUpperCase() + v.slice(1) },
  { key: 'deal_type', labelEn: 'Deal', labelZh: '交易类型', format: (v: string) => v === 'sale' ? 'For Sale' : v === 'rent' ? 'For Rent' : 'Lease' },
  { key: 'bedrooms', labelEn: 'Bedrooms', labelZh: '卧室', format: (v: number | null) => v ?? '-' },
  { key: 'bathrooms', labelEn: 'Bathrooms', labelZh: '浴室', format: (v: number | null) => v ?? '-' },
  { key: 'size_sqm', labelEn: 'Size (m²)', labelZh: '面积 (平方米)', format: (v: number | null) => v ? `${v.toLocaleString()} m²` : '-' },
  { key: 'year_built', labelEn: 'Year Built', labelZh: '建造年份', format: (v: number | null) => v ?? '-' },
  { key: 'floors', labelEn: 'Floors', labelZh: '楼层', format: (v: number | null) => v ?? '-' },
  { key: 'parking_spaces', labelEn: 'Parking', labelZh: '停车位', format: (v: number | null) => v ?? '-' },
  { key: 'is_verified', labelEn: 'Verified', labelZh: '已认证', format: (v: boolean | null) => v ? '✓' : '✗', bool: true },
  { key: 'is_featured', labelEn: 'Featured', labelZh: '精选', format: (v: boolean | null) => v ? '✓' : '✗', bool: true },
  { key: 'price_negotiable', labelEn: 'Negotiable', labelZh: '可协商', format: (v: boolean | null) => v ? '✓' : '✗', bool: true },
  { key: 'title_deed_type', labelEn: 'Title Deed', labelZh: '产权类型', format: (v: string | null) => v ?? '-' },
  { key: 'amenities', labelEn: 'Amenities', labelZh: '设施', isArray: true, format: (v: string[] | null) => v?.join(', ') || '-' },
  { key: 'features', labelEn: 'Features', labelZh: '特点', isArray: true, format: (v: string[] | null) => v?.join(', ') || '-' },
];

const FALLBACK = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';

export default function Compare() {
  const { properties, removeProperty, clearProperties } = useComparison();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  if (properties.length < 2) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-16">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-booking-blue mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === 'en' ? 'Back to listings' : '返回列表'}
          </button>

          <div className="text-center py-16">
            <GitCompare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="font-serif text-2xl text-gray-900 mb-2">
              {lang === 'en' ? 'Not enough properties to compare' : '没有足够的房产进行比较'}
            </h1>
            <p className="text-gray-500 mb-6">
              {lang === 'en' 
                ? 'You need at least 2 properties to use the comparison feature.'
                : '您需要至少2处房产才能使用比较功能。'}
            </p>
            <Button asChild className="bg-booking-blue hover:bg-booking-blue-light">
              <Link to="/listings">
                {lang === 'en' ? 'Browse Properties' : '浏览房产'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const highlightBest = (field: typeof COMPARISON_FIELDS[0]) => {
    if (field.key === 'price') {
      const prices = properties.map(p => p.price);
      const min = Math.min(...prices);
      return properties.map(p => p.price === min);
    }
    if (field.key === 'size_sqm') {
      const sizes = properties.map(p => p.size_sqm ?? 0);
      const max = Math.max(...sizes);
      return properties.map(p => (p.size_sqm ?? 0) === max && max > 0);
    }
    if (field.key === 'bedrooms' || field.key === 'bathrooms') {
      const vals = properties.map(p => p[field.key as 'bedrooms' | 'bathrooms'] ?? 0);
      const max = Math.max(...vals);
      return properties.map(p => (p[field.key as 'bedrooms' | 'bathrooms'] ?? 0) === max && max > 0);
    }
    return properties.map(() => false);
  };

  const bestFlags = COMPARISON_FIELDS.map(field => highlightBest(field));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-booking-blue transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h1 className="font-serif text-xl text-gray-900">
                {lang === 'en' ? 'Compare Properties' : '房产比较'}
              </h1>
              <span className="text-sm text-gray-500">
                ({properties.length} {lang === 'en' ? 'properties' : '处房产'})
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearProperties}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4 mr-1" />
              {lang === 'en' ? 'Clear All' : '清除全部'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="min-w-[800px]">
            {/* Property Cards Row */}
            <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: `repeat(${properties.length}, 1fr)` }}>
              {properties.map((property) => (
                <div key={property.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  {/* Image */}
                  <div className="relative aspect-[4/3]">
                    <img
                      src={property.featured_image || FALLBACK}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeProperty(property.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                    {property.is_featured && (
                      <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded bg-booking-yellow text-booking-blue">
                        {lang === 'en' ? 'Featured' : '精选'}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <Link to={`/listings/${property.id}`}>
                      <h3 className="font-serif text-lg text-gray-900 hover:text-booking-blue transition-colors line-clamp-2 mb-2">
                        {property.title}
                      </h3>
                    </Link>
                    {property.neighborhood && (
                      <p className="text-sm text-gray-500 mb-3">{property.neighborhood}</p>
                    )}
                    <p className="font-serif text-2xl font-semibold text-booking-blue">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(property.price)}
                    </p>
                    <Button asChild size="sm" className="w-full mt-4 bg-booking-blue hover:bg-booking-blue-light">
                      <Link to={`/listings/${property.id}`}>
                        {lang === 'en' ? 'View Details' : '查看详情'}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-gray-100">
                {COMPARISON_FIELDS.map((field, fieldIdx) => {
                  const isBestRow = bestFlags[fieldIdx].some(Boolean);
                  
                  return (
                    <div
                      key={field.key}
                      className={cn(
                        'grid gap-4 px-4 py-3 items-center',
                        isBestRow && 'bg-booking-yellow/5'
                      )}
                      style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}
                    >
                      {/* Field Label */}
                      <div className="font-medium text-sm text-gray-600">
                        {lang === 'en' ? field.labelEn : field.labelZh}
                      </div>

                      {/* Property Values */}
                      {properties.map((property, propIdx) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const value = (property as any)[field.key];
                        const formatted = field.format(value);
                        const isBest = bestFlags[fieldIdx][propIdx];

                        return (
                          <div
                            key={property.id}
                            className={cn(
                              'text-sm text-center',
                              isBestRow && isBest && 'font-semibold text-booking-blue',
                              !isBestRow && 'text-gray-700'
                            )}
                          >
                            {field.bool ? (
                              <span className={cn(
                                'inline-flex items-center justify-center w-6 h-6 rounded-full',
                                value ? 'bg-booking-green text-white' : 'bg-gray-200 text-gray-400'
                              )}>
                                {value ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                              </span>
                            ) : field.isArray ? (
                              <span className="text-xs leading-relaxed">{formatted}</span>
                            ) : (
                              formatted
                            )}
                            {isBestRow && isBest && field.key === 'price' && (
                              <span className="ml-1 text-xs text-booking-green">({lang === 'en' ? 'Best price' : '最低价'})</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-4">
                {lang === 'en' 
                  ? 'Want to see more details or ask questions about these properties?'
                  : '想查看更多详情或咨询这些房产吗？'}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button asChild className="bg-booking-blue hover:bg-booking-blue-light">
                  <Link to="/contact">
                    {lang === 'en' ? 'Contact an Agent' : '联系房产经纪'}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-booking-blue text-booking-blue hover:bg-booking-blue-lighter">
                  <Link to="/listings">
                    {lang === 'en' ? 'Browse More' : '浏览更多'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}