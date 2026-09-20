interface DiscordPreviewProps {
  title: string | null;
  description: string | null;
  url: string;
  ogImageUrl: string | null;
}

export function DiscordPreview({ title, description, url, ogImageUrl }: DiscordPreviewProps) {
  const domain = url.replace(/^https?:\/\//, '').split('/')[0];

  return (
    <div className="flex gap-0 overflow-hidden rounded border border-border bg-muted/30">
      <div className="w-1 shrink-0 bg-primary" />
      <div className="flex-1 space-y-2 p-3">
        <p className="text-xs text-muted-foreground">{domain}</p>
        <p className="text-sm font-semibold text-foreground">
          {title || 'Page title'}
        </p>
        <p className="line-clamp-3 text-sm leading-snug text-muted-foreground">
          {description || 'Page description will appear here.'}
        </p>
        {ogImageUrl && (
          <div className="mt-2 h-20 w-20 overflow-hidden rounded">
            <img src={ogImageUrl} alt="" className="size-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
