/**
 * Landing feature-showcase mockups.
 * These render inside the browser-chrome frame in feature-showcase-01.
 * They mirror the CURRENT app screens (topbar shell, no sidebar) using real
 * component styles and seed data so they read as screenshots of the live app.
 */
import {
  IconPlus,
  IconSearch,
  IconArrowsSort,
  IconDots,
  IconChevronLeft,
  IconPencil,
  IconSparkles,
  IconCopy,
  IconLoader2,
  IconUpload,
} from "@tabler/icons-react";
import { Badge } from "@/components/base/badge";
import { pages as seedPages, deriveStatus } from "@/data/seed";

/* ── App shell (topbar, no sidebar) ─────────────────────────── */

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      {/* Topbar */}
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-border px-4">
        <span className="font-heading text-[15px] font-semibold leading-none tracking-tight text-foreground">
          Meta description generator
        </span>
        <div className="ml-auto flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          M
        </div>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

/* ── Tab 1: Pages List ──────────────────────────────────────── */

const statusConfig = {
  optimized: { label: "Optimized", color: "green" as const },
  partial: { label: "Partial", color: "amber" as const },
  missing: { label: "Missing", color: "red" as const },
};

export function PagesListMockup() {
  const rows = seedPages.slice(0, 7);

  return (
    <AppShell>
      <div className="mx-auto flex h-full max-w-5xl flex-col gap-4 px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Pages
          </h1>
          <button className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground">
            <IconPlus className="size-3.5" />
            New page
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <div className="flex h-8 items-center rounded-md border border-input bg-background pl-9 pr-3 text-xs text-muted-foreground">
            Search pages…
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-md border border-border">
          <div className="grid grid-cols-[110px_1fr_1.4fr_90px_32px] items-center gap-3 border-b border-border bg-muted/30 px-3 py-2 text-[11px] font-medium text-muted-foreground">
            <button className="inline-flex items-center gap-1">
              Status <IconArrowsSort className="size-3" />
            </button>
            <button className="inline-flex items-center gap-1">
              URL <IconArrowsSort className="size-3" />
            </button>
            <button className="inline-flex items-center gap-1">
              Title <IconArrowsSort className="size-3" />
            </button>
            <button className="inline-flex items-center gap-1">
              Updated <IconArrowsSort className="size-3" />
            </button>
            <span />
          </div>
          {rows.map((page) => {
            const status = deriveStatus(page);
            const cfg = statusConfig[status];
            return (
              <div
                key={page.id}
                className="grid grid-cols-[110px_1fr_1.4fr_90px_32px] items-center gap-3 border-b border-border px-3 py-2.5 text-xs last:border-b-0 hover:bg-accent/30"
              >
                <Badge color={cfg.color} className="w-fit px-2 py-0 text-[10px]">
                  {cfg.label}
                </Badge>
                <span className="truncate font-mono text-[11px] text-muted-foreground">
                  {page.url}
                </span>
                <span className="truncate text-foreground">
                  {page.title ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {relativeDate(page.updated_at)}
                </span>
                <IconDots className="size-3.5 text-muted-foreground" />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Showing 1–{rows.length} of 10 pages</span>
        </div>
      </div>
    </AppShell>
  );
}

function relativeDate(iso: string): string {
  const d = new Date(iso);
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days < 1) return "just now";
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ── Tab 2: Page View — platform previews ───────────────────── */

export function PlatformPreviewMockup() {
  const page = seedPages[0]; // Deploy Faster
  const parts = page.url.replace(/^https?:\/\//, "").split("/");
  const domain = parts[0];
  const path = parts.slice(1).filter(Boolean);

  const platforms = ["Google", "X", "Slack", "Facebook", "LinkedIn", "Discord"];

  return (
    <AppShell>
      <div className="mx-auto flex h-full max-w-5xl flex-col gap-3 px-6 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <IconChevronLeft className="size-3" />
          <span>Pages</span>
          <span className="px-1">/</span>
          <span className="font-mono">{page.url}</span>
        </div>

        {/* Two-column layout */}
        <div className="grid flex-1 grid-cols-2 gap-4 overflow-hidden">
          {/* Left: Meta tags card */}
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Meta tags
              </span>
              <button className="inline-flex h-6 items-center gap-1 rounded-full border border-border px-2 text-[10px] text-foreground">
                <IconPencil className="size-3" />
                Edit
              </button>
            </div>

            <FieldRow label="URL" value={page.url} mono />
            <FieldRow label="Keyword" value={page.keyword ?? "—"} />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Title</span>
                <Badge color="green" className="px-1.5 py-0 text-[9px]">
                  {page.title!.length} / 60
                </Badge>
              </div>
              <p className="text-[11px] leading-snug text-foreground">
                {page.title}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  Description
                </span>
                <Badge color="green" className="px-1.5 py-0 text-[9px]">
                  {page.description!.length} / 160
                </Badge>
              </div>
              <p className="text-[11px] leading-snug text-foreground">
                {page.description}
              </p>
            </div>

            <FieldRow label="Slug" value={page.slug ?? "—"} mono />
          </div>

          {/* Right: Preview panel */}
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Preview
            </span>
            <div className="flex flex-wrap gap-1">
              {platforms.map((p, i) => (
                <span
                  key={p}
                  className={
                    i === 0
                      ? "rounded-full border border-transparent bg-foreground px-2.5 py-0.5 text-[10px] font-medium text-background"
                      : "rounded-full border border-border px-2.5 py-0.5 text-[10px] text-foreground"
                  }
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Google preview */}
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span>{domain}</span>
                {path.map((seg, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span>›</span>
                    <span>{seg}</span>
                  </span>
                ))}
              </div>
              <h3 className="text-base font-normal leading-snug text-[oklch(0.546_0.245_262.881)]">
                {page.title}
              </h3>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {page.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function FieldRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <p
        className={
          mono
            ? "truncate font-mono text-[11px] text-foreground"
            : "truncate text-[11px] text-foreground"
        }
      >
        {value}
      </p>
    </div>
  );
}

/* ── Tab 3: Page View — AI generate (edit mode) ─────────────── */

export function AiGenerateMockup() {
  const page = seedPages[1]; // stackform.io/features

  return (
    <AppShell>
      <div className="mx-auto flex h-full max-w-5xl flex-col gap-3 px-6 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <IconChevronLeft className="size-3" />
          <span>Pages</span>
          <span className="px-1">/</span>
          <span className="font-mono">{page.url}</span>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-4 overflow-hidden">
          {/* Left: edit form */}
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Meta tags
              </span>
              <span className="text-[10px] font-medium text-primary">Editing</span>
            </div>

            <EditField label="URL" value={page.url} />
            <EditField label="Keyword" value={page.keyword ?? ""} />

            {/* Title with skeleton */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">Title</span>
                <Badge color="gray" className="px-1.5 py-0 text-[9px]">
                  … / 60
                </Badge>
              </div>
              <div className="h-8 overflow-hidden rounded-md border border-input bg-muted/40">
                <div className="h-full w-[65%] animate-pulse bg-muted" />
              </div>
            </div>

            {/* Description with skeleton */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  Description
                </span>
                <Badge color="gray" className="px-1.5 py-0 text-[9px]">
                  … / 160
                </Badge>
              </div>
              <div className="h-16 space-y-1.5 rounded-md border border-input bg-muted/40 p-2">
                <div className="h-1.5 w-full animate-pulse rounded bg-muted" />
                <div className="h-1.5 w-[85%] animate-pulse rounded bg-muted" />
                <div className="h-1.5 w-[40%] animate-pulse rounded bg-muted" />
              </div>
            </div>

            {/* Generate button — active state */}
            <button
              disabled
              className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-full bg-primary/90 text-xs font-medium text-primary-foreground"
            >
              <IconLoader2 className="size-3.5 animate-spin" />
              Generating…
            </button>

            <div className="flex gap-2">
              <button className="inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-full border border-border text-[11px] text-foreground">
                <IconSparkles className="size-3" />
                Generate with AI
              </button>
              <button className="inline-flex h-7 items-center justify-center gap-1 rounded-full border border-border px-3 text-[11px] text-foreground">
                <IconUpload className="size-3" />
                Upload image
              </button>
            </div>
          </div>

          {/* Right: preview stays visible (empty while generating) */}
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Preview
            </span>
            <div className="flex flex-wrap gap-1">
              {["Google", "X", "Slack", "Facebook", "LinkedIn"].map((p, i) => (
                <span
                  key={p}
                  className={
                    i === 0
                      ? "rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-medium text-background"
                      : "rounded-full border border-border px-2.5 py-0.5 text-[10px] text-foreground"
                  }
                >
                  {p}
                </span>
              ))}
            </div>

            <div className="mt-1 space-y-2 rounded-md border border-dashed border-border p-4">
              <div className="h-2 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
              <div className="h-2 w-full animate-pulse rounded bg-muted" />
              <div className="h-2 w-3/4 animate-pulse rounded bg-muted" />
              <p className="pt-2 text-center text-[10px] text-muted-foreground">
                Waiting for generated content…
              </p>
            </div>

            <div className="flex items-center gap-1.5 rounded-md bg-primary/5 px-3 py-2 text-[10px] text-primary">
              <IconCopy className="size-3" />
              Copy HTML will be available once generation completes
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function EditField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <div className="flex h-7 items-center rounded-md border border-input bg-background px-2 text-[11px] text-foreground">
        {value || (
          <span className="text-muted-foreground">Optional</span>
        )}
      </div>
    </div>
  );
}
