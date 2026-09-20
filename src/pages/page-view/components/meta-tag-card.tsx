import { useRef, useCallback } from 'react';
import { IconPencil, IconSparkles, IconUpload, IconLoader2, IconCopy, IconCode } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/base/button';
import { Badge, type BadgeColor } from '@/components/base/badge';
import { KeywordChipsInput } from '@/components/base/keyword-chips-input';
import type { Page } from '@/data/seed';
import type { UpdatePageInput } from '@/lib/data-provider';

function copyText(text: string, label: string) {
  if (!text) return;
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied`);
}

function CopyButton({ value, label }: { value: string; label: string }) {
  if (!value || value === '—') return null;
  return (
    <button
      type="button"
      onClick={() => copyText(value, label)}
      aria-label={`Copy ${label}`}
      className="inline-flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <IconCopy className="size-3.5" />
    </button>
  );
}

function buildMetaHtml(page: Page): string {
  const lines: string[] = [];
  if (page.title) lines.push(`<title>${page.title}</title>`);
  if (page.description) lines.push(`<meta name="description" content="${page.description}" />`);
  if (page.title) lines.push(`<meta property="og:title" content="${page.title}" />`);
  if (page.description) lines.push(`<meta property="og:description" content="${page.description}" />`);
  if (page.og_image_url) lines.push(`<meta property="og:image" content="${page.og_image_url}" />`);
  if (page.url) lines.push(`<meta property="og:url" content="${page.url}" />`);
  return lines.join('\n');
}

interface MetaTagCardProps {
  page: Page;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (input: Omit<UpdatePageInput, 'id'>) => void;
  onDiscard: () => void;
  onDelete: () => void;
  onGenerate: (url: string, keyword: string) => Promise<void>;
  isGenerating: boolean;
  onUploadImage: (file: File) => void;
  editValues: {
    url: string;
    keyword: string;
    title: string;
    description: string;
    slug: string;
    ogImageUrl: string | null;
  };
  onFieldChange: (field: string, value: string) => void;
}

function charCountColor(length: number, limit: number, warnStart: number): BadgeColor {
  if (length > limit) return 'red';
  if (length >= warnStart) return 'amber';
  return 'green';
}

export function MetaTagCard({
  page,
  isEditing,
  onEdit,
  onSave,
  onDiscard,
  onDelete,
  onGenerate,
  isGenerating,
  onUploadImage,
  editValues,
  onFieldChange,
}: MetaTagCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = useCallback(() => {
    onSave({
      url: editValues.url,
      keyword: editValues.keyword || undefined,
      title: editValues.title || undefined,
      description: editValues.description || undefined,
      slug: editValues.slug || undefined,
      og_image_url: editValues.ogImageUrl ?? undefined,
    });
  }, [editValues, onSave]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onUploadImage(file);
    },
    [onUploadImage],
  );

  const handleGenerate = useCallback(() => {
    onGenerate(editValues.url, editValues.keyword);
  }, [editValues.url, editValues.keyword, onGenerate]);

  const titleLen = editValues.title.length;
  const descLen = editValues.description.length;

  if (isEditing) {
    return (
      <Card className="[&]:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Meta tags
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="Paste your page URL…"
              value={editValues.url}
              onChange={(e) => onFieldChange('url', e.target.value)}
              disabled={isGenerating}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyword">Keywords (optional)</Label>
            <KeywordChipsInput
              id="keyword"
              value={editValues.keyword}
              onChange={(v) => onFieldChange('keyword', v)}
              disabled={isGenerating}
              placeholder="Type and press Enter…"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Title</Label>
              <Badge color={charCountColor(titleLen, 60, 51)}>
                {titleLen} / 60
              </Badge>
            </div>
            <Input
              id="title"
              value={editValues.title}
              onChange={(e) => onFieldChange('title', e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <Badge color={charCountColor(descLen, 160, 141)}>
                {descLen} / 160
              </Badge>
            </div>
            <Textarea
              id="description"
              rows={3}
              value={editValues.description}
              onChange={(e) => onFieldChange('description', e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={editValues.slug}
              onChange={(e) => onFieldChange('slug', e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <Label>OG Image</Label>
            {editValues.ogImageUrl ? (
              <div className="group relative overflow-hidden rounded-lg border border-dashed border-border">
                <img
                  src={editValues.ogImageUrl}
                  alt="OG preview"
                  className="h-32 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <span className="text-sm font-medium text-foreground">Replace</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-foreground/30"
              >
                <IconUpload className="size-4" />
                Click or drag to upload
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <Button
            variant="secondary"
            className="w-full"
            disabled={!editValues.url || isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <IconLoader2 className="size-4 animate-spin" />
            ) : (
              <IconSparkles className="size-4" />
            )}
            {isGenerating ? 'Generating…' : 'Generate with AI'}
          </Button>
        </CardContent>
        <CardFooter className="gap-2">
          <Button onClick={handleSave}>Save</Button>
          <Button variant="ghost" onClick={onDiscard}>
            Discard
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="[&]:shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Meta tags
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyText(buildMetaHtml(page), 'HTML meta tags')}
            disabled={!page.title && !page.description}
          >
            <IconCode className="size-4" />
            Copy HTML
          </Button>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <IconPencil className="size-4" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ViewField label="URL" value={page.url} muted />
        <Separator />
        <ViewField label="Keyword" value={page.keyword || '—'} muted />
        <Separator />
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Title</p>
            <div className="flex items-center gap-2">
              {page.title && (
                <Badge color={charCountColor(page.title.length, 60, 51)}>
                  {page.title.length} / 60
                </Badge>
              )}
              <CopyButton value={page.title || ''} label="Title" />
            </div>
          </div>
          <p className="text-sm text-foreground">{page.title || '—'}</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <div className="flex items-center gap-2">
              {page.description && (
                <Badge color={charCountColor(page.description.length, 160, 141)}>
                  {page.description.length} / 160
                </Badge>
              )}
              <CopyButton value={page.description || ''} label="Description" />
            </div>
          </div>
          <p className="text-sm text-foreground">{page.description || '—'}</p>
        </div>
        <Separator />
        <ViewField label="Slug" value={page.slug || '—'} mono />
        <Separator />
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">OG Image</p>
          {page.og_image_url ? (
            <div className="overflow-hidden rounded-lg">
              <img
                src={page.og_image_url}
                alt="OG preview"
                className="h-32 w-full object-cover"
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No image</p>
          )}
        </div>

        {(page.current_title || page.current_description) && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Current (on live page)
              </p>
              {page.current_title && (
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Title</p>
                  <p className="text-sm italic text-muted-foreground">{page.current_title}</p>
                </div>
              )}
              {page.current_description && (
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Desc</p>
                  <p className="text-sm italic text-muted-foreground">{page.current_description}</p>
                </div>
              )}
            </div>
          </>
        )}

        <Separator />
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete()}
        >
          Delete page
        </Button>
      </CardContent>
    </Card>
  );
}

function ViewField({
  label,
  value,
  muted,
  mono,
}: {
  label: string;
  value: string;
  muted?: boolean;
  mono?: boolean;
}) {
  const canCopy = value && value !== '—';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {canCopy && <CopyButton value={value} label={label} />}
      </div>
      <p
        className={`text-sm ${muted ? 'text-muted-foreground' : 'text-foreground'} ${mono ? 'font-mono' : ''} break-all`}
      >
        {value}
      </p>
    </div>
  );
}
