import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useT } from '../i18n';

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  keywords?: string;
  icon?: JSX.Element;
  /** If set, invoked instead of onSelect (for quick actions). */
  run?: () => void;
  /** Right-aligned hint, e.g. a keyboard shortcut. */
  hint?: string;
}

interface CommandPaletteProps {
  open: boolean;
  items: CommandItem[];
  onSelect: (id: string) => void;
  onClose: () => void;
  /** Optional async data search (spools, history, customers …). */
  search?: (query: string) => Promise<CommandItem[]>;
  /** Shown (with actions) when the query is empty. */
  recent?: CommandItem[];
  /** Quick actions shown when the query is empty. */
  actions?: CommandItem[];
}

// Substring match, ranked: label prefix > label contains > keyword/group contains.
function score(item: CommandItem, q: string): number {
  if (!q) return 1;
  const label = item.label.toLowerCase();
  const hay = `${item.group ?? ''} ${item.keywords ?? ''}`.toLowerCase();
  if (label.startsWith(q)) return 3;
  if (label.includes(q)) return 2;
  if (hay.includes(q)) return 1;
  return 0;
}

/**
 * Global quick-jump palette (Ctrl/Cmd+K). Filters navigable destinations by
 * substring and supports full keyboard control: type to filter, arrows to
 * move, Enter to go, Esc to close.
 */
export function CommandPalette({ open, items, onSelect, onClose, search, recent, actions }: CommandPaletteProps) {
  const t = useT();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const [dynamic, setDynamic] = useState<CommandItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const navResults = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items
      .map((it) => ({ it, s: score(it, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.it);
  }, [items, q]);
  const results = useMemo(() => {
    if (!q.trim()) {
      const base = [...(recent ?? []), ...(actions ?? [])];
      return base.length ? base : navResults;
    }
    return [...navResults, ...dynamic];
  }, [q, recent, actions, navResults, dynamic]);

  // Debounced async data search (needs ≥2 chars to avoid hammering the API).
  useEffect(() => {
    const query = q.trim();
    if (!search || query.length < 2) { setDynamic([]); setLoading(false); return; }
    setLoading(true);
    let alive = true;
    const id = setTimeout(() => {
      search(query)
        .then((r) => { if (alive) setDynamic(r); })
        .catch(() => { if (alive) setDynamic([]); })
        .finally(() => { if (alive) setLoading(false); });
    }, 220);
    return () => { alive = false; clearTimeout(id); };
  }, [q, search]);

  useEffect(() => {
    if (open) { setQ(''); setActive(0); setDynamic([]); const id = setTimeout(() => inputRef.current?.focus(), 20); return () => clearTimeout(id); }
  }, [open]);
  useEffect(() => { setActive(0); }, [q]);
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('.cmd-row--active');
    el?.scrollIntoView?.({ block: 'nearest' });
  }, [active, results]);

  if (!open) return null;

  function choose(idx: number) {
    const item = results[idx];
    if (!item) return;
    if (item.run) item.run(); else onSelect(item.id);
    onClose();
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  }

  return (
    <div className="cmd-backdrop" onMouseDown={onClose}>
      <div className="cmd-panel" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={t('v2.cmd.title', 'Command palette')}>
        <div className="cmd-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            ref={inputRef}
            className="cmd-input"
            placeholder={t('v2.cmd.placeholder', 'Jump to…')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <kbd className="cmd-kbd">Esc</kbd>
        </div>
        <div className="cmd-list" ref={listRef}>
          {results.length === 0 ? (
            <div className="cmd-empty">{loading ? t('v2.cmd.searching', 'Searching…') : t('v2.cmd.none', 'No matches')}</div>
          ) : results.map((it, i) => {
            const showHeader = !!it.group && it.group !== results[i - 1]?.group;
            return (
              <Fragment key={it.id}>
                {showHeader && <div className="cmd-section">{it.group}</div>}
                <button
                  className={`cmd-row${i === active ? ' cmd-row--active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                >
                  {it.icon && <span className="cmd-icon">{it.icon}</span>}
                  <span className="cmd-label">{it.label}</span>
                  {it.hint && <kbd className="cmd-hint">{it.hint}</kbd>}
                </button>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
