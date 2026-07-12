// whats-new.js
// A one-time, dismissible "What's new" modal that surfaces recently added
// features users would otherwise never discover. Shown once per VERSION to
// users who have already finished onboarding.
//
// KEEP THIS CURRENT: whenever a release adds user-facing features, refresh the
// FEATURES list with the new batch and bump VERSION so everyone sees it again.
// VERSION history: 1 = sidebar search/pin, overlay, Spoolman. 2 = v1.1.24.
// 3 = richer stats, accessories, reliable history. 4 = inventory expiry +
// procurement + scan/stocktake + reports, Print Guard upgrade, unified UI.
// 5 = v1.1.25: order profitability/margins, storefront + product catalog,
// order-to-queue fulfilment, PO shipment tracking, shopping list + auto-reorder.
(function () {
  'use strict';

  var VERSION = '5';
  var KEY = 'whatsnew-seen-v' + VERSION;

  var FEATURES = [
    {
      icon: 'bi-graph-up-arrow',
      title: 'Order profitability & margins',
      desc: 'The CRM dashboard now shows revenue vs real cost of goods — margin and margin % per order, a margin-by-month chart and your most profitable products. Every order detail carries its own profitability card, using the actual filament cost.',
      action: { label: 'Open', fn: function () { if (window.openPanel) { window.openPanel('crm-dashboard'); } } },
    },
    {
      icon: 'bi-shop',
      title: 'Storefront & product catalog',
      desc: 'A new Products catalog (Business → Products) with per-unit cost and live margin, and a customer-facing shop at /shop where visitors browse and order. Orders land straight in your CRM as pending, ready to price and produce.',
      action: { label: 'Open', fn: function () { if (window.openPanel) { window.openPanel('shop-products'); } } },
    },
    {
      icon: 'bi-printer',
      title: 'Orders straight to the print queue',
      desc: 'Add catalog products to an order, then dispatch its printable lines to the print queue in one click — stock is deducted and each line shows an "in queue" badge so you can track fulfilment from order to print.',
    },
    {
      icon: 'bi-truck',
      title: 'Purchase order shipment tracking',
      desc: 'Purchase orders gain a Shipped stage: record the carrier and tracking number and get a one-click Track link (PostNord, Posten, Bring, DHL, UPS, FedEx, GLS, USPS) between placing and receiving.',
    },
    {
      icon: 'bi-cart-check',
      title: 'Shopping list & auto-reorder',
      desc: 'Turn low stock into a per-shop shopping basket — the cheapest supplier per material with buy links and totals. Or switch on Auto-reorder to have the server draft purchase orders (or notify you) automatically when filament drops below target.',
      action: { label: 'Open', fn: function () { if (window.openPanel) { window.openPanel('filament'); } location.hash = '#filament'; } },
    },
  ];

  function markSeen() { try { localStorage.setItem(KEY, '1'); } catch (e) { /* ignore */ } }

  function show() {
    if (typeof window.openModal !== 'function') { setTimeout(show, 600); return; }
    var rows = FEATURES.map(function (f, i) {
      var border = i < FEATURES.length - 1 ? 'border-bottom:1px solid var(--border-color)' : '';
      var btn = f.action ? '<button class="form-btn form-btn-sm" data-wn-action="' + i + '" style="align-self:center;white-space:nowrap">' + f.action.label + '</button>' : '';
      return '<div style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;' + border + '">'
        + '<div style="width:34px;height:34px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:8px;background:var(--bg-tertiary);color: var(--accent-green-text)"><i class="bi ' + f.icon + '" style="font-size:1.1rem"></i></div>'
        + '<div style="flex:1;min-width:0"><div style="font-weight:600;font-size:0.9rem">' + f.title + '</div>'
        + '<div class="text-muted" style="font-size:0.78rem">' + f.desc + '</div></div>'
        + btn + '</div>';
    }).join('');

    var html = '<div style="padding:22px;max-width:560px">'
      + '<h3 style="margin:0 0 4px;font-size:1.1rem;display:flex;align-items:center;gap:8px"><i class="bi bi-stars" style="color: var(--accent-green-text)"></i> What\'s new</h3>'
      + '<p class="text-muted" style="font-size:0.82rem;margin:0 0 8px">A few recent additions you might have missed.</p>'
      + rows
      + '<div style="display:flex;justify-content:flex-end;margin-top:16px"><button class="form-btn form-btn-sm form-btn-success" data-wn-dismiss>Got it</button></div>'
      + '</div>';

    var modal = window.openModal(html, { style: 'max-width:600px;width:94%' });
    markSeen(); // showing it counts as seen, however it is closed

    modal.overlay.querySelectorAll('[data-wn-action]').forEach(function (b) {
      b.addEventListener('click', function () {
        var f = FEATURES[parseInt(b.getAttribute('data-wn-action'), 10)];
        modal.close();
        if (f && f.action && f.action.fn) { try { f.action.fn(); } catch (e) { /* ignore */ } }
      });
    });
    var dismiss = modal.overlay.querySelector('[data-wn-dismiss]');
    if (dismiss) dismiss.addEventListener('click', modal.close);
  }

  function init() {
    try { if (localStorage.getItem(KEY)) return; } catch (e) { return; }
    // New installs: let onboarding lead. Re-checks on a later session once the
    // tour is done, so the announcement isn't lost — just deferred.
    try { if (!localStorage.getItem('onboarding-completed')) return; } catch (e) { return; }
    setTimeout(show, 1500);
  }

  // Manual entry point (navbar "What's new" button) — re-opens the modal any
  // time, regardless of whether it has already been auto-shown/dismissed.
  window.showWhatsNew = show;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
