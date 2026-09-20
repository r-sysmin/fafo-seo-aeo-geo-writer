interface FacebookPreviewProps {
  title: string | null;
  description: string | null;
  url: string;
  ogImageUrl: string | null;
}

export function FacebookPreview({ title, description, url, ogImageUrl }: FacebookPreviewProps) {
  const domain = url.replace(/^https?:\/\//, '').split('/')[0];

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {ogImageUrl ? (
        <div className="aspect-[1.91/1] w-full bg-muted">
          <img src={ogImageUrl} alt="" className="size-full object-cover" />
        </div>
      ) : (
        <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-muted">
          <span className="text-sm text-muted-foreground">No image</span>
        </div>
      )}
      <div className="space-y-1 border-t border-border bg-muted/30 p-3">
        <p className="text-xs uppercase text-muted-foreground">{domain}</p>
        <p className="text-sm font-semibold leading-snug text-foreground">
          {title || 'Page title'}
        </p>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {description || 'Page description will appear here.'}
        </p>
      </div>
    </div>
  );
}
