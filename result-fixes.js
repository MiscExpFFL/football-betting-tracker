(() => {
  const D = window.BET_TRACKER_DATA;
  if (!D) return;

  // Manual settlement overrides for wagers whose live feed failed to grade correctly.
  const ncaaWeek2 = D.leagues?.NCAA?.weeks?.find(w => Number(w.week) === 2);
  if (ncaaWeek2) {
    const iowaState = (ncaaWeek2.tickets || []).find(t => t.id === 'NCAA-W2-10');
    if (iowaState) {
      iowaState.result = 'win';
      iowaState.pnl = 25;
      iowaState.settledAt = '2026-09-13T18:36:00-07:00';
    }
  }

  D.config.build = 'v1.7.10';
  D.config.lastSiteUpdate = '2026-09-13T18:36:00-07:00';
})();
