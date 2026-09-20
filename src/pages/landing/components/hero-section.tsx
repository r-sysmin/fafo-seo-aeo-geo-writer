import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconGlobe,
  IconTag,
  IconSparkles,
  IconCopy,
  IconLoader2,
} from "@tabler/icons-react";
import { Button } from "@/components/base/button";
import { Badge } from "@/components/base/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useDataProvider, type GenerateMetaResult } from "@/lib/data-provider";
import { KeywordChipsInput } from "@/components/base/keyword-chips-input";
import { PlatformPreviewTabs } from "./platform-previews";

type HeroState = "idle" | "generating" | "results";

function getCharCountColor(
  length: number,
  max: number,
): "green" | "amber" | "red" {
  if (max === 60) {
    if (length > 60) return "red";
    if (length > 50) return "amber";
    return "green";
  }
  if (length > 160) return "red";
  if (length > 140) return "amber";
  return "green";
}

export function HeroSection() {
  const navigate = useNavigate();
  const { useGenerateMeta } = useDataProvider();
  const { mutate: generateMeta } = useGenerateMeta();
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [state, setState] = useState<HeroState>("idle");
  const [result, setResult] = useState<GenerateMetaResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleGenerate = async () => {
    if (!url.trim()) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setState("generating");

    const timeoutId = window.setTimeout(() => {
      controller.abort();
      toast.error("Taking too long — try again.");
    }, 30000);

    try {
      const generated = await generateMeta({ url, keyword: keyword || undefined });
      if (controller.signal.aborted) return;
      setResult(generated);
      setState("results");
    } catch {
      setState("idle");
    } finally {
      window.clearTimeout(timeoutId);
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState("idle");
  };

  const handleGenerateAnother = () => {
    setResult(null);
    handleGenerate();
  };

  const handleReset = () => {
    setUrl("");
    setKeyword("");
    setResult(null);
    setState("idle");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard.");
  };

  const handleSave = () => {
    if (result) {
      sessionStorage.setItem(
        'pendingGeneration',
        JSON.stringify({
          url,
          keyword: keyword || null,
          title: result.title,
          description: result.description,
          slug: result.slug,
          current_title: result.current_title,
          current_description: result.current_description,
        }),
      );
    }
    navigate(`/auth?intent=signup`);
  };


  return (
    <section className="landing py-24">
      <div className="mx-auto max-w-page px-6 lg:px-8">
        {/* Headline */}
        <div className="mx-auto max-w-2xl text-center">
          <h1>SEO Writer</h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground">
            Meta tags that get clicks
          </p>
        </div>

        {/* Input card */}
        <div className="relative mx-auto mt-12 max-w-2xl">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-16 -inset-y-10 -z-10 rounded-[3rem] bg-primary/30 blur-3xl"
          />
          <Card className="relative shadow-[0_0_80px_0_hsl(var(--primary)/0.1)]">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <IconGlobe className="size-4 text-muted-foreground shrink-0" />
                <Input
                  type="url"
                  placeholder="https://yoursite.com/blog/post-title"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={state === "generating"}
                  className="border-0 shadow-none focus-visible:ring-0 pl-2 pr-0 h-auto"
                />
              </div>
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <IconTag className="size-4 text-muted-foreground shrink-0" />
                <KeywordChipsInput
                  bare
                  value={keyword}
                  onChange={setKeyword}
                  disabled={state === "generating"}
                  placeholder="Target keywords (press Enter or comma)"
                  className="pl-2"
                />
              </div>
              <div className="p-4">
                {state === "results" ? (
                  <Button className="w-full" onClick={handleGenerateAnother}>
                    <IconSparkles className="size-4" />
                    Generate another
                  </Button>
                ) : state === "generating" ? (
                  <div className="flex gap-2">
                    <Button className="flex-1" disabled>
                      <IconLoader2 className="size-4 animate-spin" />
                      Generating…
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleGenerate}
                    disabled={!url.trim()}
                  >
                    <IconSparkles className="size-4" />
                    Generate
                  </Button>
                )}
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Preview area */}
        <div className="mx-auto mt-8 max-w-2xl">
          {state === "idle" && <PlaceholderPreviews />}

          {state === "generating" && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-40 w-full rounded" />
              </CardContent>
            </Card>
          )}

          {state === "results" && result && (
            <ResultsCard
              result={result}
              url={url}
              onCopy={handleCopy}
              onSave={handleSave}
              onDismiss={handleReset}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function PlaceholderPreviews() {
  return (
    <div className="rounded-lg border border-dashed border-border p-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Google SERP skeleton */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-2 w-16" />
          </div>
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-3/4" />
        </div>
        {/* X card skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-24 w-full rounded" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-20" />
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Paste a URL to generate previews
      </p>
    </div>
  );
}

interface ResultsCardProps {
  result: GenerateMetaResult;
  url: string;
  onCopy: (text: string) => void;
  onSave: () => void;
  onDismiss: () => void;
}

function ResultsCard({ result, url, onCopy, onSave, onDismiss }: ResultsCardProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Title row */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Title
            </span>
            <div className="flex items-center gap-2">
              <Badge color={getCharCountColor(result.title.length, 60)}>
                {result.title.length} / 60
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => onCopy(result.title)}
              >
                <IconCopy className="size-4" />
              </Button>
            </div>
          </div>
          <p className="text-foreground">{result.title}</p>
        </div>

        {/* Description row */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Description
            </span>
            <div className="flex items-center gap-2">
              <Badge color={getCharCountColor(result.description.length, 160)}>
                {result.description.length} / 160
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => onCopy(result.description)}
              >
                <IconCopy className="size-4" />
              </Button>
            </div>
          </div>
          <p className="text-foreground">{result.description}</p>
        </div>

        {/* Platform preview tabs */}
        <PlatformPreviewTabs
          title={result.title}
          description={result.description}
          url={url}
          slug={result.slug}
          ogImageUrl={null}
        />

        {/* Save / dismiss */}
        <div className="flex items-center justify-between pt-2">
          <Button onClick={onSave}>Save to library</Button>
          <button
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={onDismiss}
          >
            Not now — copy and close
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
