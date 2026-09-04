(() => {
  const B = window.BT;
  if (!B) return;
  const {DATA, unit, cap, $, esc, money, unitFmt, pct, ticketSnapshot, leagueStats, weekStats, gameExposure, allTickets, weekState} = B;

  const pnlClass = v => v > 0 ? 'pos' : v < 0 ? 'neg' : 'neu';
  const metric = (label, value, cls='neu') => `<div class="metric"><div class="v ${cls}">${value}</div><div class="k">${label}</div></div>`;
  const americanToDecimal = odds => { const n=Number(String(odds??'').replace('+','')); if(!Number.isFinite(n)||n===0)return null; return n>0?1+n/100:1+100/Math.abs(n); };
  const decimalToAmerican = dec => { if(!Number.isFinite(dec)||dec<=1)return '—'; const a=dec>=2?Math.round((dec-1)*100):Math.round(-100/(dec-1)); return `${a>0?'+':''}${a}`; };

  function activeWeekFor(key){
    const league=DATA.leagues[key];
    return league.weeks.find(w=>!w.archived) || league.weeks.at(-1) || null;
  }

  function bookedTickets(key, week=null){
    const src=week?(week.tickets||[]):allTickets(DATA.leagues[key]);
    return src.filter(t=>t.booked);
  }

  function seasonPulseV16(){
    const rows=Object.keys(DATA.leagues).map(key=>{
      const stats=leagueStats(key), tickets=bookedTickets(key), settled=stats.settledRisk>0;
      const decs=tickets.map(t=>americanToDecimal(t.odds)).filter(Boolean);
      const avgOdds=decs.length?decimalToAmerican(decs.reduce((a,b)=>a+b,0)/decs.length):'—';
      const avgRisk=tickets.length?tickets.reduce((a,t)=>a+Number(t.risk||0),0)/tickets.length:0;
      const parlays=tickets.filter(t=>['Parlay','Teaser'].includes(t.betTypeGroup)).length;
      const straight=tickets.length-parlays;
      const games=gameExposure(key), largest=games[0];
      const settledSnaps=stats.snaps.filter(x=>['win','loss','push'].includes(x.s.status));
      const decisions=settledSnaps.filter(x=>['win','loss'].includes(x.s.result));
      const hit=decisions.length?100*decisions.filter(x=>x.s.result==='win').length/decisions.length:null;
      const realizedPnl=settledSnaps.reduce((a,x)=>a+Number(x.s.pnl||0),0);
      const avgPnl=settledSnaps.length?realizedPnl/settledSnaps.length:null;
      return `<div class="pulse-league">
        <div class="pulse-name">${esc(DATA.leagues[key].label)}</div>
        <div class="pulse-metrics v16-pulse">
          ${metric(settled?'Settled Bets':'Booked Bets', String(settled?settledSnaps.length:tickets.length))}
          ${metric(settled?'Hit Rate':'Avg Odds', settled?(hit==null?'—':pct(hit)):avgOdds, settled&&hit>=55?'pos':'neu')}
          ${metric('Avg Stake', tickets.length?unitFmt(avgRisk):'—')}
          ${metric(settled?'Avg P/L / Bet':'Bet Mix', settled?(avgPnl==null?'—':unitFmt(avgPnl)):`${straight} straight / ${parlays} multi`, settled?pnlClass(avgPnl||0):'neu')}
          ${metric('Games Exposed', String(games.length))}
          ${metric('Largest Game Touch', largest?unitFmt(largest.risk):'—')}
        </div>
      </div>`;
    }).join('');
    $('#performancePulse').innerHTML=`<div class="panel performance-pulse compact-pulse"><div class="section-title"><h2>Season Pulse</h2><div class="hint">Before results settle, this shows card construction and risk shape; afterward it shifts toward realized performance.</div></div>${rows}</div>`;
  }

  function collectGameBoard(){
    const map=new Map();
    Object.entries(DATA.leagues).forEach(([key,league])=>{
      const week=activeWeekFor(key); if(!week) return;
      (week.tickets||[]).filter(t=>t.booked).forEach(t=>{
        const snap=ticketSnapshot(t,key);
        (t.legs||[]).forEach((leg,i)=>{
          const ls=snap.legs?.[i];
          if(!ls || !ls.event || ls.event.status==='final') return;
          const g=map.get(`${key}:${leg.gameKey}`)||{key,gameKey:leg.gameKey,team:leg.team,opponent:leg.opponent,date:ls.event.date,status:ls.event.status,detail:ls.event.detail||'',risk:0,tickets:new Map(),angles:[]};
          if(!g.tickets.has(t.id)){g.risk+=Number(t.risk||0);g.tickets.set(t.id,t)}
          const angle=leg.betType==='spread'?`${leg.team} ${Number(leg.line)>0?'+':''}${leg.line}`:leg.betType==='moneyline'?`${leg.team} ML`:`${String(leg.direction).toUpperCase()} ${leg.line}`;
          if(!g.angles.some(a=>a.id===t.id&&a.angle===angle)) g.angles.push({id:t.id,category:t.category,angle});
          if(ls.event.date)g.date=ls.event.date;
          if(ls.event.status==='live')g.status='live';
          g.detail=ls.event.detail||g.detail;
          map.set(`${key}:${leg.gameKey}`,g);
        });
      });
    });
    return [...map.values()].sort((a,b)=>{
      if(a.status==='live'&&b.status!=='live')return -1;if(b.status==='live'&&a.status!=='live')return 1;
      return new Date(a.date||'2999-12-31')-new Date(b.date||'2999-12-31');
    });
  }

  function renderNextUp(){
    const board=collectGameBoard().filter(g=>g.status!=='live').slice(0,5);
    if(!board.length){$('#nextUp').innerHTML='';return}
    $('#nextUp').innerHTML=`<div class="panel nextup-panel"><div class="section-title"><h2>⏱ Next Up</h2><div class="hint">Next wagered games by kickoff · PT</div></div><div class="nextup-grid">${board.map((g,i)=>`
      <article class="nextup-card ${i===0?'primary-next':''}">
        <div class="nextup-time">${i===0?'NEXT · ':''}${esc(B.formatTime(g.date))}</div>
        <div class="nextup-game">${esc(g.team)} vs ${esc(g.opponent)}</div>
        <div class="nextup-touch">${unitFmt(g.risk)} ticket risk touched · ${g.tickets.size} ticket${g.tickets.size===1?'':'s'}</div>
        <div class="nextup-angles">${g.angles.slice(0,4).map(a=>`<span><strong>${esc(a.category)}</strong> · ${esc(a.angle)}</span>`).join('')}${g.angles.length>4?`<span>+${g.angles.length-4} more angle${g.angles.length-4===1?'':'s'}</span>`:''}</div>
      </article>`).join('')}</div></div>`;
  }

  function renderScenarios(){
    const cards=Object.keys(DATA.leagues).map(key=>{
      const week=activeWeekFor(key); if(!week) return '';
      const ws=weekStats(key,week), open=ws.snaps.filter(x=>['open','live'].includes(x.s.status));
      const openRisk=open.reduce((a,x)=>a+Number(x.t.risk||0),0), upside=open.reduce((a,x)=>a+Number(x.t.toWin||0),0);
      const floor=ws.pnl-openRisk, ceiling=ws.pnl+upside, capRemain=Math.max(0,cap*unit-ws.risk);
      return `<div class="scenario-card"><div class="scenario-head"><strong>${esc(DATA.leagues[key].label)} · ${esc(week.label)}</strong><span>${unitFmt(ws.risk)} / ${cap.toFixed(0)}u cap</span></div><div class="scenario-grid">${metric('Realized P/L',unitFmt(ws.pnl),pnlClass(ws.pnl))}${metric('If Open All Lose',unitFmt(floor),pnlClass(floor))}${metric('If Open All Win',unitFmt(ceiling),pnlClass(ceiling))}${metric('Weekly Cap Left',unitFmt(capRemain))}</div><div class="scenario-note">Open-ticket scenario only. Review tickets with unresolved book rules are excluded from the floor/ceiling.</div></div>`;
    }).join('');
    $('#gameDayScenarios').innerHTML=`<div class="panel scenario-panel"><div class="section-title"><h2>Game-Day Range</h2><div class="hint">10u is the weekly risk cap, not a bankroll assumption.</div></div><div class="scenario-cards">${cards}</div></div>`;
  }

  function renderExposureV16(){
    const html=Object.keys(DATA.leagues).map(key=>{
      const rows=gameExposure(key), max=Math.max(1,...rows.map(r=>r.risk)), leagueRisk=Math.max(1,leagueStats(key).risk), top=rows.slice(0,5), rest=rows.slice(5);
      const rowHtml=r=>`<div class="exposure-row"><div><div class="exposure-name">${esc(r.name)}</div><div class="exposure-meta">${r.tickets} ticket${r.tickets===1?'':'s'} · ${pct(100*r.risk/leagueRisk)} of ticket risk touched</div></div><div class="exposure-bar"><span style="width:${Math.max(4,100*r.risk/max)}%"></span></div><div class="exposure-amt">${unitFmt(r.risk)}</div></div>`;
      return `<div class="panel exposure-panel"><div class="section-title"><h3>${esc(key)} Game Exposure</h3><div class="hint">Ticket risk touched; multi-leg tickets can make percentages total above 100%.</div></div>${rows.length?`<div class="exposure-list">${top.map(rowHtml).join('')}</div>${rest.length?`<details class="exposure-more"><summary>Show ${rest.length} more game${rest.length===1?'':'s'}</summary><div class="exposure-list extra-exposure">${rest.map(rowHtml).join('')}</div></details>`:''}`:`<div class="empty">No booked wagers yet.</div>`}</div>`;
    }).join('');
    $('#exposurePanels').innerHTML=`<div class="exposure-wrap">${html}</div>`;
  }

  function replaceProfitLabels(){
    document.querySelectorAll('.metric .k,.week-strip .label').forEach(el=>{
      const txt=el.textContent.trim();
      if(txt==='Profit Still Alive'||txt==='Profit Alive')el.textContent='Max Profit Alive';
    });
  }

  function weekRecap(key,week){
    const ws=weekStats(key,week), settled=ws.snaps.filter(x=>['win','loss','push'].includes(x.s.status));
    if(!settled.length)return null;
    const wins=settled.filter(x=>x.s.pnl>0).sort((a,b)=>b.s.pnl-a.s.pnl), losses=settled.filter(x=>x.s.pnl<0).sort((a,b)=>a.s.pnl-b.s.pnl);
    const cat=new Map();settled.forEach(x=>{const g=cat.get(x.t.category)||{name:x.t.category,pnl:0,risk:0};g.pnl+=Number(x.s.pnl||0);g.risk+=Number(x.t.risk||0);cat.set(x.t.category,g)});
    const bestCat=[...cat.values()].sort((a,b)=>b.pnl-a.pnl)[0]||null;
    const clvVals=[];(week.tickets||[]).filter(t=>t.booked&&t.closingLine!=null&&(t.legs||[]).length===1).forEach(t=>{const l=t.legs[0];if(!['spread','total'].includes(l.betType))return;const b=Number(l.line),c=Number(t.closingLine);if(!Number.isFinite(b)||!Number.isFinite(c))return;clvVals.push(l.betType==='spread'?b-c:(l.direction==='under'?b-c:c-b));});
    const avgClv=clvVals.length?clvVals.reduce((a,b)=>a+b,0)/clvVals.length:null;
    return {ws,bigWin:wins[0],bigLoss:losses[0],bestCat,avgClv,biggestSweat:week.recap?.biggestSweat||null};
  }

  function renderWeekRecaps(){
    const recaps=[];
    Object.entries(DATA.leagues).forEach(([key,league])=>league.weeks.forEach(week=>{
      const stateName=weekState(key,week);if(!['Ready to archive','Archived'].includes(stateName))return;
      const r=weekRecap(key,week);if(r)recaps.push({key,week,r});
    }));
    if(!recaps.length){$('#weekRecaps').innerHTML='';return}
    $('#weekRecaps').innerHTML=`<div class="panel recap-panel"><div class="section-title"><h2>Weekly Recaps</h2><div class="hint">Permanent post-week snapshot</div></div><div class="recap-grid">${recaps.map(({key,week,r})=>`<article class="recap-card"><div class="recap-title">${esc(key)} · ${esc(week.label)}</div><div class="recap-metrics">${metric('Record',r.ws.rec.text)}${metric('P/L',unitFmt(r.ws.pnl),pnlClass(r.ws.pnl))}${metric('ROI',pct(r.ws.roi),pnlClass(r.ws.pnl))}${metric('Avg CLV',r.avgClv==null?'—':`${r.avgClv>0?'+':''}${r.avgClv.toFixed(1)}`,r.avgClv==null?'neu':pnlClass(r.avgClv))}</div><div class="recap-notes"><div><span>Best win</span><strong>${r.bigWin?`${esc(r.bigWin.t.category)} · ${money(r.bigWin.s.pnl)}`:'—'}</strong></div><div><span>Worst loss</span><strong>${r.bigLoss?`${esc(r.bigLoss.t.category)} · ${money(r.bigLoss.s.pnl)}`:'—'}</strong></div><div><span>Best category</span><strong>${r.bestCat?`${esc(r.bestCat.name)} · ${unitFmt(r.bestCat.pnl)}`:'—'}</strong></div><div><span>Biggest sweat</span><strong>${r.biggestSweat?esc(r.biggestSweat):'Add after the week if there was one worth remembering'}</strong></div></div></article>`).join('')}</div></div>`;
  }

  const baseRender=B.renderDashboard;
  B.renderDashboard=()=>{
    baseRender();
    seasonPulseV16();
    renderNextUp();
    renderScenarios();
    renderExposureV16();
    renderWeekRecaps();
    replaceProfitLabels();
  };
})();
