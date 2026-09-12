(() => {
  const B = window.BT;
  const D = window.BET_TRACKER_DATA;
  if (!B || !D) return;

  const exactEvents = [];
  for (const [leagueKey, league] of Object.entries(D.leagues || {})) {
    for (const week of league.weeks || []) {
      if (week.archived) continue;
      for (const ticket of week.tickets || []) {
        for (const leg of ticket.legs || []) {
          if (!leg.espnEventId) continue;
          const id = String(leg.espnEventId);
          if (!exactEvents.some(x => x.id === id && x.leagueKey === leagueKey)) {
            exactEvents.push({ id, leagueKey, espnPath: league.espnPath });
          }
        }
      }
    }
  }

  if (!exactEvents.length) return;

  function mergeEvent(leagueKey, ev) {
    if (!ev || !ev.id) return false;
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
    return { item, ev };
  }

  async function refreshExactEvents() {
    const results = await Promise.allSettled(exactEvents.map(fetchOne));
    let updated = 0;
    for (const r of results) {
      if (r.status !== 'fulfilled') continue;
      if (mergeEvent(r.value.item.leagueKey, r.value.ev)) updated++;
    }

    if (updated) {
      const status = document.querySelector('#feedStatus');
      if (status) status.textContent = `Public score feed connected · ${updated} direct game feed${updated === 1 ? '' : 's'}`;
      const dot = document.querySelector('#liveDot');
      if (dot) dot.classList.add('live');
      if (typeof B.renderAll === 'function') B.renderAll();
    }
  }

  // Run shortly after the normal scoreboard refresh, then keep exact event IDs fresh.
  setTimeout(refreshExactEvents, 800);
  setInterval(refreshExactEvents, 30000);
})();
