(() => {
  const B=window.BT;if(!B)return;
  const {DATA,CFG,state,$,esc,ymd,formatStamp,extractEvent,weekStats,leagueStats,performanceStats,clvStats,ticketSnapshot,uniqueGames}=B;
  function renderManual(){
    const rows=uniqueGames().map(g=>{const cur=state.overrides[g.gameKey]||{};return`<div class="override-grid" data-game="${esc(g.gameKey)}"><div><strong>${esc(g.team)} vs ${esc(g.opponent)}</strong><div class="small">${esc(g.leagueKey)} · ESPN ${esc(g.espnEventId||'fallback')}</div></div><input type="number" inputmode="numeric" data-field="teamScore" value="${cur.teams?.[0]?.score??''}" placeholder="${esc(g.team)}"><input type="number" inputmode="numeric" data-field="oppScore" value="${cur.teams?.[1]?.score??''}" placeholder="${esc(g.opponent)}"><select data-field="status"><option value="">No override</option><option value="scheduled" ${cur.status==='scheduled'?'selected':''}>Scheduled</option><option value="live" ${cur.status==='live'?'selected':''}>Live</option><option value="final" ${cur.status==='final'?'selected':''}>Final</option></select></div>`}).join('');
    $('#overrideRows').innerHTML=rows||'<div class="empty">No games loaded.</div>';
  }
  function saveOverrides(){
    const next={...state.overrides};document.querySelectorAll('.override-grid').forEach(row=>{const gameKey=row.dataset.game,status=row.querySelector('[data-field="status"]').value;if(!status){delete next[gameKey];return}const game=uniqueGames().find(g=>g.gameKey===gameKey);const a=Number(row.querySelector('[data-field="teamScore"]').value||0),b=Number(row.querySelector('[data-field="oppScore"]').value||0);next[gameKey]={id:`manual-${gameKey}`,status,detail:'Manual override',date:null,teams:[{name:game.team,short:game.team,abbr:game.team,score:a,home:false},{name:game.opponent,short:game.opponent,abbr:game.opponent,score:b,home:true}]}});
    state.overrides=next;localStorage.setItem('football-score-overrides',JSON.stringify(next));$('#manualDialog').close();renderAll();
  }
  function clearOverrides(){state.overrides={};localStorage.removeItem('football-score-overrides');renderManual();renderAll()}
  async function fetchLeagueScores(key,league){
    const active=league.weeks.filter(w=>!w.archived&&w.dateStart&&w.dateEnd),weeks=active.length?active:(league.weeks.length?[league.weeks.at(-1)]:[]);if(!weeks.length){state.scores[key]=[];return}
    const extra=key==='NCAA'?'&groups=80&limit=1000':'&limit=100';
    const batches=await Promise.all(weeks.map(async w=>{const url=`https://site.api.espn.com/apis/site/v2/sports/football/${league.espnPath}/scoreboard?dates=${ymd(w.dateStart)}-${ymd(w.dateEnd)}${extra}`;const res=await fetch(url,{cache:'no-store'});if(!res.ok)throw new Error(`${key} ${res.status}`);const json=await res.json();return(json.events||[]).map(extractEvent).filter(Boolean)}));
    const dedup=new Map();batches.flat().forEach(ev=>dedup.set(String(ev.id),ev));state.scores[key]=[...dedup.values()];
  }
  async function refreshScores(){
    $('#feedStatus').textContent='Refreshing public scores…';$('#liveDot').classList.remove('live');const results=await Promise.allSettled(Object.entries(DATA.leagues).map(([k,l])=>fetchLeagueScores(k,l))),failed=results.filter(x=>x.status==='rejected');state.lastRefresh=new Date();$('#lastRefresh').textContent=`Last refresh: ${formatStamp(state.lastRefresh.toISOString())}`;
    if(failed.length)$('#feedStatus').textContent=`Score feed partially available (${failed.length} league${failed.length>1?'s':''} failed)`;else{$('#feedStatus').textContent='Public score feed connected';$('#liveDot').classList.add('live')}
    renderAll();
  }
  function exportResults(){
    const payload={exportedAt:new Date().toISOString(),build:CFG.build,summary:{},leagues:{}};
    Object.entries(DATA.leagues).forEach(([key,league])=>{payload.summary[key]={league:leagueStats(key),performance:performanceStats(key),clv:clvStats(key)};payload.leagues[key]=league.weeks.map(w=>({week:w.week,label:w.label,state:B.weekState(key,w),stats:weekStats(key,w),tickets:(w.tickets||[]).map(t=>({id:t.id,category:t.category,betTypeGroup:t.betTypeGroup,description:t.description,risk:t.risk,toWin:t.toWin,odds:t.odds,closingLine:t.closingLine,closingOdds:t.closingOdds,snapshot:ticketSnapshot(t,key)}))}))});
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`football-betting-results-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  function renderAll(){B.renderDashboard();B.renderAnalytics();$('#siteUpdated').textContent=`Site updated: ${formatStamp(CFG.lastSiteUpdate)}`}
  B.renderAll=renderAll;
  $('#refreshBtn').addEventListener('click',refreshScores);$('#manualBtn').addEventListener('click',()=>{renderManual();$('#manualDialog').showModal()});$('#closeManual').addEventListener('click',()=>$('#manualDialog').close());$('#saveOverrides').addEventListener('click',saveOverrides);$('#clearOverrides').addEventListener('click',clearOverrides);$('#exportBtn').addEventListener('click',exportResults);
  renderAll();refreshScores();setInterval(refreshScores,Math.max(30,Number(CFG.refreshSeconds)||60)*1000);
})();
