(() => {
  const D = window.BET_TRACKER_DATA;
  if (!D) return;

  // Exact ESPN event bindings for NCAA Week 2. These prevent live-score
  // matching from depending on display-name aliases (e.g. Arizona State vs Arizona St).
  const week2 = D.leagues?.NCAA?.weeks?.find(w => Number(w.week) === 2);
  if (!week2) return;

  const bindings = {
    'asu-tamu':              { espnEventId:'401856683', team:'Arizona St', opponent:'Texas A&M' },
    'oregon-okstate':        { espnEventId:'401856782', team:'Oregon', opponent:'Oklahoma St' },
    'tennessee-gatech':      { espnEventId:'401856681', team:'Tennessee', opponent:'Georgia Tech' },
    'oklahoma-michigan':     { espnEventId:'401856679', team:'Michigan', opponent:'Oklahoma' },
    'ohiostate-texas':       { espnEventId:'401856682', team:'Ohio State', opponent:'Texas' },
    'boisestate-memphis':    { espnEventId:'401860881', team:'Memphis', opponent:'Boise St' },
    'iowastate-iowa':        { espnEventId:'401856788', team:'Iowa State', opponent:'Iowa' }
  };

  for (const ticket of week2.tickets || []) {
    for (const leg of ticket.legs || []) {
      const b = bindings[leg.gameKey];
      if (!b) continue;
      leg.espnEventId = b.espnEventId;
      leg.team = b.team;
      leg.opponent = b.opponent;
    }
  }

  D.config.build = 'v1.7.3';
  D.config.lastSiteUpdate = '2026-09-12T12:53:00-07:00';
})();
