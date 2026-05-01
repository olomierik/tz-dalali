import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { useProperties } from "@/hooks/useProperties";
import { Plus, Building2, Eye, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/dashboard/StatCard";

export default function SellerDashboardPage() {
  const { profile } = useAuthContext();
  const { data: properties } = useProperties({ 
    seller_id: profile?.id,
    status: 'any',
  });

  const activeListings = properties?.filter(p => p.status === 'active').length || 0;
  const totalViews = properties?.reduce((sum, p) => sum + p.views, 0) || 0;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-gray-500">Manage your listings and track performance</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link to="/seller/listings/new?type=property">
              <Plus className="h-4 w-4 mr-2" />
              List Property
            </Link>
          </Button>
          <Button asChild>
            <Link to="/seller/listings/new?type=car">
              <Plus className="h-4 w-4 mr-2" />
              List Car
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Building2}
          label="Total Listings"
          value={properties?.length || 0}
          href="/seller/listings"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Listings"
          value={activeListings}
          href="/seller/listings"
        />
        <StatCard
          icon={Eye}
          label="Total Views"
          value={totalViews.toLocaleString()}
        />
        <StatCard
          icon={Building2}
          label="Featured Properties"
          value={properties?.filter(p => p.is_featured).length || 0}
        />
      </div>

      {/* Recent Listings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Listings</CardTitle>
          <Button variant="ghost" asChild>
            <Link to="/seller/listings">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {properties && properties.length > 0 ? (
            <div className="space-y-3">
              {properties.slice(0, 5).map(property => (
                <Link
                  key={property.id}
                  to={`/listings/${property.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
                    {property.featured_image && (
                      <img 
                        src={property.featured_image} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{property.title}</p>
                    <p className="text-sm text-gray-500">
                      ${property.price.toLocaleString()} • {property.views} views
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded capitalize ${
                    property.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : property.status === 'draft'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {property.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No listings yet</p>
              <Button asChild>
                <Link to="/seller/listings/new">Create Your First Listing</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}