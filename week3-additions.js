(() => {
  const D = window.BET_TRACKER_DATA;
  if (!D) return;

  const ncaa = D.leagues?.NCAA;
  if (ncaa) {
    let week3 = ncaa.weeks?.find(w => Number(w.week) === 3);
    if (!week3) {
      week3 = {
        week: 3,
        label: 'Week 3',
        dateStart: '2026-09-18',
        dateEnd: '2026-09-19',
        archived: false,
        tickets: []
      };
      ncaa.weeks.push(week3);
    }
    week3.tickets = [
      {
        id:'NCAA-W3-01', category:'Core', betTypeGroup:'Spread', booked:true,
        description:'Wake Forest +21.5 vs Miami (FL)', risk:130, toWin:100, odds:'-130',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'miami-wake', espnEventId:null, team:'Wake Forest', opponent:'Miami (FL)', betType:'spread', line:21.5}]
      },
      {
        id:'NCAA-W3-02', category:'Fun', betTypeGroup:'Moneyline', booked:true,
        description:'Houston ML +260 at Texas Tech', risk:50, toWin:130, odds:'+260',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'houston-texastech', espnEventId:null, team:'Houston', opponent:'Texas Tech', betType:'moneyline'}]
      },
      {
        id:'NCAA-W3-03', category:'Core', betTypeGroup:'Spread', booked:true,
        description:'Vanderbilt -3 vs NC State', risk:110, toWin:100, odds:'-110',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'ncstate-vandy', espnEventId:null, team:'Vanderbilt', opponent:'NC State', betType:'spread', line:-3}]
      },
      {
        id:'NCAA-W3-04', category:'Core', betTypeGroup:'Spread', booked:true,
        description:'Texas A&M -17 vs Kentucky', risk:110, toWin:100, odds:'-110',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'kentucky-tamu', espnEventId:null, team:'Texas A&M', opponent:'Kentucky', betType:'spread', line:-17}]
      },
      {
        id:'NCAA-W3-05', category:'Fun', betTypeGroup:'Moneyline', booked:true,
        description:'Ole Miss ML +137 vs LSU', risk:50, toWin:68, odds:'+137',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'lsu-olemiss', espnEventId:null, team:'Ole Miss', opponent:'LSU', betType:'moneyline'}]
      },
      {
        id:'NCAA-W3-06', category:'Parlay', betTypeGroup:'Parlay', booked:true,
        description:'Texas A&M -17 / Vanderbilt -3', risk:50, toWin:130, odds:'+260',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[
          {gameKey:'kentucky-tamu', espnEventId:null, team:'Texas A&M', opponent:'Kentucky', betType:'spread', line:-17},
          {gameKey:'ncstate-vandy', espnEventId:null, team:'Vanderbilt', opponent:'NC State', betType:'spread', line:-3}
        ]
      },
      {
        id:'NCAA-W3-07', category:'Underdog Parlay', betTypeGroup:'Parlay', booked:true,
        description:'Houston ML +260 / Ole Miss ML +137', risk:50, toWin:376, odds:'+752',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[
          {gameKey:'houston-texastech', espnEventId:null, team:'Houston', opponent:'Texas Tech', betType:'moneyline'},
          {gameKey:'lsu-olemiss', espnEventId:null, team:'Ole Miss', opponent:'LSU', betType:'moneyline'}
        ]
      },
      {
        id:'NCAA-W3-08', category:'Teaser', betTypeGroup:'Teaser', booked:true,
        description:'Wake Forest +26.5 / Texas A&M -11 / Vanderbilt +3', risk:50, toWin:90, odds:'+180',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[
          {gameKey:'miami-wake', espnEventId:null, team:'Wake Forest', opponent:'Miami (FL)', betType:'spread', line:26.5},
          {gameKey:'kentucky-tamu', espnEventId:null, team:'Texas A&M', opponent:'Kentucky', betType:'spread', line:-11},
          {gameKey:'ncstate-vandy', espnEventId:null, team:'Vanderbilt', opponent:'NC State', betType:'spread', line:3}
        ]
      }
    ];
  }

  const nfl = D.leagues?.NFL;
  if (nfl && !nfl.weeks.some(w => Number(w.week) === 2)) {
    nfl.weeks.push({
      week: 2,
      label: 'Week 2',
      dateStart: '2026-09-17',
      dateEnd: '2026-09-21',
      archived: false,
      tickets: []
    });
  }

  D.leagues.CROSS = {
    label: 'Cross-League',
    espnPath: 'nfl',
    weeks: [{
      week: 3,
      label: 'Sep 18–21',
      dateStart: '2026-09-18',
      dateEnd: '2026-09-21',
      archived: false,
      tickets: [
        {
          id:'CROSS-W3-01', category:'Parlay', betTypeGroup:'Parlay', booked:true,
          description:'Philadelphia Eagles -7 / Vanderbilt ML -156 / Texas A&M -17', risk:100, toWin:487, odds:'+487',
          closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
          legs:[
            {gameKey:'phi-ten', espnEventId:null, team:'Philadelphia Eagles', opponent:'Tennessee Titans', betType:'spread', line:-7},
            {gameKey:'ncstate-vandy', espnEventId:null, team:'Vanderbilt', opponent:'NC State', betType:'moneyline'},
            {gameKey:'kentucky-tamu', espnEventId:null, team:'Texas A&M', opponent:'Kentucky', betType:'spread', line:-17}
          ]
        },
        {
          id:'CROSS-W3-02', category:'Teaser', betTypeGroup:'Teaser', booked:true,
          description:'Philadelphia Eagles -1 / Texas A&M -11 / Jacksonville +9', risk:100, toWin:180, odds:'+180',
          closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
          legs:[
            {gameKey:'phi-ten', espnEventId:null, team:'Philadelphia Eagles', opponent:'Tennessee Titans', betType:'spread', line:-1},
            {gameKey:'kentucky-tamu', espnEventId:null, team:'Texas A&M', opponent:'Kentucky', betType:'spread', line:-11},
            {gameKey:'jax-den', espnEventId:null, team:'Jacksonville Jaguars', opponent:'Denver Broncos', betType:'spread', line:9}
          ]
        },
        {
          id:'CROSS-W3-03', category:'Underdog Parlay', betTypeGroup:'Parlay', booked:true,
          description:'Pittsburgh ML +200 / Ole Miss ML +137 / Jacksonville ML +137', risk:50, toWin:792, odds:'+1584',
          closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
          legs:[
            {gameKey:'pit-ne', espnEventId:null, team:'Pittsburgh Steelers', opponent:'New England Patriots', betType:'moneyline'},
            {gameKey:'lsu-olemiss', espnEventId:null, team:'Ole Miss', opponent:'LSU', betType:'moneyline'},
            {gameKey:'jax-den', espnEventId:null, team:'Jacksonville Jaguars', opponent:'Denver Broncos', betType:'moneyline'}
          ]
        }
      ]
    }]
  };

  D.config.build = 'v1.8.1';
  D.config.lastSiteUpdate = '2026-09-20T00:30:00-07:00';
})();