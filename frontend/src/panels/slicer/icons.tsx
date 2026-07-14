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
export const IconEyeOff = () => (<svg {...S}><path d="M4 4l16 16M9.9 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.2 7.4A17 17 0 0 0 2 12s3.5 7 10 7a9.6 9.6 0 0 0 3.3-.6M9.5 9.6a2.5 2.5 0 0 0 3.4 3.6" /></svg>);
export const IconResetView = () => (<svg {...S}><path d="M3 9l9-6 9 6v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9Z" /></svg>);
export const IconAutoOrient = () => (<svg {...S}><path d="M12 3l7 4v10l-7 4-7-4V7l7-4Z" /><path d="M12 3v18M5 7l7 4 7-4" /></svg>);
export const IconPlaceFace = () => (<svg {...S}><path d="M3 17l9 4 9-4M3 17l4-9 5 2 5-2 4 9M8 10l4-6 4 6" /></svg>);
export const IconSplit = () => (<svg {...S}><path d="M12 3v18" strokeDasharray="3 3" /><path d="M4 8l4-2v12l-4 2V8ZM20 8l-4-2v12l4 2V8Z" /></svg>);
export const IconMeasure = () => (<svg {...S}><path d="M3 8l5-5 13 13-5 5L3 8Z" /><path d="M8 8l1.5 1.5M11 5l1.5 1.5M14 8l1.5 1.5M6 11l1.5 1.5" /></svg>);
export const IconSimplify = () => (<svg {...S}><path d="M12 3l9 6-9 12L3 9l9-6Z" /><path d="M12 3v18M3 9h18" /></svg>);
export const IconSupportPaint = () => (<svg {...S}><path d="M15.5 3.5a2.1 2.1 0 0 1 3 3L11 14l-4 1 1-4 7.5-7.5Z" /><path d="M6 21c-2 0-3-1.2-3-3 0-1.5 1.5-2 2.5-2.5" /></svg>);
export const IconSeamPaint = () => (<svg {...S}><path d="M12 3v18" strokeDasharray="2 3" /><path d="M9 6l3-3 3 3M9 18l3 3 3-3" /></svg>);
export const IconColorPaint = () => (<svg {...S}><path d="M12 3a9 9 0 1 0 0 18c1.3 0 2-1 2-2 0-1.3-1-1.4-1-2.5 0-.8.7-1.5 1.5-1.5H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8Z" /><circle cx="8.5" cy="10.5" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" /><circle cx="15.5" cy="10.5" r="1" fill="currentColor" stroke="none" /></svg>);
export const IconCut = () => (<svg {...S}><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.5 7.5L20 18M8.5 16.5L20 6" /></svg>);
export const IconBoolean = () => (<svg {...S}><circle cx="9" cy="12" r="6" /><circle cx="15" cy="12" r="6" /></svg>);
export const IconShape = () => (<svg {...S}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></svg>);
export const IconText = () => (<svg {...S}><path d="M5 5h14M12 5v14M9 19h6" /></svg>);
export const IconFuzzy = () => (<svg {...S}><path d="M3 12h2l1-2 2 4 2-6 2 8 2-6 2 4 1-2h2" /></svg>);
export const IconImage = () => (<svg {...S}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="M21 16l-5-5-9 9" /></svg>);
