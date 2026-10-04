(() => {
  const D = window.BET_TRACKER_DATA;
  if (!D) return;

  const nfl = D.leagues?.NFL;
  if (!nfl) return;

  let week4 = nfl.weeks?.find(w => Number(w.week) === 4);
  if (!week4) {
    week4 = {
      week: 4,
      label: 'Week 4',
      dateStart: '2026-10-01',
      dateEnd: '2026-10-05',
      archived: false,
      tickets: []
    };
    nfl.weeks.push(week4);
  }

  week4.tickets = [
    {
      id:'NFL-W4-01', category:'3-Team Teaser', betTypeGroup:'Teaser', booked:true,
      description:'Buffalo -1.5 / Chicago +2.5 / Dallas +9', risk:25, toWin:45, odds:'+180',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[
        {gameKey:'ne-buf', espnEventId:null, team:'Buffalo Bills', opponent:'New England Patriots', betType:'spread', line:-1.5},
        {gameKey:'nyj-chi', espnEventId:null, team:'Chicago Bears', opponent:'New York Jets', betType:'spread', line:2.5},
        {gameKey:'dal-hou', espnEventId:null, team:'Dallas Cowboys', opponent:'Houston Texans', betType:'spread', line:9}
      ]
    },
    {
      id:'NFL-W4-02', category:'3-Team Moneyline Parlay', betTypeGroup:'Parlay', booked:true,
      description:'New England ML +285 / Denver ML +142 / LA Chargers ML +295', risk:25, toWin:895, odds:'+3580',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[
        {gameKey:'ne-buf', espnEventId:null, team:'New England Patriots', opponent:'Buffalo Bills', betType:'moneyline'},
        {gameKey:'den-sf', espnEventId:null, team:'Denver Broncos', opponent:'San Francisco 49ers', betType:'moneyline'},
        {gameKey:'lac-sea', espnEventId:null, team:'Los Angeles Chargers', opponent:'Seattle Seahawks', betType:'moneyline'}
      ]
    },
    {
      id:'NFL-W4-03', category:'5-Team Moneyline Parlay', betTypeGroup:'Parlay', booked:true,
      description:'Green Bay ML -148 / LA Rams ML -178 / Baltimore ML -782 / Minnesota ML -625 / Kansas City ML -230',
      risk:50, toWin:196, odds:'+392',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[
        {gameKey:'gb-tb', espnEventId:null, team:'Green Bay Packers', opponent:'Tampa Bay Buccaneers', betType:'moneyline'},
        {gameKey:'lar-phi', espnEventId:null, team:'Los Angeles Rams', opponent:'Philadelphia Eagles', betType:'moneyline'},
        {gameKey:'ten-bal', espnEventId:null, team:'Baltimore Ravens', opponent:'Tennessee Titans', betType:'moneyline'},
        {gameKey:'mia-min', espnEventId:null, team:'Minnesota Vikings', opponent:'Miami Dolphins', betType:'moneyline'},
        {gameKey:'kc-lv', espnEventId:null, team:'Kansas City Chiefs', opponent:'Las Vegas Raiders', betType:'moneyline'}
      ]
    },
    {
      id:'NFL-W4-04', category:'4-Team Parlay', betTypeGroup:'Parlay', booked:true,
      description:'Jacksonville +2.5 / Green Bay -3 / LA Rams -3.5 / Kansas City -4.5', risk:50, toWin:538, odds:'+1076',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[
        {gameKey:'jax-cin', espnEventId:null, team:'Jacksonville Jaguars', opponent:'Cincinnati Bengals', betType:'spread', line:2.5},
        {gameKey:'gb-tb', espnEventId:null, team:'Green Bay Packers', opponent:'Tampa Bay Buccaneers', betType:'spread', line:-3},
        {gameKey:'lar-phi', espnEventId:null, team:'Los Angeles Rams', opponent:'Philadelphia Eagles', betType:'spread', line:-3.5},
        {gameKey:'kc-lv', espnEventId:null, team:'Kansas City Chiefs', opponent:'Las Vegas Raiders', betType:'spread', line:-4.5}
      ]
    },
    {
      id:'NFL-W4-05', category:'6-Team Teaser', betTypeGroup:'Teaser', booked:true,
      description:'Jacksonville +8.5 / Green Bay +3 / LA Rams +2.5 / San Francisco +3 / Kansas City +1.5 / LA Chargers +13',
      risk:60, toWin:300, odds:'+500',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[
        {gameKey:'jax-cin', espnEventId:null, team:'Jacksonville Jaguars', opponent:'Cincinnati Bengals', betType:'spread', line:8.5},
        {gameKey:'gb-tb', espnEventId:null, team:'Green Bay Packers', opponent:'Tampa Bay Buccaneers', betType:'spread', line:3},
        {gameKey:'lar-phi', espnEventId:null, team:'Los Angeles Rams', opponent:'Philadelphia Eagles', betType:'spread', line:2.5},
        {gameKey:'den-sf', espnEventId:null, team:'San Francisco 49ers', opponent:'Denver Broncos', betType:'spread', line:3},
        {gameKey:'kc-lv', espnEventId:null, team:'Kansas City Chiefs', opponent:'Las Vegas Raiders', betType:'spread', line:1.5},
        {gameKey:'lac-sea', espnEventId:null, team:'Los Angeles Chargers', opponent:'Seattle Seahawks', betType:'spread', line:13}
      ]
    }
  ];

  D.config.build = 'v1.8.8';
  D.config.lastSiteUpdate = '2026-10-04T09:03:00-07:00';
})();
