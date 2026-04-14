// Model Forge — Phone Stand
(function() {
  'use strict';
  window.loadForgePhoneStand = function() {
    const v = id => parseFloat(document.getElementById(id)?.value) || 0;
    window.ForgeCommon.buildTool({
      title: 'Phone / Tablet Stand', icon: '📱',
      endpoint: '/api/model-forge/phone-stand/generate-3mf',
      downloadName: 'phone_stand',
      helpText: 'Desktop stand with an angled back support and a front lip. Print with supports off — the triangular back is self-supporting.',
      fields: [
        { type: 'num', label: 'Device width (mm)', id: 'ps-dw', min: 50, max: 250, val: 80, step: 1 },
        { type: 'num', label: 'Back height (mm)', id: 'ps-bh', min: 40, max: 200, val: 90, step: 2 },
        { type: 'num', label: 'Base depth (mm)', id: 'ps-bd', min: 40, max: 150, val: 60, step: 2 },
        { type: 'num', label: 'Wall thickness (mm)', id: 'ps-wt', min: 2, max: 6, val: 3, step: 0.2 },
      ],
      getParams: () => ({
        deviceWidth: v('ps-dw'),
        backHeight: v('ps-bh'), baseDepth: v('ps-bd'),
        wallThickness: v('ps-wt'),
      }),
      renderPreview: (p) => {
        const s = Math.min(3, 220 / Math.max(p.backHeight, p.baseDepth + p.backHeight));
        const bd = p.baseDepth * s, bh = p.backHeight * s, w = (p.deviceWidth + 16) * s;
        return `<div style="font-size:0.7rem;color:var(--text-muted);margin:4px 0">For ${p.deviceWidth}mm wide device · ${p.backHeight}mm tall</div>
        <svg width="${w+bd+40}" height="${bh+bd+20}" viewBox="-10 -10 ${w+bd+40} ${bh+bd+20}">
          <rect x="0" y="${bh}" width="${bd}" height="${bd/8}" fill="#5a6f9a" stroke="#1a2030" stroke-width="1.5"/>
          <polygon points="0,${bh} ${bd*0.7},${bh} 0,0" fill="#7a90bc" stroke="#1a2030" stroke-width="1.5"/>
        </svg>`;
      }
    });
  };
})();
