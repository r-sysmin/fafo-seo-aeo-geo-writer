import {
  IconSearch,
  IconBrandX,
  IconBrandSlack,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandDiscord,
} from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PreviewProps {
  title: string;
  description: string;
  url: string;
  slug: string;
  ogImageUrl: string | null;
}

function parseDomain(url: string): string {
  return url.replace(/^https?:\/\//, "").split("/")[0];
}

function parsePath(url: string): string {
  const withoutProtocol = url.replace(/^https?:\/\//, "");
  const parts = withoutProtocol.split("/").slice(1);
  return parts.length > 0 ? " › " + parts.join(" › ") : "";
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "…";
}

function GooglePreview({ title, description, url }: PreviewProps) {
  const domain = parseDomain(url);
  const path = parsePath(url);
  return (
    <div className="space-y-1 p-4">
      <p className="text-xs text-muted-foreground">
        {domain}
        {path}
      </p>
      <p className="text-base font-medium" style={{ color: "#1a0dab" }}>
        {truncate(title, 60)}
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {truncate(description, 160)}
      </p>
    </div>
  );
}

function XPreview({ title, description, url, ogImageUrl }: PreviewProps) {
  const domain = parseDomain(url);
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="h-32 bg-muted flex items-center justify-center">
        {ogImageUrl ? (
          <img src={ogImageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-muted-foreground">No image</span>
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="text-sm font-semibold text-foreground">{truncate(title, 70)}</p>
        <p className="text-xs text-muted-foreground">{truncate(description, 120)}</p>
        <p className="text-xs text-muted-foreground">{domain}</p>
      </div>
    </div>
  );
}

function SlackPreview({ title, description, url }: PreviewProps) {
  const domain = parseDomain(url);
  return (
    <div className="border-l-[3px] border-primary pl-4 py-2 space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{domain}</p>
      <p className="text-sm font-semibold text-primary">{title}</p>
      <p className="text-sm text-muted-foreground">{truncate(description, 160)}</p>
    </div>
  );
}

function FacebookPreview({ title, description, url, ogImageUrl }: PreviewProps) {
  const domain = parseDomain(url);
  return (
    <div className="overflow-hidden border border-border">
      <div className="h-40 bg-muted flex items-center justify-center">
        {ogImageUrl ? (
          <img src={ogImageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-muted-foreground">No image</span>
        )}
      </div>
      <div className="bg-muted/30 p-3 space-y-1">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {domain}
        </p>
        <p className="text-sm font-semibold text-foreground">{truncate(title, 80)}</p>
        <p className="text-xs text-muted-foreground">{truncate(description, 120)}</p>
      </div>
    </div>
  );
}

function LinkedInPreview({ title, description, url, ogImageUrl }: PreviewProps) {
  const domain = parseDomain(url);
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="h-36 bg-muted flex items-center justify-center">
        {ogImageUrl ? (
          <img src={ogImageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-muted-foreground">No image</span>
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="text-sm font-semibold text-foreground">{truncate(title, 80)}</p>
        <p className="text-xs text-muted-foreground">{truncate(description, 100)}</p>
        <p className="text-xs text-muted-foreground">{domain}</p>
      </div>
    </div>
  );
}

function DiscordPreview({ title, description, ogImageUrl }: PreviewProps) {
  return (
    <div className="rounded border-l-4 border-[#5865F2] bg-[#2f3136] p-3 space-y-2 max-w-sm">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-gray-300 leading-relaxed">{truncate(description, 160)}</p>
      {ogImageUrl && (
        <img src={ogImageUrl} alt="" className="mt-2 h-16 w-16 rounded object-cover" />
      )}
    </div>
  );
}

export function PlatformPreviewTabs(props: PreviewProps) {
  return (
    <Tabs defaultValue="google">
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
        <TabsTrigger value="google" className="gap-1.5 text-xs">
          <IconSearch className="size-3.5" />
          Google
        </TabsTrigger>
        <TabsTrigger value="x" className="gap-1.5 text-xs">
          <IconBrandX className="size-3.5" />
          X
        </TabsTrigger>
        <TabsTrigger value="slack" className="gap-1.5 text-xs">
          <IconBrandSlack className="size-3.5" />
          Slack
        </TabsTrigger>
        <TabsTrigger value="facebook" className="gap-1.5 text-xs">
          <IconBrandFacebook className="size-3.5" />
          Facebook
        </TabsTrigger>
        <TabsTrigger value="linkedin" className="gap-1.5 text-xs">
          <IconBrandLinkedin className="size-3.5" />
          LinkedIn
        </TabsTrigger>
        <TabsTrigger value="discord" className="gap-1.5 text-xs">
          <IconBrandDiscord className="size-3.5" />
          Discord
        </TabsTrigger>
      </TabsList>

      <div className="mt-4 rounded-lg border border-border bg-card">
        <TabsContent value="google" className="mt-0">
          <GooglePreview {...props} />
        </TabsContent>
        <TabsContent value="x" className="mt-0 p-4">
          <XPreview {...props} />
        </TabsContent>
        <TabsContent value="slack" className="mt-0 p-4">
          <SlackPreview {...props} />
        </TabsContent>
        <TabsContent value="facebook" className="mt-0 p-4">
          <FacebookPreview {...props} />
        </TabsContent>
        <TabsContent value="linkedin" className="mt-0 p-4">
          <LinkedInPreview {...props} />
        </TabsContent>
        <TabsContent value="discord" className="mt-0 p-4">
          <DiscordPreview {...props} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
