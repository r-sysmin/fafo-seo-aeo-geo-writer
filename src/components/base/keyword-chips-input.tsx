import { useState, useRef, useCallback, KeyboardEvent, ClipboardEvent } from 'react';
import { IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface KeywordChipsInputProps {
  /** Comma-separated string of keywords. */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  leadingIcon?: React.ReactNode;
  /** When true, uses a "bare" style suitable for embedding inside a card row. */
  bare?: boolean;
}

function parseChips(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function serialize(chips: string[]): string {
  return chips.join(', ');
}

export function KeywordChipsInput({
  value,
  onChange,
  placeholder,
  disabled,
  className,
  id,
  leadingIcon,
  bare,
}: KeywordChipsInputProps) {
  const chips = parseChips(value);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = useCallback(
    (raw: string) => {
      const parts = raw
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length === 0) return;
      const next = [...chips];
      for (const p of parts) {
        if (!next.includes(p)) next.push(p);
      }
      onChange(serialize(next));
      setDraft('');
    },
    [chips, onChange],
  );

  const remove = useCallback(
    (idx: number) => {
      const next = chips.filter((_, i) => i !== idx);
      onChange(serialize(next));
    },
    [chips, onChange],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit(draft);
    } else if (e.key === 'Backspace' && draft === '' && chips.length > 0) {
      e.preventDefault();
      remove(chips.length - 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (text.includes(',') || text.includes('\n')) {
      e.preventDefault();
      commit(text);
    }
  };

  const handleBlur = () => {
    if (draft.trim()) commit(draft);
  };

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5',
        bare
          ? 'w-full'
          : 'min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        disabled && 'opacity-60',
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {leadingIcon}
      {chips.map((chip, i) => (
        <span
          key={`${chip}-${i}`}
          className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
        >
          {chip}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              remove(i);
            }}
            disabled={disabled}
            aria-label={`Remove ${chip}`}
            className="inline-flex size-3.5 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <IconX className="size-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={chips.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[8ch] border-0 bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
      />
    </div>
  );
}
