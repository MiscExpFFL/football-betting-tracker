(() => {
  const D = window.BET_TRACKER_DATA;
  if (!D) return;

  const week = D.leagues?.NFL?.weeks?.find(w => Number(w.week) === 1);
  if (week && !(week.tickets || []).some(t => t.id === 'NFL-W1-14')) {
    week.tickets.push({
      id:'NFL-W1-14',
      category:'Bonus Underdog ML',
      betTypeGroup:'Moneyline',
      booked:true,
      description:'Atlanta Falcons ML at Pittsburgh Steelers',
      risk:50,
      toWin:127.5,
      odds:'+255',
      closingLine:null,
      closingOdds:null,
      result:null,
      pnl:null,
      settledAt:null,
      legs:[{
        gameKey:'atl-pit',
        espnEventId:null,
        team:'Atlanta Falcons',
        opponent:'Pittsburgh Steelers',
        betType:'moneyline'
      }]
    });
  }

  D.config.build = 'v1.7.11';
  D.config.lastSiteUpdate = '2026-09-13T18:40:00-07:00';
})();
