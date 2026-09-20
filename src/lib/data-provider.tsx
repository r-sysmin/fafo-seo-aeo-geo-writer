import { createContext, useContext, type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/auth-provider';
import * as seed from '@/data/seed';
import type {
  Profile,
  Page,
  GenerateMetaResult,
  FeatureTab,
  ValueProp,
  Testimonial,
  FooterLinks,
} from '@/data/seed';
export type { GenerateMetaResult };

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface PagesFilters {
  search?: string;
  sortBy?: 'updated_at' | 'url' | 'title';
  sortDir?: 'asc' | 'desc';
  page?: number;
}

export interface UpdatePageInput {
  id: string;
  url?: string;
  keyword?: string;
  title?: string;
  description?: string;
  slug?: string;
  og_image_url?: string;
  current_title?: string;
  current_description?: string;
}

export interface UpdateAnonymousPageInput {
  id: string;
  title?: string;
  description?: string;
  slug?: string;
  current_title?: string;
  current_description?: string;
}

export interface GenerateMetaInput {
  url: string;
  keyword?: string;
  pageId?: string;
}

export interface UploadOgImageInput {
  pageId: string;
  file: File;
  filename: string;
}

export interface AppDataProvider {
  useProfile(): { data: Profile | null; isLoading: boolean };
  usePages(filters: PagesFilters): { data: Page[]; total: number; isLoading: boolean };
  usePage(id: string): { data: Page | null; isLoading: boolean };
  useCreatePage(): { mutate: () => Promise<{ id: string }>; isPending: boolean };
  useUpdatePage(): { mutate: (input: UpdatePageInput) => void; isPending: boolean };
  useDeletePage(): { mutate: (id: string) => void; isPending: boolean };
  useCreateAnonymousPage(): { mutate: (input: { url: string; keyword?: string }) => Promise<{ id: string }>; isPending: boolean };
  useUpdateAnonymousPage(): { mutate: (input: UpdateAnonymousPageInput) => Promise<void>; isPending: boolean };
  useGenerateMeta(): { mutate: (input: GenerateMetaInput) => Promise<GenerateMetaResult>; isPending: boolean };
  useUploadOgImage(): { mutate: (input: UploadOgImageInput) => void; isPending: boolean };
  useFeatureTabs(): { data: FeatureTab[] };
  useValueProps(): { data: ValueProp[] };
  useTestimonials(): { data: Testimonial[] };
  useFooterLinks(): { data: FooterLinks };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const DataProviderContext = createContext<AppDataProvider | null>(null);

export function useDataProvider(): AppDataProvider {
  const ctx = useContext(DataProviderContext);
  if (!ctx) throw new Error('useDataProvider must be inside a DataProvider');
  return ctx;
}

// ---------------------------------------------------------------------------
// SeedDataProvider
// ---------------------------------------------------------------------------

const PAGE_SIZE = 10;

export function SeedDataProvider({ children }: { children: ReactNode }) {
  const provider: AppDataProvider = {
    useProfile: () => ({
      data: seed.profile,
      isLoading: false,
    }),

    usePages: (filters) => {
      let rows = [...seed.pages];

      if (filters.search) {
        const q = filters.search.toLowerCase();
        rows = rows.filter(
          (p) =>
            p.url.toLowerCase().includes(q) ||
            (p.title ?? '').toLowerCase().includes(q),
        );
      }

      const sortBy = filters.sortBy ?? 'updated_at';
      const asc = filters.sortDir === 'asc';
      rows.sort((a, b) => {
        const av = ((a as unknown) as Record<string, unknown>)[sortBy] as string ?? '';
        const bv = ((b as unknown) as Record<string, unknown>)[sortBy] as string ?? '';
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      });

      const page = filters.page ?? 0;
      const total = rows.length;
      const slice = rows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

      return { data: slice, total, isLoading: false };
    },

    usePage: (id) => ({
      data: seed.pages.find((p) => p.id === id) ?? null,
      isLoading: false,
    }),

    useCreatePage: () => ({
      mutate: async () => {
        toast('Sign in to save your changes');
        return { id: '' };
      },
      isPending: false,
    }),

    useUpdatePage: () => ({
      mutate: () => {
        toast('Sign in to save your changes');
      },
      isPending: false,
    }),

    useDeletePage: () => ({
      mutate: () => {
        toast('Sign in to save your changes');
      },
      isPending: false,
    }),

    useCreateAnonymousPage: () => ({
      mutate: async () => {
        return { id: `anon-${Date.now()}` };
      },
      isPending: false,
    }),

    useUpdateAnonymousPage: () => ({
      mutate: async () => {},
      isPending: false,
    }),

    useGenerateMeta: () => ({
      mutate: async () => {
        await new Promise((r) => setTimeout(r, 1500));
        return seed.demoGeneration;
      },
      isPending: false,
    }),

    useUploadOgImage: () => ({
      mutate: () => {
        toast('Sign in to save your changes');
      },
      isPending: false,
    }),

    useFeatureTabs: () => ({ data: seed.featureTabs }),
    useValueProps: () => ({ data: seed.valueProps }),
    useTestimonials: () => ({ data: seed.testimonials }),
    useFooterLinks: () => ({ data: seed.footerLinks }),
  };

  return (
    <DataProviderContext.Provider value={provider}>
      {children}
    </DataProviderContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// SupabaseDataProvider
// ---------------------------------------------------------------------------

export function SupabaseDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const provider: AppDataProvider = {
    // ── useProfile ────────────────────────────────────────────────────────
    useProfile: () => {
      const { data, isLoading } = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .eq('id', user!.id)
            .single();
          if (error) throw error;
          return data as Profile;
        },
        enabled: !!user,
      });
      return { data: data ?? null, isLoading };
    },

    // ── usePages ──────────────────────────────────────────────────────────
    usePages: (filters) => {
      const { data, isLoading } = useQuery({
        queryKey: ['pages', user?.id, filters],
        queryFn: async () => {
          let query = supabase
            .from('pages')
            .select('id, url, title, description, slug, og_image_url, updated_at', { count: 'exact' })
            .eq('user_id', user!.id);

          if (filters.search) {
            query = query.or(
              `url.ilike.%${filters.search}%,title.ilike.%${filters.search}%`,
            );
          }

          const sortCol = filters.sortBy ?? 'updated_at';
          const asc = filters.sortDir === 'asc';
          query = query.order(sortCol, { ascending: asc });

          const page = filters.page ?? 0;
          const limit = PAGE_SIZE;
          query = query.range(page * limit, page * limit + limit - 1);

          const { data, count, error } = await query;
          if (error) throw error;
          return { rows: (data ?? []) as Page[], total: count ?? 0 };
        },
        enabled: !!user,
      });
      return {
        data: data?.rows ?? [],
        total: data?.total ?? 0,
        isLoading,
      };
    },

    // ── usePage ───────────────────────────────────────────────────────────
    usePage: (id) => {
      const { data, isLoading } = useQuery({
        queryKey: ['page', id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('pages')
            .select('id, user_id, url, keyword, title, description, slug, og_image_url, current_title, current_description, created_at, updated_at')
            .eq('id', id)
            .single();
          if (error) throw error;
          return data as Page;
        },
        enabled: !!id,
      });
      return { data: data ?? null, isLoading };
    },

    // ── useCreatePage ─────────────────────────────────────────────────────
    useCreatePage: () => {
      const mutation = useMutation({
        mutationFn: async () => {
          const { data, error } = await supabase
            .from('pages')
            .insert({
              user_id: user!.id,
              url: '',
              keyword: null,
              title: null,
              description: null,
              slug: null,
              og_image_url: null,
              current_title: null,
              current_description: null,
            })
            .select('id')
            .single();
          if (error) throw error;
          return data as { id: string };
        },
        onMutate: async () => {
          await queryClient.cancelQueries({ queryKey: ['pages', user?.id] });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['pages', user?.id] });
        },
        onError: () => {
          toast.error('Failed to create page. Please try again.');
        },
      });
      return {
        mutate: () => mutation.mutateAsync(),
        isPending: mutation.isPending,
      };
    },

    // ── useUpdatePage ─────────────────────────────────────────────────────
    useUpdatePage: () => {
      const mutation = useMutation({
        mutationFn: async (input: UpdatePageInput) => {
          const { id, ...fields } = input;
          const { data, error } = await supabase
            .from('pages')
            .update({
              ...fields,
              updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .eq('user_id', user!.id)
            .select()
            .single();
          if (error) throw error;
          return data as Page;
        },
        onMutate: async (input) => {
          await queryClient.cancelQueries({ queryKey: ['page', input.id] });
          const previous = queryClient.getQueryData<Page>(['page', input.id]);
          if (previous) {
            queryClient.setQueryData(['page', input.id], {
              ...previous,
              ...input,
            });
          }
          return { previous };
        },
        onError: (_err, input, context) => {
          if (context?.previous) {
            queryClient.setQueryData(['page', input.id], context.previous);
          }
          toast.error('Failed to save. Please try again.');
        },
        onSettled: (_data, _err, input) => {
          queryClient.invalidateQueries({ queryKey: ['page', input.id] });
          queryClient.invalidateQueries({ queryKey: ['pages', user?.id] });
        },
      });
      return {
        mutate: (input: UpdatePageInput) => mutation.mutate(input),
        isPending: mutation.isPending,
      };
    },

    // ── useDeletePage ─────────────────────────────────────────────────────
    useDeletePage: () => {
      const mutation = useMutation({
        mutationFn: async (id: string) => {
          const { error } = await supabase
            .from('pages')
            .delete()
            .eq('id', id)
            .eq('user_id', user!.id);
          if (error) throw error;
        },
        onMutate: async (id) => {
          await queryClient.cancelQueries({ queryKey: ['pages', user?.id] });
          const previous = queryClient.getQueryData<{ rows: Page[]; total: number }>(['pages', user?.id]);
          if (previous) {
            queryClient.setQueryData(['pages', user?.id], {
              ...previous,
              rows: previous.rows.filter((p) => p.id !== id),
              total: previous.total - 1,
            });
          }
          return { previous };
        },
        onError: (_err, _id, context) => {
          if (context?.previous) {
            queryClient.setQueryData(['pages', user?.id], context.previous);
          }
          toast.error('Delete failed, please try again.');
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['pages', user?.id] });
        },
        onSuccess: () => {
          toast.success('Page deleted.');
        },
      });
      return {
        mutate: (id: string) => mutation.mutate(id),
        isPending: mutation.isPending,
      };
    },

    // ── useCreateAnonymousPage ──────────────────────────────────────────
    useCreateAnonymousPage: () => {
      const mutation = useMutation({
        mutationFn: async (input: { url: string; keyword?: string }) => {
          const { data, error } = await supabase
            .from('pages')
            .insert({
              user_id: user?.id ?? null,
              url: input.url,
              keyword: input.keyword ?? null,
              title: null,
              description: null,
              slug: null,
              og_image_url: null,
              current_title: null,
              current_description: null,
            })
            .select('id')
            .single();
          if (error) throw error;
          return data as { id: string };
        },
        onError: () => {
          toast.error("Couldn't save your page — try again.");
        },
      });
      return {
        mutate: (input: { url: string; keyword?: string }) => mutation.mutateAsync(input),
        isPending: mutation.isPending,
      };
    },

    // ── useUpdateAnonymousPage ───────────────────────────────────────────
    useUpdateAnonymousPage: () => {
      const mutation = useMutation({
        mutationFn: async (input: UpdateAnonymousPageInput) => {
          const { id, ...fields } = input;
          const { error } = await supabase
            .from('pages')
            .update({
              ...fields,
              updated_at: new Date().toISOString(),
            })
            .eq('id', id);
          if (error) throw error;
        },
        onError: () => {
          toast.error("Couldn't save your changes — try again.");
        },
      });
      return {
        mutate: (input: UpdateAnonymousPageInput) => mutation.mutateAsync(input),
        isPending: mutation.isPending,
      };
    },

    // ── useGenerateMeta ───────────────────────────────────────────────────
    useGenerateMeta: () => {
      const mutation = useMutation({
        mutationFn: async (input: GenerateMetaInput) => {
          const { data, error } = await supabase.functions.invoke('generate-meta', {
            body: { url: input.url, keyword: input.keyword ?? '', pageId: input.pageId },
          });
          if (error) throw error;
          return data as GenerateMetaResult;
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : '';
          if (msg === 'aborted' || msg === 'timeout') return;
          toast.error('Generation failed — check your URL and try again.');
        },
      });
      return {
        mutate: (input: GenerateMetaInput) => mutation.mutateAsync(input),
        isPending: mutation.isPending,
      };
    },

    // ── useUploadOgImage ──────────────────────────────────────────────────
    useFeatureTabs: () => ({ data: seed.featureTabs }),
    useValueProps: () => ({ data: seed.valueProps }),
    useTestimonials: () => ({ data: seed.testimonials }),
    useFooterLinks: () => ({ data: seed.footerLinks }),

    useUploadOgImage: () => {
      const mutation = useMutation({
        mutationFn: async (input: UploadOgImageInput) => {
          const filePath = `${user!.id}/${input.pageId}/${input.filename}`;
          const { error: storageError } = await supabase.storage
            .from('og-images')
            .upload(filePath, input.file, { upsert: true, contentType: input.file.type });
          if (storageError) throw storageError;

          const { data: urlData } = supabase.storage
            .from('og-images')
            .getPublicUrl(filePath);

          const { error: updateError } = await supabase
            .from('pages')
            .update({ og_image_url: urlData.publicUrl, updated_at: new Date().toISOString() })
            .eq('id', input.pageId)
            .eq('user_id', user!.id);
          if (updateError) throw updateError;

          return urlData.publicUrl;
        },
        onMutate: async (input) => {
          const localUrl = URL.createObjectURL(input.file);
          const previous = queryClient.getQueryData<Page>(['page', input.pageId]);
          if (previous) {
            queryClient.setQueryData(['page', input.pageId], {
              ...previous,
              og_image_url: localUrl,
            });
          }
          return { previous, localUrl };
        },
        onError: (_err, input, context) => {
          if (context?.previous) {
            queryClient.setQueryData(['page', input.pageId], context.previous);
          }
          if (context?.localUrl) {
            URL.revokeObjectURL(context.localUrl);
          }
          toast.error('Image upload failed. Please try again.');
        },
        onSettled: (_data, _err, input) => {
          queryClient.invalidateQueries({ queryKey: ['page', input.pageId] });
        },
      });
      return {
        mutate: (input: UploadOgImageInput) => mutation.mutate(input),
        isPending: mutation.isPending,
      };
    },
  };

  return (
    <DataProviderContext.Provider value={provider}>
      {children}
    </DataProviderContext.Provider>
  );
}
