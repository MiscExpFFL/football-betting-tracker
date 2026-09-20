(() => {
  const D = window.BET_TRACKER_DATA;
  if (!D) return;

  const nfl = D.leagues?.NFL;
  if (!nfl) return;

  let week2 = nfl.weeks?.find(w => Number(w.week) === 2);
  if (!week2) {
    week2 = {
      week: 2,
      label: 'Week 2',
      dateStart: '2026-09-17',
      dateEnd: '2026-09-21',
      archived: false,
      tickets: []
    };
    nfl.weeks.push(week2);
  }

  week2.tickets = [
    {
      id:'NFL-W2-01', category:'Core', betTypeGroup:'Spread', booked:true,
      description:'Jacksonville Jaguars +3 at Denver Broncos', risk:120, toWin:100, odds:'-120',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[{gameKey:'jax-den', espnEventId:null, team:'Jacksonville Jaguars', opponent:'Denver Broncos', betType:'spread', line:3}]
    },
    {
      id:'NFL-W2-02', category:'Core', betTypeGroup:'Spread', booked:true,
      description:'Arizona Cardinals +4 vs Seattle Seahawks', risk:110, toWin:100, odds:'-110',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[{gameKey:'sea-ari', espnEventId:null, team:'Arizona Cardinals', opponent:'Seattle Seahawks', betType:'spread', line:4}]
    },
    {
      id:'NFL-W2-03', category:'Parlay', betTypeGroup:'Parlay', booked:true,
      description:'Jacksonville +3 / Arizona +4', risk:50, toWin:122, odds:'+244',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[
        {gameKey:'jax-den', espnEventId:null, team:'Jacksonville Jaguars', opponent:'Denver Broncos', betType:'spread', line:3},
        {gameKey:'sea-ari', espnEventId:null, team:'Arizona Cardinals', opponent:'Seattle Seahawks', betType:'spread', line:4}
      ]
    },
    {
      id:'NFL-W2-04', category:'Teaser', betTypeGroup:'Teaser', booked:true,
      description:'PIT/NE Under 47.5 / Tampa Bay -2.5 / Jacksonville +9 / Arizona +10 / San Francisco -7 / Kansas City PK',
      risk:50, toWin:250, odds:'+500',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[
        {gameKey:'pit-ne', espnEventId:null, team:'Pittsburgh Steelers', opponent:'New England Patriots', betType:'total', direction:'under', line:47.5},
        {gameKey:'cle-tb', espnEventId:null, team:'Tampa Bay Buccaneers', opponent:'Cleveland Browns', betType:'spread', line:-2.5},
        {gameKey:'jax-den', espnEventId:null, team:'Jacksonville Jaguars', opponent:'Denver Broncos', betType:'spread', line:9},
        {gameKey:'sea-ari', espnEventId:null, team:'Arizona Cardinals', opponent:'Seattle Seahawks', betType:'spread', line:10},
        {gameKey:'mia-sf', espnEventId:null, team:'San Francisco 49ers', opponent:'Miami Dolphins', betType:'spread', line:-7},
        {gameKey:'ind-kc', espnEventId:null, team:'Kansas City Chiefs', opponent:'Indianapolis Colts', betType:'spread', line:0}
      ]
    },
    {
      id:'NFL-W2-05', category:'Teaser', betTypeGroup:'Teaser', booked:true,
      description:'Green Bay +3 / Philadelphia -1 / San Francisco -7', risk:200, toWin:360, odds:'+180',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[
        {gameKey:'gb-nyj', espnEventId:null, team:'Green Bay Packers', opponent:'New York Jets', betType:'spread', line:3},
        {gameKey:'phi-ten', espnEventId:null, team:'Philadelphia Eagles', opponent:'Tennessee Titans', betType:'spread', line:-1},
        {gameKey:'mia-sf', espnEventId:null, team:'San Francisco 49ers', opponent:'Miami Dolphins', betType:'spread', line:-7}
      ]
    },
    {
      id:'NFL-W2-06', category:'Parlay', betTypeGroup:'Parlay', booked:true,
      description:'MIN/CHI Over 47.5 / Tampa Bay ML / Cincinnati ML / Baltimore ML / Philadelphia ML / Green Bay ML',
      risk:50, toWin:642, odds:'+1284',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[
        {gameKey:'min-chi', espnEventId:null, team:'Minnesota Vikings', opponent:'Chicago Bears', betType:'total', direction:'over', line:47.5},
        {gameKey:'cle-tb', espnEventId:null, team:'Tampa Bay Buccaneers', opponent:'Cleveland Browns', betType:'moneyline'},
        {gameKey:'cin-hou', espnEventId:null, team:'Cincinnati Bengals', opponent:'Houston Texans', betType:'moneyline'},
        {gameKey:'no-bal', espnEventId:null, team:'Baltimore Ravens', opponent:'New Orleans Saints', betType:'moneyline'},
        {gameKey:'phi-ten', espnEventId:null, team:'Philadelphia Eagles', opponent:'Tennessee Titans', betType:'moneyline'},
        {gameKey:'gb-nyj', espnEventId:null, team:'Green Bay Packers', opponent:'New York Jets', betType:'moneyline'}
      ]
    },
    {
      id:'NFL-W2-07', category:'Parlay', betTypeGroup:'Parlay', booked:true,
      description:'Tampa Bay ML / Baltimore ML / San Francisco ML / Philadelphia ML / Kansas City ML',
      risk:50, toWin:97, odds:'+194',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[
        {gameKey:'cle-tb', espnEventId:null, team:'Tampa Bay Buccaneers', opponent:'Cleveland Browns', betType:'moneyline'},
        {gameKey:'no-bal', espnEventId:null, team:'Baltimore Ravens', opponent:'New Orleans Saints', betType:'moneyline'},
        {gameKey:'mia-sf', espnEventId:null, team:'San Francisco 49ers', opponent:'Miami Dolphins', betType:'moneyline'},
        {gameKey:'phi-ten', espnEventId:null, team:'Philadelphia Eagles', opponent:'Tennessee Titans', betType:'moneyline'},
        {gameKey:'ind-kc', espnEventId:null, team:'Kansas City Chiefs', opponent:'Indianapolis Colts', betType:'moneyline'}
      ]
    },
    {
      id:'NFL-W2-08', category:'Underdog Parlay', betTypeGroup:'Parlay', booked:true,
      description:'Jacksonville ML +132 / Cincinnati ML +127 / Arizona ML +175', risk:50, toWin:674, odds:'+1348',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[
        {gameKey:'jax-den', espnEventId:null, team:'Jacksonville Jaguars', opponent:'Denver Broncos', betType:'moneyline'},
        {gameKey:'cin-hou', espnEventId:null, team:'Cincinnati Bengals', opponent:'Houston Texans', betType:'moneyline'},
        {gameKey:'sea-ari', espnEventId:null, team:'Arizona Cardinals', opponent:'Seattle Seahawks', betType:'moneyline'}
      ]
    },
    {
      id:'NFL-W2-09', category:'Teaser', betTypeGroup:'Teaser', booked:true,
      description:'MIN/CHI Over 41.5 / Tampa Bay -2.5 / New Orleans +14.5 / Philadelphia -1 / Jacksonville +9 / Arizona +10 / San Francisco -7 / Kansas City PK',
      risk:50, toWin:700, odds:'+1400',
      closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
      legs:[
        {gameKey:'min-chi', espnEventId:null, team:'Minnesota Vikings', opponent:'Chicago Bears', betType:'total', direction:'over', line:41.5},
        {gameKey:'cle-tb', espnEventId:null, team:'Tampa Bay Buccaneers', opponent:'Cleveland Browns', betType:'spread', line:-2.5},
        {gameKey:'no-bal', espnEventId:null, team:'New Orleans Saints', opponent:'Baltimore Ravens', betType:'spread', line:14.5},
        {gameKey:'phi-ten', espnEventId:null, team:'Philadelphia Eagles', opponent:'Tennessee Titans', betType:'spread', line:-1},
        {gameKey:'jax-den', espnEventId:null, team:'Jacksonville Jaguars', opponent:'Denver Broncos', betType:'spread', line:9},
        {gameKey:'sea-ari', espnEventId:null, team:'Arizona Cardinals', opponent:'Seattle Seahawks', betType:'spread', line:10},
        {gameKey:'mia-sf', espnEventId:null, team:'San Francisco 49ers', opponent:'Miami Dolphins', betType:'spread', line:-7},
        {gameKey:'ind-kc', espnEventId:null, team:'Kansas City Chiefs', opponent:'Indianapolis Colts', betType:'spread', line:0}
      ]
    }
  ];

  D.config.build = 'v1.8.4';
  D.config.lastSiteUpdate = '2026-09-20T00:55:00-07:00';
})();