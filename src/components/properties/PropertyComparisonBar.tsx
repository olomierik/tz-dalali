import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, GitCompare, ArrowRight } from 'lucide-react';
import { useComparison } from '@/contexts/ComparisonContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function PropertyComparisonBar() {
  const { properties, removeProperty, clearProperties } = useComparison();
  const { lang } = useLanguage();

  if (properties.length === 0) return null;

  return (
    <div className="comparison-bar animate-slide-up">
      <div className="container">
        <div className="flex items-center gap-4">
          {/* Properties preview */}
          <div className="flex items-center gap-2 flex-1">
            <GitCompare className="h-5 w-5 text-booking-blue shrink-0" />
            <span className="text-sm font-medium text-gray-700 hidden md:inline">
              {lang === 'en' ? 'Compare' : '对比'}
            </span>
            
            <div className="flex items-center gap-2 ml-2">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="relative group"
                >
                  <img
                    src={property.featured_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80'}
                    alt={property.title}
                    className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm"
                  />
                  <button
                    onClick={() => removeProperty(property.id)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
              
              {properties.length < 4 && (
                <div className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                  <span className="text-xs">+</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {properties.length}/4
            </span>
            
            {properties.length >= 2 && (
              <Button
                asChild
                size="sm"
                className="gap-1.5 bg-booking-blue hover:bg-booking-blue-light"
              >
                <Link to="/compare">
                  {lang === 'en' ? 'Compare Now' : '立即对比'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={clearProperties}
              className="text-gray-500 hover:text-gray-700"
            >
              {lang === 'en' ? 'Clear' : '清除'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}