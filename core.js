(() => {
  const DATA = window.BET_TRACKER_DATA;
  if (!DATA) return;
  const CFG = DATA.config;
  const unit = CFG.unitDollars;
  const cap = CFG.weeklyCapUnits;
  const state = {
    scores: {},
    overrides: JSON.parse(localStorage.getItem('football-score-overrides') || '{}'),
    selectedWeeks: {},
    filters: { NCAA: 'all', NFL: 'all' },
    lastRefresh: null
  };

  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => `${n < 0 ? '-' : ''}$${Math.abs(Number(n)||0).toLocaleString(undefined,{maximumFractionDigits:0})}`;
  const unitFmt = n => `${((Number(n)||0)/unit).toFixed(2)}u`;
  const pct = n => `${(Number(n)||0).toFixed(1)}%`;
  const signed = n => `${n > 0 ? '+' : ''}${Number(n).toFixed(1)}`;
  const ymd = s => String(s).replaceAll('-','');
  const normalize = s => String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
  const aliases = {
    'san jose state':['sanjosestate','sanjosest','sjsu'], 'eastern michigan':['easternmichigan','emichigan','emu'],
    'washington state':['washingtonstate','washingtonst','wsu'], 'washington':['washington','wash','uw'],
    'western michigan':['westernmichigan','wmichigan','wmu'], 'michigan':['michigan','mich'],
    'western kentucky':['westernkentucky','westernky','wku'], 'florida atlantic':['floridaatlantic','fau'],
    'michigan state':['michiganstate','michiganst','msu'], 'colorado state':['coloradostate','coloradost','csu'],
    'east carolina':['eastcarolina','ecu'], 'notre dame':['notredame','nd'], 'oklahoma state':['oklahomastate','oklahomast','okstate','okst'],
    'tulane':['tulane','tuln'], 'duke':['duke'], 'alabama':['alabama','ala'], 'auburn':['auburn','aub'],
    'baylor':['baylor','bay'], 'wisconsin':['wisconsin','wis'], 'wyoming':['wyoming','wyo'], 'toledo':['toledo','tol'],
    'nevada':['nevada','nev'], 'tulsa':['tulsa','tlsa'], 'florida':['florida','fla']
  };
  const variantsFor = input => {
    const key=String(input||'').toLowerCase();
    return [...new Set([normalize(input),...(aliases[key]||[]).map(normalize)].filter(Boolean))];
  };
  const exactTeamMatch = (input,candidate) => variantsFor(input).includes(normalize(candidate));

  function formatTime(iso){
    if(!iso) return 'TBD';
    try{return new Intl.DateTimeFormat('en-US',{timeZone:CFG.timezone,weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true}).format(new Date(iso))+` ${CFG.timezoneLabel}`}catch{return'TBD'}
  }
  function formatStamp(iso){
    if(!iso) return '—';
    try{return new Intl.DateTimeFormat('en-US',{timeZone:CFG.timezone,month:'short',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true}).format(new Date(iso))+` ${CFG.timezoneLabel}`}catch{return'—'}
  }
  function extractEvent(ev){
    const comp=ev?.competitions?.[0]; if(!comp) return null;
    const teams=(comp.competitors||[]).map(c=>({name:c.team?.displayName||c.team?.shortDisplayName||'',short:c.team?.shortDisplayName||'',abbr:c.team?.abbreviation||'',score:Number(c.score||0),home:c.homeAway==='home'}));
    if(teams.length<2) return null;
    const st=comp.status?.type||ev.status?.type||{};
    return {id:String(ev.id||''),name:ev.name||'',teams,status:st.completed?'final':(st.state==='in'?'live':'scheduled'),detail:st.shortDetail||st.detail||'',date:ev.date};
  }
  function eventMatchesLeg(ev,leg){
    if(!ev||!leg)return false;
    if(leg.espnEventId&&String(ev.id)===String(leg.espnEventId))return true;
    const hits=name=>ev.teams.map((t,i)=>({i,ok:[t.name,t.short,t.abbr].some(v=>exactTeamMatch(name,v))})).filter(x=>x.ok);
    const a=hits(leg.team),b=hits(leg.opponent);
    return a.length===1&&b.length===1&&a[0].i!==b[0].i;
  }
  function findScore(leg,leagueKey){
    const override=state.overrides[leg.gameKey]; if(override)return override;
    const events=state.scores[leagueKey]||[];
    if(leg.espnEventId){const byId=events.find(ev=>String(ev.id)===String(leg.espnEventId));if(byId)return byId}
    return events.find(ev=>eventMatchesLeg(ev,leg))||null;
  }
  function teamIndex(ev,name){
    if(!ev?.teams)return-1;
    const matches=ev.teams.map((t,i)=>({i,ok:[t.name,t.short,t.abbr].some(v=>exactTeamMatch(name,v))})).filter(x=>x.ok);
    return matches.length===1?matches[0].i:-1;
  }
  function legSnapshot(leg,leagueKey){
    const ev=findScore(leg,leagueKey);
    if(!ev)return{status:'open',label:'Awaiting score',event:null,edge:null,scoreText:'No score yet'};
    const ti=teamIndex(ev,leg.team),oi=teamIndex(ev,leg.opponent);
    if(ti<0||oi<0||ti===oi)return{status:'open',label:'Awaiting matchup',event:ev,edge:null,scoreText:ev.detail||'Scheduled'};
    const ts=ev.teams[ti].score,os=ev.teams[oi].score,total=ts+os;let edge=0;
    if(leg.betType==='spread')edge=ts+Number(leg.line||0)-os;
    else if(leg.betType==='moneyline')edge=ts-os;
    else if(leg.betType==='total')edge=leg.direction==='under'?Number(leg.line)-total:total-Number(leg.line);
    const scoreText=`${ev.teams[ti].abbr||leg.team} ${ts} · ${ev.teams[oi].abbr||leg.opponent} ${os}${ev.detail?' · '+ev.detail:''}`;
    if(ev.status==='scheduled')return{status:'open',label:formatTime(ev.date),event:ev,edge:null,scoreText};
    if(ev.status==='live'){
      const label=edge>0?`Winning by ${Math.abs(edge).toFixed(edge%1?1:0)}`:edge<0?`Behind by ${Math.abs(edge).toFixed(Math.abs(edge)%1?1:0)}`:'Currently push';
      return{status:'live',label,event:ev,edge,scoreText};
    }
    const result=edge>0?'win':edge<0?'loss':'push';
    return{status:result,label:result.toUpperCase(),event:ev,edge,scoreText};
  }
  function ticketSnapshot(ticket,leagueKey){
    if(ticket.pass)return{status:'pass',result:'pass',pnl:0,legs:[],detail:'Intentional pass'};
    if(!ticket.booked)return{status:'planned',result:null,pnl:0,legs:[],detail:'Not booked yet'};
    if(ticket.result){
      const result=String(ticket.result).toLowerCase();
      const pnl=Number.isFinite(Number(ticket.pnl))?Number(ticket.pnl):(result==='win'?ticket.toWin:result==='loss'?-ticket.risk:0);
      return{status:result,result,pnl,legs:[],detail:'Archived result'};
    }
    const legs=(ticket.legs||[]).map(l=>legSnapshot(l,leagueKey));
    if(!legs.length)return{status:'open',result:null,pnl:0,legs,detail:'Awaiting wager details'};
    if(legs.some(l=>l.status==='loss'))return{status:'loss',result:'loss',pnl:-ticket.risk,legs,detail:'Ticket lost'};
    if(legs.every(l=>['win','push'].includes(l.status))){
      const pushes=legs.filter(l=>l.status==='push').length;
      if(legs.length===1){const result=pushes?'push':'win';return{status:result,result,pnl:result==='win'?ticket.toWin:0,legs,detail:result==='win'?'Ticket won':'Push'}}
      if(pushes){
        if(ticket.pushPolicy==='push-ticket')return{status:'push',result:'push',pnl:0,legs,detail:'Ticket push by configured book rule'};
        return{status:'review',result:null,pnl:0,legs,detail:'Push leg — confirm BetWCS reduced-payout / teaser rule before settlement'};
      }
      return{status:'win',result:'win',pnl:ticket.toWin,legs,detail:'Ticket won'};
    }
    if(legs.some(l=>l.status==='live'))return{status:'live',result:null,pnl:0,legs,detail:'Live'};
    return{status:'open',result:null,pnl:0,legs,detail:'Upcoming'};
  }
  function allTickets(league){return league.weeks.flatMap(w=>(w.tickets||[]).map(t=>({...t,week:w.week,weekLabel:w.label,weekObj:w})))}
  function recordFrom(snaps){
    let w=0,l=0,p=0;snaps.forEach(s=>{if(s.result==='win')w++;else if(s.result==='loss')l++;else if(s.result==='push')p++});
    return{w,l,p,decisions:w+l,text:`${w}-${l}${p?'-'+p:''}`,hitRate:(w+l)?100*w/(w+l):0};
  }
  function leagueStats(key){
    const booked=allTickets(DATA.leagues[key]).filter(t=>t.booked),snaps=booked.map(t=>({t,s:ticketSnapshot(t,key)})),risk=booked.reduce((a,t)=>a+Number(t.risk||0),0),settled=snaps.filter(x=>['win','loss','push'].includes(x.s.status)),settledRisk=settled.reduce((a,x)=>a+Number(x.t.risk||0),0),pnl=settled.reduce((a,x)=>a+Number(x.s.pnl||0),0),openRisk=snaps.filter(x=>['open','live'].includes(x.s.status)).reduce((a,x)=>a+Number(x.t.risk||0),0),reviewRisk=snaps.filter(x=>x.s.status==='review').reduce((a,x)=>a+Number(x.t.risk||0),0),potential=snaps.filter(x=>['open','live'].includes(x.s.status)).reduce((a,x)=>a+Number(x.t.toWin||0),0),rec=recordFrom(snaps.map(x=>x.s));
    return{risk,settledRisk,pnl,openRisk,reviewRisk,potential,rec,roi:settledRisk?100*pnl/settledRisk:0,hitRate:rec.hitRate,settledCount:settled.length,snaps};
  }
  function weekStats(key,week){
    const tickets=(week.tickets||[]).filter(t=>t.booked),snaps=tickets.map(t=>({t,s:ticketSnapshot(t,key)})),risk=tickets.reduce((a,t)=>a+Number(t.risk||0),0),settled=snaps.filter(x=>['win','loss','push'].includes(x.s.status)),settledRisk=settled.reduce((a,x)=>a+Number(x.t.risk||0),0),openRisk=snaps.filter(x=>['open','live'].includes(x.s.status)).reduce((a,x)=>a+Number(x.t.risk||0),0),reviewRisk=snaps.filter(x=>x.s.status==='review').reduce((a,x)=>a+Number(x.t.risk||0),0),potential=snaps.filter(x=>['open','live'].includes(x.s.status)).reduce((a,x)=>a+Number(x.t.toWin||0),0),pnl=settled.reduce((a,x)=>a+Number(x.s.pnl||0),0),rec=recordFrom(snaps.map(x=>x.s));
    return{tickets,snaps,risk,settledRisk,openRisk,reviewRisk,potential,pnl,rec,hitRate:rec.hitRate,roi:settledRisk?100*pnl/settledRisk:0};
  }
  function americanToDecimal(odds){const n=Number(String(odds??'').replace('+',''));if(!Number.isFinite(n)||n===0)return null;return n>0?1+n/100:1+100/Math.abs(n)}
  function decimalToAmerican(dec){if(!Number.isFinite(dec)||dec<=1)return'—';const a=dec>=2?Math.round((dec-1)*100):Math.round(-100/(dec-1));return`${a>0?'+':''}${a}`}
  function median(values){const a=values.filter(Number.isFinite).slice().sort((x,y)=>x-y);if(!a.length)return 0;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2}
  function settledSequence(key){return allTickets(DATA.leagues[key]).filter(t=>t.booked).map((t,i)=>({t,s:ticketSnapshot(t,key),i})).filter(x=>['win','loss','push'].includes(x.s.status))}
  function streakStats(key){
    const seq=settledSequence(key).filter(x=>['win','loss'].includes(x.s.result));let longestW=0,longestL=0,cw=0,cl=0;
    seq.forEach(x=>{if(x.s.result==='win'){cw++;cl=0;longestW=Math.max(longestW,cw)}else{cl++;cw=0;longestL=Math.max(longestL,cl)}});
    let current='—';if(seq.length){const r=seq.at(-1).s.result;let n=0;for(let i=seq.length-1;i>=0&&seq[i].s.result===r;i--)n++;current=`${r==='win'?'W':'L'}${n}`}
    return{current,longestW,longestL};
  }
  function equityStats(key){
    const seq=settledSequence(key);let equity=0,peak=0,maxDrawdown=0,low=0;const points=[0];
    seq.forEach(x=>{equity+=Number(x.s.pnl||0);peak=Math.max(peak,equity);maxDrawdown=Math.min(maxDrawdown,equity-peak);low=Math.min(low,equity);points.push(equity)});
    return{equity,peak,maxDrawdown,low,points};
  }
  function performanceStats(key){
    const seq=settledSequence(key),rec=recordFrom(seq.map(x=>x.s)),risk=seq.reduce((a,x)=>a+Number(x.t.risk||0),0),pnl=seq.reduce((a,x)=>a+Number(x.s.pnl||0),0),streak=streakStats(key),eq=equityStats(key);
    return{settled:seq.length,decisions:rec.decisions,hitRate:rec.hitRate,risk,pnl,roi:risk?100*pnl/risk:0,avgStake:seq.length?risk/seq.length:0,avgPnl:seq.length?pnl/seq.length:0,streak,eq};
  }
  const shapeName=t=>['Parlay','Teaser'].includes(t.betTypeGroup)?'Parlays / Teasers':'Straight Bets';
  function priceBand(ticket){
    const dec=americanToDecimal(ticket.odds);if(!dec)return'Unpriced';const n=Number(String(ticket.odds).replace('+',''));
    if(n<=-150)return'Heavy Juice (≤ -150)';if(n<0)return'Standard Juice (-149 to -101)';if(n<200)return'Short Plus (+100 to +199)';if(n<500)return'Longshot (+200 to +499)';return'Moonshot (+500+)';
  }
  function aggregateBy(key,field,customName){
    const groups=new Map();
    allTickets(DATA.leagues[key]).filter(t=>t.booked).forEach(t=>{
      const name=customName?customName(t):(t[field]||'Other'),s=ticketSnapshot(t,key),g=groups.get(name)||{name,risk:0,pnl:0,w:0,l:0,p:0,count:0,settled:0,oddsDec:[]};g.count++;
      const d=americanToDecimal(t.odds);if(d)g.oddsDec.push(d);
      if(['win','loss','push'].includes(s.status)){g.risk+=Number(t.risk||0);g.pnl+=Number(s.pnl||0);g.settled++;if(s.result==='win')g.w++;else if(s.result==='loss')g.l++;else if(s.result==='push')g.p++}
      groups.set(name,g);
    });
    return[...groups.values()].map(g=>({...g,decisions:g.w+g.l,hitRate:(g.w+g.l)?100*g.w/(g.w+g.l):0,roi:g.risk?100*g.pnl/g.risk:0,avgOdds:g.oddsDec.length?decimalToAmerican(g.oddsDec.reduce((a,b)=>a+b,0)/g.oddsDec.length):'—'})).sort((a,b)=>b.pnl-a.pnl);
  }
  function clvStats(key){
    const rows=[];
    allTickets(DATA.leagues[key]).filter(t=>t.booked&&t.closingLine!=null&&(t.legs||[]).length===1).forEach(t=>{
      const l=t.legs[0];if(!['spread','total'].includes(l.betType))return;const booked=Number(l.line),close=Number(t.closingLine);if(!Number.isFinite(booked)||!Number.isFinite(close))return;
      const value=l.betType==='spread'?booked-close:(l.direction==='under'?booked-close:close-booked),snap=ticketSnapshot(t,key);rows.push({value,result:snap.result,t});
    });
    const values=rows.map(x=>x.value),wins=rows.filter(x=>x.result==='win').map(x=>x.value),losses=rows.filter(x=>x.result==='loss').map(x=>x.value);
    return{count:values.length,avg:values.length?values.reduce((a,b)=>a+b,0)/values.length:0,median:median(values),beat:values.filter(v=>v>0).length,tied:values.filter(v=>v===0).length,lost:values.filter(v=>v<0).length,beatPct:values.length?100*values.filter(v=>v>0).length/values.length:0,best:values.length?Math.max(...values):0,worst:values.length?Math.min(...values):0,avgWin:wins.length?wins.reduce((a,b)=>a+b,0)/wins.length:null,avgLoss:losses.length?losses.reduce((a,b)=>a+b,0)/losses.length:null};
  }
  function weekState(key,week){
    if(week.archived)return'Archived';const s=weekStats(key,week),booked=s.snaps;
    if(booked.length&&booked.every(x=>['win','loss','push'].includes(x.s.status)))return'Ready to archive';
    if(booked.some(x=>x.s.status==='review'))return'Needs review';if(booked.some(x=>x.s.status==='live'))return'Live';return'Open';
  }
  function weeklySeries(key,league){
    let cumulative=0;
    return league.weeks.map(w=>{const s=weekStats(key,w);cumulative+=s.pnl;return{week:w.week,label:w.label,pnl:s.pnl,cumulative,risk:s.risk,settledRisk:s.settledRisk,roi:s.roi,hitRate:s.hitRate,record:s.rec.text,state:weekState(key,w)}}).map((x,i,a)=>({...x,delta:i?x.pnl-a[i-1].pnl:0}));
  }
  function seasonExtremes(key){
    const series=weeklySeries(key,DATA.leagues[key]).filter(x=>x.risk>0),best=series.length?[...series].sort((a,b)=>b.pnl-a.pnl)[0]:null,worst=series.length?[...series].sort((a,b)=>a.pnl-b.pnl)[0]:null,settled=settledSequence(key),bigWin=settled.filter(x=>x.s.pnl>0).sort((a,b)=>b.s.pnl-a.s.pnl)[0]||null,bigLoss=settled.filter(x=>x.s.pnl<0).sort((a,b)=>a.s.pnl-b.s.pnl)[0]||null,cats=aggregateBy(key,'category').filter(x=>x.settled),bestCat=cats[0]||null,worstCat=cats.length?[...cats].sort((a,b)=>a.pnl-b.pnl)[0]:null;
    return{best,worst,bigWin,bigLoss,bestCat,worstCat};
  }
  function gameExposure(key){
    const map=new Map();
    allTickets(DATA.leagues[key]).filter(t=>t.booked).forEach(t=>{const seen=new Set();(t.legs||[]).forEach(l=>{if(seen.has(l.gameKey))return;seen.add(l.gameKey);const g=map.get(l.gameKey)||{gameKey:l.gameKey,name:`${l.team} vs ${l.opponent}`,risk:0,tickets:0,eventId:l.espnEventId};g.risk+=Number(t.risk||0);g.tickets+=1;map.set(l.gameKey,g)})});
    return[...map.values()].sort((a,b)=>b.risk-a.risk);
  }
  function uniqueGames(){
    const map=new Map();Object.entries(DATA.leagues).forEach(([key,league])=>{allTickets(league).forEach(t=>(t.legs||[]).forEach(l=>{if(!map.has(l.gameKey))map.set(l.gameKey,{...l,leagueKey:key})}))});return[...map.values()];
  }

  window.BT={DATA,CFG,unit,cap,state,$,esc,money,unitFmt,pct,signed,ymd,formatTime,formatStamp,extractEvent,ticketSnapshot,allTickets,recordFrom,leagueStats,weekStats,performanceStats,shapeName,priceBand,aggregateBy,clvStats,weekState,weeklySeries,seasonExtremes,gameExposure,uniqueGames};
})();
