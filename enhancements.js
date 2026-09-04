(() => {
  const B=window.BT;if(!B)return;
  const {DATA,state,esc,ticketSnapshot,allTickets}=B;

  const baseExtract=B.extractEvent;
  B.extractEvent=ev=>{
    const out=baseExtract(ev);if(!out)return out;
    const comp=ev?.competitions?.[0]||{};
    const names=[
      ...(comp.broadcasts||[]).flatMap(b=>b?.names||[]),
      ...(comp.geoBroadcasts||[]).map(b=>b?.media?.shortName||b?.media?.callLetters||'')
    ].map(x=>String(x||'').trim()).filter(Boolean);
    out.broadcast=[...new Set(names)].join(' / ');
    return out;
  };

  function activeWeek(key){const l=DATA.leagues[key];return l.weeks.find(w=>!w.archived)||l.weeks.at(-1)||null}
  function selectedWeek(key){const l=DATA.leagues[key],n=Number(state.selectedWeeks[key]);return l.weeks.find(w=>w.week===n)||l.weeks.at(-1)||null}
  function legAngle(l){return l.betType==='spread'?`${l.team} ${Number(l.line)>0?'+':''}${l.line}`:l.betType==='moneyline'?`${l.team} ML`:`${String(l.direction||'').toUpperCase()} ${l.line}`}
  function statusLabel(s){return({live:'LIVE',win:'HIT',loss:'MISS',push:'PUSH',open:'UP NEXT'})[s]||String(s||'').toUpperCase()}
  function network(leg,snap){return leg?.network||leg?.tv||snap?.event?.broadcast||''}

  function visibleTickets(key,week){
    const f=state.filters[key]||'all';
    return (week?.tickets||[]).filter(t=>{
      if(f==='all')return true;const s=ticketSnapshot(t,key);
      if(f==='live')return s.status==='live';
      if(f==='upcoming')return ['open','planned'].includes(s.status);
      if(f==='settled')return ['win','loss','push','pass'].includes(s.status);
      if(f==='review')return s.status==='review';
      return true;
    });
  }

  function decorateLegNodes(nodes,t,key){
    const snap=ticketSnapshot(t,key);
    nodes.forEach((node,i)=>{
      const ls=snap.legs?.[i],status=ls?.status||'open';
      node.classList.remove('leg-status-live','leg-status-win','leg-status-loss','leg-status-push','leg-status-open');
      node.classList.add(`leg-status-${status}`);node.dataset.legStatus=status;
      node.querySelector('.leg-state')?.remove();
      const badge=document.createElement('span');badge.className='leg-state';badge.textContent=statusLabel(status);node.appendChild(badge);
    });
  }

  function decorateTicketLegs(){
    Object.keys(DATA.leagues).forEach(key=>{
      const week=selectedWeek(key),tickets=visibleTickets(key,week),section=document.querySelector(`.league-section[data-league="${key}"]`);if(!section)return;
      const rows=[...section.querySelectorAll('table.bets tbody tr')],cards=[...section.querySelectorAll('.mobile-bets .bet-card')];
      tickets.forEach((t,i)=>{if((t.legs||[]).length<2)return;if(rows[i])decorateLegNodes([...rows[i].querySelectorAll('.leg')],t,key);if(cards[i])decorateLegNodes([...cards[i].querySelectorAll('.leg')],t,key)});
    });
  }

  function liveTicketList(){
    const out=[];Object.entries(DATA.leagues).forEach(([key,l])=>allTickets(l).filter(t=>t.booked).forEach(t=>{const s=ticketSnapshot(t,key);if(s.status==='live')out.push({key,t,s})}));return out;
  }

  function decorateLiveSweat(){
    const items=liveTicketList(),cards=[...document.querySelectorAll('#liveSweat .sweat-card')];
    items.forEach((x,i)=>{const card=cards[i];if(!card)return;card.querySelector('.tv-badge')?.remove();card.querySelector('.live-leg-board')?.remove();
      const liveNets=[...new Set((x.t.legs||[]).map((l,j)=>x.s.legs?.[j]?.status==='live'?network(l,x.s.legs?.[j]):'').filter(Boolean))];
      const tv=document.createElement('div');tv.className='tv-badge';tv.textContent=`TV / STREAM · ${liveNets.join(' / ')||'TBD'}`;card.querySelector('.sweat-pick')?.insertAdjacentElement('afterend',tv);
      if((x.t.legs||[]).length>1){const board=document.createElement('div');board.className='live-leg-board';
        (x.t.legs||[]).forEach((l,j)=>{const ls=x.s.legs?.[j],st=ls?.status||'open',row=document.createElement('div');row.className=`live-leg-row leg-status-${st}`;const net=network(l,ls);row.innerHTML=`<span class="live-leg-pick">${esc(legAngle(l))}</span><span class="live-leg-meta">${esc(statusLabel(st))}${net?` · ${esc(net)}`:''}</span>`;board.appendChild(row)});
        card.querySelector('.sweat-money')?.insertAdjacentElement('beforebegin',board);
      }
    });
  }

  function collectUpcoming(){
    const map=new Map();Object.entries(DATA.leagues).forEach(([key])=>{const week=activeWeek(key);if(!week)return;(week.tickets||[]).filter(t=>t.booked).forEach(t=>{const s=ticketSnapshot(t,key);(t.legs||[]).forEach((l,i)=>{const ls=s.legs?.[i];if(!ls?.event||ls.event.status==='final')return;const id=`${key}:${l.gameKey}`,g=map.get(id)||{key,gameKey:l.gameKey,team:l.team,opponent:l.opponent,date:ls.event.date,status:ls.event.status,broadcast:network(l,ls),risk:0,tickets:new Set()};if(!g.tickets.has(t.id)){g.risk+=Number(t.risk||0);g.tickets.add(t.id)}if(ls.event.date)g.date=ls.event.date;if(ls.event.status==='live')g.status='live';if(network(l,ls))g.broadcast=network(l,ls);map.set(id,g)})})});
    return [...map.values()].sort((a,b)=>{if(a.status==='live'&&b.status!=='live')return-1;if(b.status==='live'&&a.status!=='live')return 1;return new Date(a.date||'2999-12-31')-new Date(b.date||'2999-12-31')})
  }

  function decorateNextUp(){
    const games=collectUpcoming().filter(g=>g.status!=='live').slice(0,5),cards=[...document.querySelectorAll('#nextUp .nextup-card')];
    games.forEach((g,i)=>{const c=cards[i];if(!c)return;c.querySelector('.tv-badge')?.remove();const tv=document.createElement('div');tv.className='tv-badge';tv.textContent=`TV / STREAM · ${g.broadcast||'TBD'}`;c.querySelector('.nextup-game')?.insertAdjacentElement('afterend',tv)});
  }

  const baseRender=B.renderDashboard;
  B.renderDashboard=()=>{baseRender();decorateTicketLegs();decorateLiveSweat();decorateNextUp()};
})();
