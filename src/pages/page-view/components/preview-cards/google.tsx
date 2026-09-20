interface GooglePreviewProps {
  title: string | null;
  description: string | null;
  url: string;
}

export function GooglePreview({ title, description, url }: GooglePreviewProps) {
  const parts = url.replace(/^https?:\/\//, '').split('/');
  const domain = parts[0];
  const path = parts.slice(1).filter(Boolean);

  return (
    <div className="max-w-[600px] space-y-1">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{domain}</span>
        {path.map((segment, i) => (
          <span key={i} className="flex items-center gap-2">
            <span>›</span>
            <span>{segment}</span>
          </span>
        ))}
      </div>
      <h3 className="text-xl font-normal leading-snug text-[oklch(0.546_0.245_262.881)]">
        {title || 'Page title'}
      </h3>
      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {description || 'Page description will appear here.'}
      </p>
    </div>
  );
}
