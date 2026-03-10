// Achievements / Gamification Panel
(function() {
  'use strict';

  window.loadAchievementsPanel = async function() {
    const panel = document.getElementById('overlay-panel-body');
    if (!panel) return;

    try {
      const res = await fetch('/api/achievements');
      const achievements = await res.json();

      const earned = achievements.filter(a => a.earned);
      const inProgress = achievements.filter(a => !a.earned && a.progress > 0);
      const locked = achievements.filter(a => !a.earned && a.progress === 0);

      const categories = ['prints', 'filament', 'time', 'quality'];
      const catNames = { prints: 'Prints', filament: 'Filament', time: 'Time', quality: 'Quality' };

      let h = '<div class="achievements-container">';

      // Summary hero
      h += '<div class="ach-hero">';
      h += `<div class="ach-hero-stat"><span class="ach-hero-num">${earned.length}</span><span class="ach-hero-label">${t('achievements.earned') || 'Earned'}</span></div>`;
      h += `<div class="ach-hero-stat"><span class="ach-hero-num">${achievements.length}</span><span class="ach-hero-label">${t('achievements.total') || 'Total'}</span></div>`;
      h += `<div class="ach-hero-stat"><span class="ach-hero-num">${Math.round(earned.length / achievements.length * 100)}%</span><span class="ach-hero-label">${t('achievements.completion') || 'Completion'}</span></div>`;
      h += '</div>';

      // Progress bar
      h += '<div class="ach-progress-bar"><div class="ach-progress-fill" style="width:' + (earned.length / achievements.length * 100) + '%"></div></div>';

      // Category tabs
      h += '<div class="tabs" style="margin:16px 0 12px"><div class="tabs-list">';
      h += '<button class="tab-btn active" onclick="filterAchievements(\'all\')">All</button>';
      for (const cat of categories) {
        h += `<button class="tab-btn" onclick="filterAchievements('${cat}')">${catNames[cat]}</button>`;
      }
      h += '</div></div>';

      // Achievement grid
      h += '<div class="auto-grid auto-grid--md" id="ach-grid">';
      for (const a of [...earned, ...inProgress, ...locked]) {
        const cls = a.earned ? 'ach-card ach-earned' : a.progress > 0 ? 'ach-card ach-progress' : 'ach-card ach-locked';
        h += `<div class="${cls}" data-category="${a.category}">`;
        h += `<div class="ach-icon">${a.icon}</div>`;
        h += `<div class="ach-info">`;
        h += `<div class="ach-title">${esc(a.title)}</div>`;
        h += `<div class="ach-desc">${esc(a.desc)}</div>`;
        if (!a.earned) {
          h += `<div class="ach-bar"><div class="ach-bar-fill" style="width:${a.progress * 100}%"></div></div>`;
          h += `<div class="ach-bar-label">${a.current} / ${a.target}</div>`;
        } else {
          h += '<div class="ach-badge">Earned!</div>';
        }
        h += '</div></div>';
      }
      h += '</div></div>';

      panel.innerHTML = h;
    } catch (e) {
      panel.innerHTML = emptyState({
        icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 0114 0v2"/></svg>',
        title: 'Could not load achievements',
        desc: e.message
      });
    }
  };

  window.filterAchievements = function(category) {
    const cards = document.querySelectorAll('#ach-grid .ach-card');
    const btns = document.querySelectorAll('.tabs-list .tab-btn');
    btns.forEach((b, i) => b.classList.toggle('active', (category === 'all' && i === 0) || b.textContent.toLowerCase() === category));
    cards.forEach(c => {
      c.style.display = (category === 'all' || c.dataset.category === category) ? '' : 'none';
    });
  };
})();
