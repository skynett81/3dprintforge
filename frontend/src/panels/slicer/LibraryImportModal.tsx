import { useMemo, useState } from 'react';
import { api } from '../../api';
import { useResource } from '../../hooks';
import { useT } from '../../i18n';
import { useToast } from '../../toast';
import type { LibraryFile } from '../../types';
import { MODEL_FORGE_CATALOG, type ForgeGenerator } from '../../lib/model-forge-catalog';

const MODEL_TYPES = ['stl', '3mf', 'obj', 'step', 'stp'];

/**
 * Pick a model straight from the 3DPrintForge model library and load it onto
 * the slicer plate — everything in one place, no re-uploading.
 */
export function LibraryImportModal({ onClose, onImport }: { onClose: () => void; onImport: (f: File) => void }) {
  const t = useT();
  const toast = useToast();
  const { data } = useResource<LibraryFile[]>(api.listLibrary, 0);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  const [tab, setTab] = useState<'library' | 'forge'>('library');
  const [genBusy, setGenBusy] = useState<string | null>(null);
  const [configGen, setConfigGen] = useState<ForgeGenerator | null>(null);
  const [paramVals, setParamVals] = useState<Record<string, string | number>>({});

  const items = useMemo(() => {
    const all = (data ?? []).filter((i) => MODEL_TYPES.includes((i.file_type || '').toLowerCase()));
    const needle = q.trim().toLowerCase();
    return needle ? all.filter((i) => i.original_name.toLowerCase().includes(needle)) : all;
  }, [data, q]);

  // Model Forge generators, filtered by the search box and grouped by category.
  const forgeGroups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = needle ? MODEL_FORGE_CATALOG.filter((g) => g.label.toLowerCase().includes(needle) || g.cat.toLowerCase().includes(needle)) : MODEL_FORGE_CATALOG;
    const by: Record<string, typeof list> = {};
    for (const g of list) (by[g.cat] ??= []).push(g);
    return Object.entries(by);
  }, [q]);

  async function pick(item: LibraryFile) {
    setBusy(item.id);
    try {
      const file = await api.downloadLibraryModel(item.id, item.original_name);
      onImport(file);
      onClose();
    } catch (e) {
      toast((e as Error).message || t('v2.lib.fail', 'Import failed'), 'error');
    } finally {
      setBusy(null);
    }
  }

  // A generator with params opens a small form; otherwise generate right away.
  function pickGen(g: ForgeGenerator) {
    if (g.params?.length) {
      setConfigGen(g);
      setParamVals(Object.fromEntries(g.params.map((p) => [p.key, p.def])));
    } else generate(g.id);
  }
  async function generate(id: string, params: Record<string, unknown> = {}) {
    setGenBusy(id);
    try {
      const file = await api.generateModelForge(id, params);
      onImport(file);
      onClose();
    } catch (e) {
      toast((e as Error).message || t('v2.lib.gen_fail', 'Generation failed'), 'error');
    } finally {
      setGenBusy(null);
    }
  }

  return (
    <div className="model-modal-backdrop" onClick={onClose}>
      <div className="model-modal lib-modal" onClick={(e) => e.stopPropagation()}>
        <div className="model-modal-head">
          <span>{tab === 'library' ? t('v2.lib.title', 'Import from model library') : t('v2.lib.forge_title', 'Model Forge — generate a model')}</span>
          <button className="btn btn--sm btn--ghost" onClick={onClose}>×</button>
        </div>
        <div style={{ padding: 14 }}>
        <div className="lib-tabs">
          <button className={`lib-tab${tab === 'library' ? ' lib-tab--on' : ''}`} onClick={() => setTab('library')}>{t('v2.lib.tab_library', 'Library')}</button>
          <button className={`lib-tab${tab === 'forge' ? ' lib-tab--on' : ''}`} onClick={() => setTab('forge')}>{t('v2.lib.tab_forge', 'Model Forge')} <span className="muted micro">{MODEL_FORGE_CATALOG.length}</span></button>
        </div>
        <input className="input" placeholder={tab === 'library' ? t('v2.lib.search', 'Search models…') : t('v2.lib.search_gen', 'Search generators…')} value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 12 }} />
        {tab === 'library' ? (
          <div className="lib-grid">
            {items.map((i) => (
              <button key={i.id} className="lib-card" disabled={busy !== null} onClick={() => pick(i)}>
                <div className="lib-thumb">
                  {i.thumbnail_path
                    ? <img src={`/api/library/${i.id}/thumbnail`} alt="" loading="lazy" />
                    : <span className="lib-ext">{(i.file_type || '?').toUpperCase()}</span>}
                </div>
                <span className="lib-name ellipsis" title={i.original_name}>{i.original_name}</span>
                <span className="muted micro">{(i.file_size / 1024 / 1024).toFixed(1)} MB{busy === i.id ? ` · ${t('v2.lib.loading', 'loading…')}` : ''}</span>
              </button>
            ))}
            {items.length === 0 && <p className="muted empty-note">{t('v2.lib.empty', 'No models in the library yet.')}</p>}
          </div>
        ) : configGen ? (
          <div className="lib-genform">
            <div className="lib-forge-cat">{configGen.label}</div>
            <div className="oslice-colorlayer-grid">
              {configGen.params!.map((p) => (
                <label key={p.key} className="oset-field">
                  <span className="oslice-sectlbl">{p.label}</span>
                  <input className="oset-input" type={p.type === 'num' ? 'number' : 'text'} step={p.step} value={paramVals[p.key] ?? ''} onChange={(e) => setParamVals((v) => ({ ...v, [p.key]: p.type === 'num' ? Number(e.target.value) : e.target.value }))} />
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn--sm" disabled={genBusy !== null} onClick={() => generate(configGen.id, paramVals)}>{genBusy ? t('v2.lib.generating', 'generating…') : t('v2.lib.generate', 'Generate & add to plate')}</button>
              <button className="btn btn--sm btn--ghost" onClick={() => setConfigGen(null)}>{t('common.back', 'Back')}</button>
            </div>
          </div>
        ) : (
          <div className="lib-forge">
            {forgeGroups.map(([cat, gens]) => (
              <div key={cat} className="lib-forge-grp">
                <div className="lib-forge-cat">{cat}</div>
                <div className="lib-forge-grid">
                  {gens.map((g) => (
                    <button key={g.id} className="lib-gencard" disabled={genBusy !== null} onClick={() => pickGen(g)} title={g.params?.length ? t('v2.lib.configure', 'Set parameters & generate') : t('v2.lib.generate', 'Generate & add to plate')}>
                      {g.label}{g.params?.length ? ' …' : ''}{genBusy === g.id && <span className="muted micro"> · {t('v2.lib.generating', 'generating…')}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
