import { IconFileSearch } from '@tabler/icons-react';
import { Button } from '@/components/base/button';

interface PagesBlankslateProps {
  onAddPage: () => void;
}

export function PagesBlankslate({ onAddPage }: PagesBlankslateProps) {
  const bar = 'rounded bg-accent h-4';

  return (
    <div className="relative">
      <div className="pointer-events-none space-y-3 p-6" aria-hidden>
        <div className={`${bar} w-3/4`} />
        <div className={`${bar} w-1/2`} />
        <div className={`${bar} w-2/3`} />
        <div className={`${bar} w-1/2`} />
        <div className={`${bar} w-3/5`} />
        <div className={`${bar} w-2/5`} />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />

      <div className="absolute inset-0 flex items-start justify-center pt-[10%]">
        <div className="flex max-w-sm flex-col items-center gap-4 rounded-lg border border-border bg-background p-6 shadow-lg text-center">
          <IconFileSearch className="size-8 text-muted-foreground" />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">No pages yet.</p>
            <p className="text-sm text-muted-foreground">
              Add your first URL to start tracking and optimizing.
            </p>
          </div>
          <Button onClick={onAddPage}>Add your first page</Button>
        </div>
      </div>
    </div>
  );
}
