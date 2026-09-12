(() => {
  const B = window.BT;
  const D = window.BET_TRACKER_DATA;
  if (!B || !D) return;

  const identityKeys = {
    'asu-tamu':              [['arizonastate','asu'],['texasam','tamu','aggies']],
    'oregon-okstate':        [['oregon','ore'],['oklahomastate','oklahomast','okst']],
    'tennessee-gatech':      [['tennessee','tenn'],['georgiatech','gatech','gt']],
    'oklahoma-michigan':     [['michigan','mich'],['oklahoma','sooners','ou']],
    'ohiostate-texas':       [['ohiostate','osu'],['texas','longhorns','tex']],
    'boisestate-memphis':    [['memphis','mem'],['boisestate','boisest','bois']],
    'iowastate-iowa':        [['iowastate','isu'],['iowahawkeyes','iowa']]
  };

  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');

  const exactEvents = [];
  for (const [leagueKey, league] of Object.entries(D.leagues || {})) {
    for (const week of league.weeks || []) {
      if (week.archived) continue;
      for (const ticket of week.tickets || []) {
        for (const leg of ticket.legs || []) {
          if (!leg.espnEventId) continue;
          const id = String(leg.espnEventId);
          if (!exactEvents.some(x => x.id === id && x.leagueKey === leagueKey)) {
            exactEvents.push({
              id,
              leagueKey,
              espnPath: league.espnPath,
              gameKey: leg.gameKey,
              team: leg.team,
              opponent: leg.opponent,
              teamHome: typeof leg.teamHome === 'boolean' ? leg.teamHome : null
            });
          }
        }
      }
    }
  }

  if (!exactEvents.length) return;

  function rawTeamStrings(team) {
    return [team?.name,team?.short,team?.abbr].map(norm).filter(Boolean);
  }

  function matchesAny(team, keys) {
    const vals = rawTeamStrings(team);
    return vals.some(v => (keys || []).some(k => v === k || v.includes(k) || k.includes(v)));
  }

  function validateIdentity(ev,item) {
    const keys = identityKeys[item.gameKey];
    if (!keys || !ev?.teams || ev.teams.length !== 2) return true;
    const teamHits = ev.teams.map((t,i)=>matchesAny(t,keys[0])?i:-1).filter(i=>i>=0);
    const oppHits = ev.teams.map((t,i)=>matchesAny(t,keys[1])?i:-1).filter(i=>i>=0);
    return teamHits.some(i=>oppHits.some(j=>i!==j));
  }

  function alignNames(ev,item) {
    if (!ev?.teams || ev.teams.length !== 2) return ev;
    let ti = -1, oi = -1;

    if (typeof item.teamHome === 'boolean') {
      ti = ev.teams.findIndex(t => t.home === item.teamHome);
      oi = ev.teams.findIndex(t => t.home !== item.teamHome);
    }

    if (ti < 0 || oi < 0 || ti === oi) {
      const keys = identityKeys[item.gameKey];
      if (keys) {
        ti = ev.teams.findIndex(t => matchesAny(t,keys[0]));
        oi = ev.teams.findIndex((t,i) => i !== ti && matchesAny(t,keys[1]));
      }
    }

    if (ti >= 0 && oi >= 0 && ti !== oi) {
      ev.teams[ti].name = item.team;
      ev.teams[ti].short = item.team;
      ev.teams[oi].name = item.opponent;
      ev.teams[oi].short = item.opponent;
    }
    return ev;
  }

  function mergeEvent(leagueKey, ev) {
    if (!ev || !ev.id) return false;
    ev._directEventFeed = true;
    const list = B.state.scores[leagueKey] || (B.state.scores[leagueKey] = []);
    const idx = list.findIndex(x => String(x.id) === String(ev.id));
    if (idx >= 0) list[idx] = ev;
    else list.push(ev);
    return true;
  }

  async function fetchOne(item) {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/${item.espnPath}/summary?event=${encodeURIComponent(item.id)}&_=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`ESPN event ${item.id}: ${res.status}`);
    const json = await res.json();
    const header = json && json.header;
    if (!header) throw new Error(`ESPN event ${item.id}: no header`);
    const ev = B.extractEvent(header);
    if (!ev) throw new Error(`ESPN event ${item.id}: unreadable header`);

    const comp = header.competitions?.[0];
    ev.date = ev.date || comp?.date || comp?.startDate || header.date || null;

    if (!validateIdentity(ev,item)) {
      throw new Error(`ESPN event ${item.id}: participant identity mismatch for ${item.gameKey}`);
    }

    alignNames(ev,item);
    return { item, ev };
  }

  async function refreshExactEvents(options = {}) {
    const { render = true, updateStatus = true } = options;
    const results = await Promise.allSettled(exactEvents.map(fetchOne));
    let updated = 0;
    let failed = 0;
    for (const r of results) {
      if (r.status !== 'fulfilled') { failed++; continue; }
      if (mergeEvent(r.value.item.leagueKey, r.value.ev)) updated++;
    }

    if (updated && typeof B.persistScoreCache === 'function') B.persistScoreCache();
    if (updateStatus) {
      const status = document.querySelector('#feedStatus');
      const dot = document.querySelector('#liveDot');
      if (updated && status) status.textContent = `Public score feed connected · ${updated} direct game feed${updated === 1 ? '' : 's'}${failed ? ` · ${failed} rejected` : ''}`;
      if (updated && dot) dot.classList.add('live');
    }
    if (updated && render && typeof B.renderAll === 'function') B.renderAll();
    return updated;
  }

  B.refreshExactEvents = refreshExactEvents;

  refreshExactEvents();
  setTimeout(() => refreshExactEvents(), 1200);
  setInterval(() => refreshExactEvents(), 30000);
})();