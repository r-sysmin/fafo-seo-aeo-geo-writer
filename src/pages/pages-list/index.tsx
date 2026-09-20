import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { Button } from '@/components/base/button';
import { Input } from '@/components/ui/input';
import { useDataProvider } from '@/lib/data-provider';
import { useAuth } from '@/lib/auth/auth-provider';
import { supabase } from '@/integrations/supabase/client';
import { useFilters } from '@/lib/filter-context';
import { PagesTable } from './components/pages-table';
import { PagesBlankslate } from './components/pages-blankslate';

type SortField = 'status' | 'url' | 'title' | 'updated_at';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function PagesListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = useDataProvider();
  const { filters, setFilters } = useFilters();
  const { mutate: createPage, isPending: isCreating } = provider.useCreatePage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Persist any generation created before sign-up as an owned page.
  useEffect(() => {
    if (!user) return;
    const raw = sessionStorage.getItem('pendingGeneration');
    if (!raw) return;
    sessionStorage.removeItem('pendingGeneration');
    let payload: Record<string, unknown> | null = null;
    try {
      payload = JSON.parse(raw);
    } catch {
      return;
    }
    if (!payload) return;
    (async () => {
      const { error } = await supabase
        .from('pages')
        .insert({ ...payload, user_id: user.id });
      if (!error) {
        queryClient.invalidateQueries({ queryKey: ['pages', user.id] });
      }
    })();
  }, [user, queryClient]);


  const isDemo = location.pathname.startsWith('/demo');
  const basePath = isDemo ? '/demo/pages' : '/pages';

  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(searchInput, 200);

  const [sortField, setSortField] = useState<SortField>(
    (filters.sortBy as SortField) ?? 'updated_at',
  );
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(filters.sortDir ?? 'desc');

  useEffect(() => {
    const updates: Record<string, unknown> = { search: debouncedSearch };
    if (sortField !== 'status') {
      updates.sortBy = sortField;
      updates.sortDir = sortDir;
    } else {
      updates.sortBy = 'updated_at';
      updates.sortDir = 'desc';
    }
    setFilters(updates);
  }, [debouncedSearch, sortField, sortDir, setFilters]);

  const hookFilters = {
    search: debouncedSearch,
    sortBy: sortField !== 'status' ? sortField : ('updated_at' as const),
    sortDir: sortField !== 'status' ? sortDir : ('desc' as const),
    page: filters.page ?? 0,
  };

  const { data: pages, total, isLoading } = provider.usePages(hookFilters);

  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDir('asc');
      return field;
    });
  }, []);

  const handleNewPage = async () => {
    const result = await createPage();
    if (result.id) {
      navigate(`${basePath}/${result.id}?mode=edit`);
    }
  };

  const currentPage = filters.page ?? 0;
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);
  const showingFrom = currentPage * pageSize + 1;
  const showingTo = Math.min((currentPage + 1) * pageSize, total);

  const hasActiveSearch = !!debouncedSearch;

  if (isLoading) {
    const bar = 'rounded bg-accent h-4';
    return (
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6 py-2">
          <div className="flex items-center justify-between">
            <div className={`${bar} w-24 h-8`} />
            <div className={`${bar} w-28 h-9`} />
          </div>
          <div className={`${bar} w-full h-10`} />
          <div className="space-y-3">
            <div className={`${bar} w-full h-12`} />
            <div className={`${bar} w-full h-12`} />
            <div className={`${bar} w-full h-12`} />
            <div className={`${bar} w-full h-12`} />
            <div className={`${bar} w-full h-12`} />
          </div>
        </div>
      </main>
    );
  }

  const isEmpty = total === 0 && !hasActiveSearch;
  const isFilteredEmpty = pages.length === 0 && hasActiveSearch;

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-5xl space-y-6 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Pages</h1>
          <Button onClick={handleNewPage} disabled={isCreating}>
            <IconPlus className="size-4 text-primary-foreground" strokeWidth={2.5} />
            New page
          </Button>
        </div>

        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search pages…"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setFilters({ page: 0 });
            }}
            className="pl-9"
          />
        </div>

        {isEmpty ? (
          <PagesBlankslate onAddPage={handleNewPage} />
        ) : isFilteredEmpty ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No results for "{debouncedSearch}".
            </p>
            <p className="text-sm text-muted-foreground">
              Try a different search term.
            </p>
          </div>
        ) : (
          <>
            <PagesTable
              pages={pages}
              sortField={sortField}
              sortDir={sortDir}
              onSort={handleSort}
            />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {showingFrom}–{showingTo} of {total} pages
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 0}
                    onClick={() => setFilters({ page: currentPage - 1 })}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setFilters({ page: currentPage + 1 })}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
