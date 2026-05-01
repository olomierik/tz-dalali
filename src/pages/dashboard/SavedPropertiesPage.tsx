import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSavedProperties, useProperty } from "@/hooks/useProperties";
import { Heart, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useState } from "react";
import { useSaveProperty } from "@/hooks/useProperties";

export default function SavedPropertiesPage() {
  const { data: savedIds, isLoading } = useSavedProperties();
  const { mutate: toggleSave } = useSaveProperty();
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemove = (propertyId: string) => {
    setRemoving(propertyId);
    toggleSave({ propertyId, saved: true }, {
      onSettled: () => setRemoving(null),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Saved Properties</h1>
          <p className="text-gray-500">
            {savedIds?.length || 0} saved properties
          </p>
        </div>
      </div>

      {savedIds && savedIds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedIds.map(id => (
            <PropertyCardWrapper
              key={id}
              propertyId={id}
              onRemove={() => handleRemove(id)}
              isRemoving={removing === id}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No saved properties</h3>
            <p className="text-gray-500 mb-6">Start browsing and save properties you like</p>
            <Button asChild>
              <Link to="/listings">
                <ExternalLink className="h-4 w-4 mr-2" />
                Browse Properties
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PropertyCardWrapper({ 
  propertyId, 
  onRemove, 
  isRemoving 
}: { 
  propertyId: string
  onRemove: () => void
  isRemoving: boolean
}) {
  const { data: property } = useProperty(propertyId);

  if (!property) return null;

  return (
    <div className="relative">
      <PropertyCard property={property} saved />
      <button
        onClick={onRemove}
        disabled={isRemoving}
        className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow text-gray-600 hover:text-red-500 transition-colors"
      >
        {isRemoving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}