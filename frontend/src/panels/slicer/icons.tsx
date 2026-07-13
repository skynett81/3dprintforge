// Minimal inline SVG tool icons for the slicer's left toolbar, styled after
// a desktop slicer's tool palette (OrcaSlicer / Cura).
const S = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const IconAdd = () => (<svg {...S}><path d="M12 5v14M5 12h14" /></svg>);
export const IconDelete = () => (<svg {...S}><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></svg>);
export const IconArrange = () => (<svg {...S}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>);
export const IconMove = () => (<svg {...S}><path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3" /></svg>);
export const IconRotate = () => (<svg {...S}><path d="M20 12a8 8 0 1 1-2.3-5.6" /><path d="M20 4v4h-4" /></svg>);
export const IconScale = () => (<svg {...S}><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M9 15l6-6M15 9h-3M15 9v3" /></svg>);
export const IconLayFlat = () => (<svg {...S}><path d="M12 3v10M8 9l4 4 4-4" /><path d="M4 19h16" /></svg>);
export const IconDuplicate = () => (<svg {...S}><rect x="9" y="9" width="11" height="11" rx="1.5" /><path d="M5 15V5a1 1 0 0 1 1-1h9" /></svg>);
export const IconCenter = () => (<svg {...S}><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /></svg>);
export const IconPrinter = () => (<svg {...S}><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2M7 15h10v6H7z" /></svg>);
export const IconFilament = () => (<svg {...S}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.5" /></svg>);
export const IconProcess = () => (<svg {...S}><path d="M4 6h16M4 12h16M4 18h10" /></svg>);
export const IconExpand = () => (<svg {...S}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>);
export const IconCollapse = () => (<svg {...S}><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>);
export const IconEye = () => (<svg {...S}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="2.5" /></svg>);
