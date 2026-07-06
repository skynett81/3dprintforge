import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Reuses the existing 3DPrintForge language files (public/lang/*.json) rather
// than forking the key set. Same call convention as the vanilla app:
//   t('section.key', 'English fallback')
// — the fallback is shown when the key is missing, so the UI works even
// before keys are added.

type Dict = Record<string, unknown>;
type TFn = (key: string, fallback?: string) => string;

const I18nContext = createContext<TFn>((_, fallback) => fallback ?? _);

function lookup(dict: Dict, key: string): string | undefined {
  let cur: unknown = dict;
  for (const part of key.split('.')) {
    if (cur && typeof cur === 'object' && part in (cur as Dict)) cur = (cur as Dict)[part];
    else return undefined;
  }
  return typeof cur === 'string' ? cur : undefined;
}

export function I18nProvider({ lang = 'en', children }: { lang?: string; children: ReactNode }) {
  const [dict, setDict] = useState<Dict>({});

  useEffect(() => {
    let alive = true;
    fetch(`/lang/${lang}.json`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => { if (alive) setDict(d); })
      .catch(() => { /* fall back to inline strings */ });
    return () => { alive = false; };
  }, [lang]);

  const t: TFn = (key, fallback) => lookup(dict, key) ?? fallback ?? key;
  return <I18nContext.Provider value={t}>{children}</I18nContext.Provider>;
}

export function useT(): TFn {
  return useContext(I18nContext);
}
