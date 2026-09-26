(() => {
  const B = window.BT;
  const D = window.BET_TRACKER_DATA;
  if (!B || !D) return;

  const nflWeek2 = D.leagues?.NFL?.weeks?.find(w => Number(w.week) === 2);
  if (!nflWeek2) return;

  const bindings = {
    'cin-hou':'401872934',
    'cle-tb':'401872935',
    'gb-nyj':'401872936',
    'min-chi':'401872937',
    'no-bal':'401872938',
    'phi-ten':'401872939',
    'jax-den':'401872940',
    'mia-sf':'401872942',
    'sea-ari':'401872943',
    'ind-kc':'401872945',
    'pit-ne':'401872946'
  };

  for (const ticket of nflWeek2.tickets || []) {
    for (const leg of ticket.legs || []) {
      const id = bindings[leg.gameKey];
      if (id) leg.espnEventId = id;
    }
  }

  const exactEvents = [...new Map(
    (nflWeek2.tickets || []).flatMap(t => (t.legs || []))
      .filter(l => l.espnEventId)
      .map(l => [String(l.espnEventId), {id:String(l.espnEventId), gameKey:l.gameKey}])
  ).values()];

  function mergeEvent(ev) {
    if (!ev?.id) return false;
    ev._directEventFeed = true;
    const list = B.state.scores.NFL || (B.state.scores.NFL = []);
    const idx = list.findIndex(x => String(x.id) === String(ev.id));
    if (idx >= 0) list[idx] = ev;
    else list.push(ev);
    return true;
  }

  async function fetchOne(item) {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${encodeURIComponent(item.id)}&_=${Date.now()}`;
    const res = await fetch(url, {cache:'no-store'});
    if (!res.ok) throw new Error(`NFL ${item.id}: ${res.status}`);
    const json = await res.json();
    const header = json?.header;
    if (!header) throw new Error(`NFL ${item.id}: no header`);
    const ev = B.extractEvent(header);
    if (!ev) throw new Error(`NFL ${item.id}: unreadable header`);
    const comp = header.competitions?.[0];
    ev.date = ev.date || comp?.date || comp?.startDate || header.date || null;
    return ev;
  }

  async function refreshExactEventsV2(options={}) {
    const {render=true, updateStatus=true} = options;
    const results = await Promise.allSettled(exactEvents.map(fetchOne));
    let updated = 0, failed = 0;
    for (const r of results) {
      if (r.status === 'fulfilled') {
        if (mergeEvent(r.value)) updated++;
      } else {
        failed++;
      }
    }

    if (updated && typeof B.persistScoreCache === 'function') B.persistScoreCache();
    if (updateStatus) {
      const status = document.querySelector('#feedStatus');
      const dot = document.querySelector('#liveDot');
      if (status) status.textContent = updated
        ? `Public score feed connected · ${updated} exact NFL game feed${updated===1?'':'s'}${failed?` · ${failed} failed`:''}`
        : `Exact NFL score feeds unavailable${failed?` · ${failed} failed`:''}`;
      if (updated && dot) dot.classList.add('live');
    }
    if (render && typeof B.renderAll === 'function') B.renderAll();
    return updated;
  }

  // Override the older exact-event refresher for boot/manual refreshes.
  B.refreshExactEvents = refreshExactEventsV2;

  setTimeout(() => refreshExactEventsV2(), 1500);
  setInterval(() => refreshExactEventsV2(), 20000);
})();