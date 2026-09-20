import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending,
  IconDots,
  IconPencil,
  IconTrash,
  IconWorld,
} from '@tabler/icons-react';

function getFaviconUrl(url: string): string | null {
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch {
    return null;
  }
}

function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    const shown = u.hostname.replace(/^www\./, '') + (u.pathname === '/' ? '' : u.pathname);
    return shown.length > 40 ? `${shown.slice(0, 40)}…` : shown;
  } catch {
    return url.length > 40 ? `${url.slice(0, 40)}…` : url;
  }
}
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/base/badge';
import { useDataProvider } from '@/lib/data-provider';
import { deriveStatus, type Page, type PageStatus } from '@/data/seed';
import { DeletePageDialog } from './delete-page-dialog';
import { format } from 'date-fns';

type SortField = 'status' | 'url' | 'title' | 'updated_at';

interface PagesTableProps {
  pages: Page[];
  sortField: SortField;
  sortDir: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

const statusOrder: Record<PageStatus, number> = {
  optimized: 0,
  partial: 1,
  missing: 2,
};

const statusConfig: Record<PageStatus, { label: string; color: 'green' | 'amber' | 'red' }> = {
  optimized: { label: 'Optimized', color: 'green' },
  partial: { label: 'Partial', color: 'amber' },
  missing: { label: 'Missing', color: 'red' },
};

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'just now';
  if (diffDays < 7) return `${diffDays}d ago`;
  return format(date, 'MMM d, yyyy');
}

function SortIcon({ field, activeField, dir }: { field: SortField; activeField: SortField; dir: 'asc' | 'desc' }) {
  if (field !== activeField) return <IconArrowsSort className="size-4" />;
  return dir === 'asc'
    ? <IconSortAscending className="size-4" />
    : <IconSortDescending className="size-4" />;
}

export function PagesTable({ pages, sortField, sortDir, onSort }: PagesTableProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const provider = useDataProvider();
  const { mutate: deletePage } = provider.useDeletePage();

  const [deleteTarget, setDeleteTarget] = useState<Page | null>(null);

  const isDemo = location.pathname.startsWith('/demo');
  const basePath = isDemo ? '/demo/pages' : '/pages';

  const sortedPages = useMemo(() => {
    if (sortField !== 'status') return pages;

    return [...pages].sort((a, b) => {
      const aStatus = statusOrder[deriveStatus(a)];
      const bStatus = statusOrder[deriveStatus(b)];
      return sortDir === 'asc' ? aStatus - bStatus : bStatus - aStatus;
    });
  }, [pages, sortField, sortDir]);

  const handleRowClick = (id: string) => {
    navigate(`${basePath}/${id}`);
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`${basePath}/${id}?mode=edit`);
  };

  const handleDeleteClick = (e: React.MouseEvent, page: Page) => {
    e.stopPropagation();
    setDeleteTarget(page);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deletePage(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const columns: { field: SortField; label: string }[] = [
    { field: 'status', label: 'Status' },
    { field: 'url', label: 'URL' },
    { field: 'title', label: 'Title' },
    { field: 'updated_at', label: 'Updated' },
  ];

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.field}>
                <button
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => onSort(col.field)}
                >
                  {col.label}
                  <SortIcon field={col.field} activeField={sortField} dir={sortDir} />
                </button>
              </TableHead>
            ))}
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPages.map((page) => {
            const status = deriveStatus(page);
            const config = statusConfig[status];

            return (
              <TableRow
                key={page.id}
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => handleRowClick(page.id)}
              >
                <TableCell>
                  <Badge color={config.color}>{config.label}</Badge>
                </TableCell>
                <TableCell className="max-w-[280px]">
                  <div className="flex items-center gap-2 min-w-0">
                    {(() => {
                      const fav = page.url ? getFaviconUrl(page.url) : null;
                      return fav ? (
                        <img
                          src={fav}
                          alt=""
                          className="size-4 rounded-sm shrink-0"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <IconWorld className="size-4 shrink-0 text-muted-foreground" />
                      );
                    })()}
                    <span className="font-mono text-muted-foreground truncate">
                      {page.url ? displayUrl(page.url) : '—'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {page.title
                    ? (page.title.length > 50 ? `${page.title.slice(0, 50)}…` : page.title)
                    : <span className="text-muted-foreground">—</span>
                  }
                </TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{formatRelativeDate(page.updated_at)}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {format(new Date(page.updated_at), 'MMM d, yyyy h:mm a')}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label="Row actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconDots className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleEdit(e, page.id)}>
                        <IconPencil className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => handleDeleteClick(e, page)}
                      >
                        <IconTrash className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <DeletePageDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        url={deleteTarget?.url ?? ''}
        onConfirm={handleDeleteConfirm}
      />
    </TooltipProvider>
  );
}
