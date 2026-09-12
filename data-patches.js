(() => {
  const D = window.BET_TRACKER_DATA;
  if (!D) return;

  const ncaa = D.leagues?.NCAA;
  if (!ncaa) return;

  // Permanently freeze NCAA Week 1 now that every booked ticket is settled.
  // Historical Week 1 P/L no longer depends on the live ESPN feed.
  const week1 = ncaa.weeks?.find(w => Number(w.week) === 1);
  if (week1) {
    week1.archived = true;
    const settled = {
      'NCAA-W1-01': ['loss', -110],
      'NCAA-W1-02': ['win', 50],
      'NCAA-W1-03': ['loss', -55],
      'NCAA-W1-04': ['win', 50],
      'NCAA-W1-05': ['win', 66],
      'NCAA-W1-06': ['loss', -50],
      'NCAA-W1-07': ['loss', -50],
      'NCAA-W1-08': ['loss', -25],
      'NCAA-W1-09': ['loss', -25],
      'NCAA-W1-10': ['loss', -55],
      'NCAA-W1-11': ['win', 50],
      'NCAA-W1-12': ['loss', -27],
      'NCAA-W1-13': ['win', 200],
      'NCAA-W1-14': ['win', 100]
    };
    for (const ticket of week1.tickets || []) {
      const row = settled[ticket.id];
      if (!row) continue;
      ticket.result = row[0];
      ticket.pnl = row[1];
      ticket.settledAt = ticket.settledAt || '2026-09-07T23:59:00-07:00';
    }
  }

  // Exact ESPN bindings + home/away identity for every NCAA Week 2 game.
  // teamHome lets the direct event feed identify the wager side without relying
  // on ESPN's changing display-name conventions (Arizona State vs Arizona St, etc.).
  const week2 = ncaa.weeks?.find(w => Number(w.week) === 2);
  if (week2) {
    const bindings = {
      'asu-tamu':           { espnEventId:'401856683', team:'Arizona State', opponent:'Texas A&M', teamHome:false },
      'oregon-okstate':     { espnEventId:'401856782', team:'Oregon', opponent:'Oklahoma State', teamHome:false },
      'tennessee-gatech':   { espnEventId:'401856681', team:'Tennessee', opponent:'Georgia Tech', teamHome:false },
      'oklahoma-michigan':  { espnEventId:'401856679', team:'Michigan', opponent:'Oklahoma', teamHome:true },
      'ohiostate-texas':    { espnEventId:'401856682', team:'Ohio State', opponent:'Texas', teamHome:false },
      'boisestate-memphis': { espnEventId:'401860881', team:'Memphis', opponent:'Boise State', teamHome:true },
      'iowastate-iowa':     { espnEventId:'401856788', team:'Iowa State', opponent:'Iowa', teamHome:false }
    };
    for (const ticket of week2.tickets || []) {
      for (const leg of ticket.legs || []) {
        const b = bindings[leg.gameKey];
        if (!b) continue;
        leg.espnEventId = b.espnEventId;
        leg.team = b.team;
        leg.opponent = b.opponent;
        leg.teamHome = b.teamHome;
      }
    }
  }

  D.config.build = 'v1.7.7';
  D.config.lastSiteUpdate = '2026-09-12T14:05:00-07:00';
})();