// Onboarding Tour — guided walkthrough for new users
(function() {
  'use strict';

  const TOUR_KEY = 'onboarding-completed';

  const TOUR_STEPS = [
    {
      target: '#sidebar',
      title: 'Navigation',
      text: 'Use the sidebar to navigate between Dashboard, Controls, Filament, History, and more. Sections are collapsible.',
      position: 'right'
    },
    {
      target: '#stats-strip',
      title: 'Live Stats',
      text: 'Real-time sparkline charts showing nozzle, bed, and chamber temperatures, fan speed, print speed, and layer progress.',
      position: 'bottom'
    },
    {
      target: '#dashboard-grid',
      title: 'Dashboard',
      text: 'Your main overview with print progress, camera feed, AMS status, temperature gauges, and quick controls.',
      position: 'top'
    },
    {
      target: '.printer-selector',
      title: 'Printer Selector',
      text: 'If you have multiple printers, switch between them here. Each printer has its own status and data.',
      position: 'bottom'
    },
    {
      target: '#theme-toggle',
      title: 'Theme & Display',
      text: 'Toggle between light and dark mode. Press T for quick toggle, or ? to see all keyboard shortcuts.',
      position: 'bottom'
    }
  ];

  function _createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'tour-overlay';
    overlay.id = 'tour-overlay';
    document.body.appendChild(overlay);
    return overlay;
  }

  function _createTooltip() {
    const tip = document.createElement('div');
    tip.className = 'tour-tooltip';
    tip.id = 'tour-tooltip';
    document.body.appendChild(tip);
    return tip;
  }

  function _showStep(idx) {
    const step = TOUR_STEPS[idx];
    const target = document.querySelector(step.target);
    const tooltip = document.getElementById('tour-tooltip') || _createTooltip();
    const overlay = document.getElementById('tour-overlay') || _createOverlay();

    // Highlight target
    if (target) {
      target.style.position = target.style.position || 'relative';
      target.classList.add('tour-highlight');
    }

    const total = TOUR_STEPS.length;
    const isLast = idx === total - 1;
    const isFirst = idx === 0;

    tooltip.innerHTML = `
      <div class="tour-step-counter">${idx + 1} / ${total}</div>
      <div class="tour-title">${step.title}</div>
      <div class="tour-text">${step.text}</div>
      <div class="tour-actions">
        <button class="form-btn form-btn-secondary tour-skip" onclick="endTour()">Skip</button>
        <div style="display:flex;gap:6px">
          ${!isFirst ? '<button class="form-btn form-btn-secondary tour-prev" onclick="tourPrev()">Back</button>' : ''}
          <button class="form-btn tour-next" onclick="${isLast ? 'endTour()' : 'tourNext()'}">${isLast ? 'Finish' : 'Next'}</button>
        </div>
      </div>
    `;

    // Position tooltip
    if (target) {
      const rect = target.getBoundingClientRect();
      const tw = 320;
      let top, left;

      switch (step.position) {
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + 16;
          break;
        case 'bottom':
          top = rect.bottom + 16;
          left = rect.left + rect.width / 2 - tw / 2;
          break;
        case 'top':
          top = rect.top - 16;
          left = rect.left + rect.width / 2 - tw / 2;
          tooltip.style.transform = 'translateY(-100%)';
          break;
        default:
          top = rect.bottom + 16;
          left = rect.left;
      }

      // Keep within viewport
      left = Math.max(16, Math.min(left, window.innerWidth - tw - 16));
      top = Math.max(16, top);

      tooltip.style.top = top + 'px';
      tooltip.style.left = left + 'px';
      if (step.position !== 'top') tooltip.style.transform = '';
    } else {
      // Center if target not found
      tooltip.style.top = '50%';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translate(-50%, -50%)';
    }

    tooltip.style.display = 'block';
    overlay.style.display = 'block';
  }

  function _clearHighlights() {
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
  }

  let _currentStep = 0;

  window.startTour = function() {
    _currentStep = 0;
    _createOverlay();
    _createTooltip();
    _showStep(0);
  };

  window.tourNext = function() {
    _clearHighlights();
    _currentStep++;
    if (_currentStep < TOUR_STEPS.length) {
      _showStep(_currentStep);
    } else {
      endTour();
    }
  };

  window.tourPrev = function() {
    _clearHighlights();
    if (_currentStep > 0) {
      _currentStep--;
      _showStep(_currentStep);
    }
  };

  window.endTour = function() {
    _clearHighlights();
    const tooltip = document.getElementById('tour-tooltip');
    const overlay = document.getElementById('tour-overlay');
    if (tooltip) tooltip.remove();
    if (overlay) overlay.remove();
    try { localStorage.setItem(TOUR_KEY, '1'); } catch (_) {}
  };

  // Auto-start tour for first-time users (delay to let dashboard load)
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (!localStorage.getItem(TOUR_KEY)) {
        startTour();
      }
    }, 2000);
  });
})();
