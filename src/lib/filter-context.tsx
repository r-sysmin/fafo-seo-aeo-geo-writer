import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface PagesFilters {
  search?: string;
  sortBy?: 'updated_at' | 'url' | 'title';
  sortDir?: 'asc' | 'desc';
  page?: number;
}

interface FilterContextValue {
  filters: PagesFilters;
  setFilters: (updates: Partial<PagesFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: PagesFilters = {
  search: '',
  sortBy: 'updated_at',
  sortDir: 'desc',
  page: 0,
};

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<PagesFilters>(defaultFilters);

  const setFilters = useCallback((updates: Partial<PagesFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be inside FilterProvider');
  return ctx;
}
