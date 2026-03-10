// Filament Wrapper — forecast and multicolor are now integrated as tabs in filament-tracker.js
// This file is kept for backwards compatibility with hash routing
(function() {
  const _origLoad = window.loadFilamentPanel;
  // loadFilamentPanel now handles forecast/multicolor tabs internally
  // The wrapper just maps old initialTab params to the correct filament sub-tab
  window.loadFilamentPanel = function(initialTab) {
    if (_origLoad) _origLoad(initialTab);
  };
})();
