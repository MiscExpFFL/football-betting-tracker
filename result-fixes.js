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

  // Freeze completed NCAA Week 3 tickets from official final scores so the
  // tracker remains correct even if the public live feed stalls.
  const ncaaWeek3 = D.leagues?.NCAA?.weeks?.find(w => Number(w.week) === 3);
  if (ncaaWeek3) {
    const settled = {
      'NCAA-W3-01': ['win', 100],
      'NCAA-W3-02': ['loss', -50],
      'NCAA-W3-03': ['win', 100],
      'NCAA-W3-04': ['loss', -110],
      'NCAA-W3-05': ['win', 68],
      'NCAA-W3-06': ['loss', -50],
      'NCAA-W3-07': ['loss', -50],
      'NCAA-W3-08': ['loss', -50]
    };
    for (const ticket of ncaaWeek3.tickets || []) {
      const row = settled[ticket.id];
      if (!row) continue;
      ticket.result = row[0];
      ticket.pnl = row[1];
      ticket.settledAt = '2026-09-20T00:34:00-07:00';
    }
  }

  // Two cross-league tickets are already dead because the Texas A&M legs lost.
  const crossWeek = D.leagues?.CROSS?.weeks?.find(w => Number(w.week) === 3);
  if (crossWeek) {
    const settledCross = {
      'CROSS-W3-01': ['loss', -100],
      'CROSS-W3-02': ['loss', -100]
    };
    for (const ticket of crossWeek.tickets || []) {
      const row = settledCross[ticket.id];
      if (!row) continue;
      ticket.result = row[0];
      ticket.pnl = row[1];
      ticket.settledAt = '2026-09-20T00:34:00-07:00';
    }
  }

  D.config.build = 'v1.8.2';
  D.config.lastSiteUpdate = '2026-09-20T00:34:00-07:00';
})();
