interface SlackPreviewProps {
  title: string | null;
  description: string | null;
  url: string;
  ogImageUrl: string | null;
}

export function SlackPreview({ title, description, url, ogImageUrl }: SlackPreviewProps) {
  const domain = url.replace(/^https?:\/\//, '').split('/')[0];

  return (
    <div className="border-l-[3px] border-muted-foreground/30 pl-3">
      <div className="flex gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs text-muted-foreground">{domain}</p>
          <p className="text-sm font-semibold text-foreground">
            {title || 'Page title'}
          </p>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {description || 'Page description will appear here.'}
          </p>
        </div>
        {ogImageUrl && (
          <div className="size-16 shrink-0 overflow-hidden rounded">
            <img src={ogImageUrl} alt="" className="size-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
