import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useDataProvider } from '@/lib/data-provider';
import { MetaTagCard } from './components/meta-tag-card';
import { PreviewPanel } from './components/preview-panel';
import { DeletePageDialog } from './components/delete-page-dialog';

export default function PageViewPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isDemo = location.pathname.startsWith('/demo');
  const basePath = isDemo ? '/demo/pages' : '/pages';

  const provider = useDataProvider();
  const { data: page, isLoading } = provider.usePage(id ?? '');
  const { mutate: updatePage } = provider.useUpdatePage();
  const { mutate: deletePage } = provider.useDeletePage();
  const generateMeta = provider.useGenerateMeta();
  const uploadImage = provider.useUploadOgImage();

  const isEditing = searchParams.get('mode') === 'edit';
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [editValues, setEditValues] = useState({
    url: '',
    keyword: '',
    title: '',
    description: '',
    slug: '',
    ogImageUrl: null as string | null,
  });

  const initializedForEditId = useRef<string | null>(null);
  useEffect(() => {
    if (!isEditing) {
      initializedForEditId.current = null;
      return;
    }
    if (page && initializedForEditId.current !== page.id) {
      initializedForEditId.current = page.id;
      setEditValues({
        url: page.url ?? '',
        keyword: page.keyword ?? '',
        title: page.title ?? '',
        description: page.description ?? '',
        slug: page.slug ?? '',
        ogImageUrl: page.og_image_url,
      });
    }
  }, [page, isEditing]);

  const handleFieldChange = useCallback((field: string, value: string) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleEdit = useCallback(() => {
    if (page) {
      setEditValues({
        url: page.url ?? '',
        keyword: page.keyword ?? '',
        title: page.title ?? '',
        description: page.description ?? '',
        slug: page.slug ?? '',
        ogImageUrl: page.og_image_url,
      });
    }
    setSearchParams({ mode: 'edit' });
  }, [page, setSearchParams]);

  const handleSave = useCallback(
    (fields: Record<string, unknown>) => {
      if (!id) return;
      updatePage({ id, ...fields } as Parameters<typeof updatePage>[0]);
      setSearchParams({});
      toast.success('Saved.');
    },
    [id, updatePage, setSearchParams],
  );

  const handleDiscard = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const handleDelete = useCallback(() => {
    if (!id) return;
    deletePage(id);
    navigate(basePath);
  }, [id, deletePage, navigate, basePath]);

  const handleGenerate = useCallback(
    async (url: string, keyword: string) => {
      if (!id) return;
      setIsGenerating(true);
      try {
        const result = await generateMeta.mutate({ url, keyword, pageId: id });
        setEditValues((prev) => ({
          ...prev,
          title: result.title,
          description: result.description,
          slug: result.slug,
        }));
        updatePage({
          id,
          current_title: result.current_title,
          current_description: result.current_description,
        });
      } finally {
        setIsGenerating(false);
      }
    },
    [id, generateMeta, updatePage],
  );

  const handleUploadImage = useCallback(
    (file: File) => {
      if (!id) return;
      const localUrl = URL.createObjectURL(file);
      setEditValues((prev) => ({ ...prev, ogImageUrl: localUrl }));
      uploadImage.mutate({ pageId: id, file, filename: file.name });
    },
    [id, uploadImage],
  );

  if (isLoading) {
    const bar = 'rounded bg-accent';
    return (
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6 py-2">
          <div className={`${bar} h-4 w-48`} />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className={`${bar} h-96`} />
            <div className={`${bar} h-96`} />
          </div>
        </div>
      </main>
    );
  }

  if (!page) {
    return (
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl py-12 text-center">
          <p className="text-sm text-muted-foreground">Page not found.</p>
          <Link to={basePath} className="mt-2 inline-block text-sm text-primary">
            ← Back to pages
          </Link>
        </div>
      </main>
    );
  }

  const displayTitle = isEditing ? editValues.title : page.title;
  const displayDescription = isEditing ? editValues.description : page.description;
  const displayUrl = isEditing ? editValues.url : page.url;
  const displayOgImage = isEditing ? editValues.ogImageUrl : page.og_image_url;

  const isNewPage = !page.title && !page.description && !page.slug;
  const breadcrumbLabel = isNewPage && isEditing
    ? 'New page'
    : page.url.length > 50
      ? `${page.url.slice(0, 50)}…`
      : page.url;

  const previewEmpty = !displayTitle && !displayDescription;

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-5xl space-y-6 py-2">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            to={basePath}
            className="flex items-center gap-1 text-primary transition-colors hover:text-primary/80"
          >
            <IconArrowLeft className="size-4" />
            Pages
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{breadcrumbLabel}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-2">
          <MetaTagCard
            page={page}
            isEditing={isEditing}
            onEdit={handleEdit}
            onSave={handleSave}
            onDiscard={handleDiscard}
            onDelete={() => setDeleteOpen(true)}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            onUploadImage={handleUploadImage}
            editValues={editValues}
            onFieldChange={handleFieldChange}
          />
          <PreviewPanel
            title={displayTitle}
            description={displayDescription}
            url={displayUrl || page.url}
            ogImageUrl={displayOgImage}
            isEmpty={previewEmpty}
          />
        </div>
      </div>

      <DeletePageDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        url={page.url}
        onConfirm={handleDelete}
      />
    </main>
  );
}
