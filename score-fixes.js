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

  // Exact ESPN bindings for NCAA Week 3. Bulk scoreboard matching has proven
  // unreliable for this card, so every wagered game gets an authoritative
  // direct-event feed just like Week 2.
  const week3 = D.leagues?.NCAA?.weeks?.find(w => Number(w.week) === 3);
  if (week3) {
    const week3Bindings = {
      'miami-wake':         { espnEventId:'401858226', team:'Wake Forest', opponent:'Miami (FL)', teamHome:true },
      'houston-texastech':  { espnEventId:'401856811', team:'Houston', opponent:'Texas Tech', teamHome:false },
      'ncstate-vandy':      { espnEventId:'401856695', team:'Vanderbilt', opponent:'NC State', teamHome:true },
      'kentucky-tamu':      { espnEventId:'401856694', team:'Texas A&M', opponent:'Kentucky', teamHome:true },
      'lsu-olemiss':        { espnEventId:'401856688', team:'Ole Miss', opponent:'LSU', teamHome:true }
    };
    for (const ticket of week3.tickets || []) {
      for (const leg of ticket.legs || []) {
        const b = week3Bindings[leg.gameKey];
        if (!b) continue;
        leg.espnEventId = b.espnEventId;
        leg.team = b.team;
        leg.opponent = b.opponent;
        leg.teamHome = b.teamHome;
      }
    }
  }

  D.config.build = 'v1.8.1';
  D.config.lastSiteUpdate = '2026-09-20T00:30:00-07:00';
})();
