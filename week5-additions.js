(() => {
  const D = window.BET_TRACKER_DATA;
  if (!D) return;

  const ncaa = D.leagues?.NCAA;
  if (ncaa) {
    let week5 = ncaa.weeks?.find(w => Number(w.week) === 5);
    if (!week5) {
      week5 = {
        week: 5,
        label: 'Week 5',
        dateStart: '2026-10-03',
        dateEnd: '2026-10-03',
        archived: false,
        tickets: []
      };
      ncaa.weeks.push(week5);
    }

    // Exact BetWCS wagers from the Oct. 3 screenshot. Lines/prices are frozen as booked.
    week5.tickets = [
      {
        id:'NCAA-W5-01', category:'Straight', betTypeGroup:'Spread', booked:true,
        description:'Washington +7.5 at USC', risk:110, toWin:100, odds:'-110',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'wash-usc', espnEventId:null, team:'Washington', opponent:'USC', betType:'spread', line:7.5}]
      },
      {
        id:'NCAA-W5-02', category:'Straight', betTypeGroup:'Spread', booked:true,
        description:'TCU +6 vs BYU', risk:110, toWin:100, odds:'-110',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'byu-tcu', espnEventId:null, team:'TCU', opponent:'BYU', betType:'spread', line:6}]
      },
      {
        id:'NCAA-W5-03', category:'Straight', betTypeGroup:'Spread', booked:true,
        description:'Iowa +14.5 vs Ohio State', risk:110, toWin:100, odds:'-110',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'ohiostate-iowa', espnEventId:null, team:'Iowa', opponent:'Ohio State', betType:'spread', line:14.5}]
      },
      {
        id:'NCAA-W5-04', category:'3-Team Parlay', betTypeGroup:'Parlay', booked:true,
        description:'Iowa +14.5 / TCU +6 / Washington +7.5', risk:100, toWin:600, odds:'+600',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[
          {gameKey:'ohiostate-iowa', espnEventId:null, team:'Iowa', opponent:'Ohio State', betType:'spread', line:14.5},
          {gameKey:'byu-tcu', espnEventId:null, team:'TCU', opponent:'BYU', betType:'spread', line:6},
          {gameKey:'wash-usc', espnEventId:null, team:'Washington', opponent:'USC', betType:'spread', line:7.5}
        ]
      },
      {
        id:'NCAA-W5-05', category:'Straight', betTypeGroup:'Spread', booked:true,
        description:'Mississippi State +5.5 vs Alabama', risk:110, toWin:100, odds:'-110',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'alabama-missstate', espnEventId:null, team:'Mississippi State', opponent:'Alabama', betType:'spread', line:5.5}]
      }
    ];
  }

  if (!D.leagues.CROSS) {
    D.leagues.CROSS = {
      label: 'Cross-League',
      espnPath: 'nfl',
      weeks: []
    };
  }

  const cross = D.leagues.CROSS;
  let crossWeek5 = cross.weeks?.find(w => Number(w.week) === 5);
  if (!crossWeek5) {
    crossWeek5 = {
      week: 5,
      label: 'Oct 3–4',
      dateStart: '2026-10-03',
      dateEnd: '2026-10-04',
      archived: false,
      tickets: []
    };
    cross.weeks.push(crossWeek5);
  }

  crossWeek5.tickets = [
    {
      id:'CROSS-W5-01', category:'6-Team Teaser', betTypeGroup:'Teaser', booked:true,
      description:'San Francisco +3.5 / Kansas City +1.5 / LA Chargers +13 / Green Bay +2.5 / Washington +13.5 / TCU +12',
      risk:120, toWin:600, odds:'+500',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[
        {gameKey:'den-sf', espnEventId:null, team:'San Francisco 49ers', opponent:'Denver Broncos', betType:'spread', line:3.5},
        {gameKey:'kc-lv', espnEventId:null, team:'Kansas City Chiefs', opponent:'Las Vegas Raiders', betType:'spread', line:1.5},
        {gameKey:'lac-sea', espnEventId:null, team:'Los Angeles Chargers', opponent:'Seattle Seahawks', betType:'spread', line:13},
        {gameKey:'gb-tb', espnEventId:null, team:'Green Bay Packers', opponent:'Tampa Bay Buccaneers', betType:'spread', line:2.5},
        {gameKey:'wash-usc', espnEventId:null, team:'Washington', opponent:'USC', betType:'spread', line:13.5},
        {gameKey:'byu-tcu', espnEventId:null, team:'TCU', opponent:'BYU', betType:'spread', line:12}
      ]
    }
  ];

  D.config.build = 'v1.8.7';
  D.config.lastSiteUpdate = '2026-10-03T09:08:00-07:00';
})();
