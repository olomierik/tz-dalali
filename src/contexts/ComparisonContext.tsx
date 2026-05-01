import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import type { Property } from '@/hooks/useProperties';

interface ComparisonContextType {
  properties: Property[];
  addProperty: (property: Property) => void;
  removeProperty: (id: string) => void;
  clearProperties: () => void;
  isInComparison: (id: string) => boolean;
  maxProperties: number;
}

const ComparisonContext = createContext<ComparisonContextType>({
  properties: [],
  addProperty: () => {},
  removeProperty: () => {},
  clearProperties: () => {},
  isInComparison: () => false,
  maxProperties: 4,
});

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const maxProperties = 4;

  const addProperty = useCallback((property: Property) => {
    setProperties((prev) => {
      if (prev.length >= maxProperties) return prev;
      if (prev.some((p) => p.id === property.id)) return prev;
      return [...prev, property];
    });
  }, []);

  const removeProperty = useCallback((id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearProperties = useCallback(() => {
    setProperties([]);
  }, []);

  const isInComparison = useCallback(
    (id: string) => properties.some((p) => p.id === id),
    [properties]
  );

  return (
    <ComparisonContext.Provider
      value={{ properties, addProperty, removeProperty, clearProperties, isInComparison, maxProperties }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export const useComparison = () => useContext(ComparisonContext);