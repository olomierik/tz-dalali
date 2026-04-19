import { Link } from 'react-router-dom'
import { Heart, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSavedProperties, useProperties, useSaveProperty } from '@/hooks/useProperties'
import { PropertyGrid } from '@/components/properties/PropertyGrid'

export default function SavedProperties() {
  const { data: savedIds = [] } = useSavedProperties()
  const { data: savedProperties = [], isLoading } = useProperties({
    ids: savedIds.length > 0 ? savedIds : undefined,
    status: 'active',
  })
  const saveProperty = useSaveProperty()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl text-primary">Saved Properties</h1>
        <p className="text-muted-foreground mt-1">Properties you've saved for later.</p>
      </div>

      {isLoading ? (
        <PropertyGrid properties={[]} loading={true} savedIds={[]} />
      ) : savedIds.length === 0 || savedProperties.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-14 w-14 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-primary mb-2">No saved properties yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Browse listings and tap the heart icon to save properties you love.
          </p>
          <Button asChild variant="gold">
            <Link to="/listings"><Search className="h-4 w-4 mr-2" />Browse Properties</Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {savedProperties.length} saved {savedProperties.length === 1 ? 'property' : 'properties'}
          </p>
          <PropertyGrid
            properties={savedProperties}
            loading={false}
            savedIds={savedIds}
            onSaveToggle={(propertyId, currentlySaved) =>
              saveProperty.mutate({ propertyId, saved: currentlySaved })
            }
          />
        </>
      )}
    </div>
  )
}
