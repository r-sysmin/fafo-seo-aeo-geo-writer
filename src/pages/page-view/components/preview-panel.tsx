import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GooglePreview } from './preview-cards/google';
import { XPreview } from './preview-cards/x';
import { SlackPreview } from './preview-cards/slack';
import { FacebookPreview } from './preview-cards/facebook';
import { LinkedinPreview } from './preview-cards/linkedin';
import { DiscordPreview } from './preview-cards/discord';

interface PreviewPanelProps {
  title: string | null;
  description: string | null;
  url: string;
  ogImageUrl: string | null;
  isEmpty: boolean;
}

const platforms = [
  { id: 'google', label: 'Google' },
  { id: 'x', label: 'X' },
  { id: 'slack', label: 'Slack' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'discord', label: 'Discord' },
] as const;

export function PreviewPanel({ title, description, url, ogImageUrl, isEmpty }: PreviewPanelProps) {
  return (
    <Card className="[&]:shadow-none">
      <CardHeader className="pb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Preview
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="google">
          <TabsList className="mb-4 flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
            {platforms.map((p) => (
              <TabsTrigger
                key={p.id}
                value={p.id}
                className="rounded-full border border-border px-3 py-1 text-xs data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {isEmpty ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Fill in the fields to see how this page will appear.
              </p>
            </div>
          ) : (
            <>
              <TabsContent value="google">
                <GooglePreview title={title} description={description} url={url} />
              </TabsContent>
              <TabsContent value="x">
                <XPreview title={title} description={description} url={url} ogImageUrl={ogImageUrl} />
              </TabsContent>
              <TabsContent value="slack">
                <SlackPreview title={title} description={description} url={url} ogImageUrl={ogImageUrl} />
              </TabsContent>
              <TabsContent value="facebook">
                <FacebookPreview title={title} description={description} url={url} ogImageUrl={ogImageUrl} />
              </TabsContent>
              <TabsContent value="linkedin">
                <LinkedinPreview title={title} description={description} url={url} ogImageUrl={ogImageUrl} />
              </TabsContent>
              <TabsContent value="discord">
                <DiscordPreview title={title} description={description} url={url} ogImageUrl={ogImageUrl} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
