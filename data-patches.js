(() => {
  const D = window.BET_TRACKER_DATA;
  if (!D) return;

  const ncaa = D.leagues?.NCAA;
  if (ncaa) {
    // Permanently freeze NCAA Week 1 now that every booked ticket is settled.
    const week1 = ncaa.weeks?.find(w => Number(w.week) === 1);
    if (week1) {
      week1.archived = true;
      const settled = {
        'NCAA-W1-01': ['loss', -110],
        'NCAA-W1-02': ['win', 50],
        'NCAA-W1-03': ['loss', -55],
        'NCAA-W1-04': ['win', 50],
        'NCAA-W1-05': ['win', 66],
        'NCAA-W1-06': ['loss', -50],
        'NCAA-W1-07': ['loss', -50],
        'NCAA-W1-08': ['loss', -25],
        'NCAA-W1-09': ['loss', -25],
        'NCAA-W1-10': ['loss', -55],
        'NCAA-W1-11': ['win', 50],
        'NCAA-W1-12': ['loss', -27],
        'NCAA-W1-13': ['win', 200],
        'NCAA-W1-14': ['win', 100]
      };
      for (const ticket of week1.tickets || []) {
        const row = settled[ticket.id];
        if (!row) continue;
        ticket.result = row[0];
        ticket.pnl = row[1];
        ticket.settledAt = ticket.settledAt || '2026-09-07T23:59:00-07:00';
      }
    }

    // Exact ESPN bindings + home/away identity for NCAA Week 2.
    const week2 = ncaa.weeks?.find(w => Number(w.week) === 2);
    if (week2) {
      const bindings = {
        'asu-tamu':           { espnEventId:'401856683', team:'Arizona State', opponent:'Texas A&M', teamHome:false },
        'oregon-okstate':     { espnEventId:'401856782', team:'Oregon', opponent:'Oklahoma State', teamHome:false },
        'tennessee-gatech':   { espnEventId:'401856681', team:'Tennessee', opponent:'Georgia Tech', teamHome:false },
        'oklahoma-michigan':  { espnEventId:'401856679', team:'Michigan', opponent:'Oklahoma', teamHome:true },
        'ohiostate-texas':    { espnEventId:'401856682', team:'Ohio State', opponent:'Texas', teamHome:false },
        'boisestate-memphis': { espnEventId:'401860881', team:'Memphis', opponent:'Boise State', teamHome:false },
        'iowastate-iowa':     { espnEventId:'401856788', team:'Iowa State', opponent:'Iowa', teamHome:false }
      };
      for (const ticket of week2.tickets || []) {
        for (const leg of ticket.legs || []) {
          const b = bindings[leg.gameKey];
          if (!b) continue;
          leg.espnEventId = b.espnEventId;
          leg.team = b.team;
          leg.opponent = b.opponent;
          leg.teamHome = b.teamHome;
        }
      }
    }
  }

  // NFL Week 1 — exact BetWCS tickets visible in the Sep. 8 and Sep. 13 slips.
  // Denver +2.5 straight is intentionally NOT included yet because the user is
  // waiting until Monday to decide whether to book it.
  const nflWeek1 = D.leagues?.NFL?.weeks?.find(w => Number(w.week) === 1);
  if (nflWeek1) {
    nflWeek1.tickets = [
      {
        id:'NFL-W1-01', category:'Best Bet', betTypeGroup:'Spread', booked:true,
        description:'Miami Dolphins +3 at Las Vegas Raiders', risk:110, toWin:100, odds:'-110',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'mia-lv', espnEventId:null, team:'Miami Dolphins', opponent:'Las Vegas Raiders', betType:'spread', line:3}]
      },
      {
        id:'NFL-W1-02', category:'Biggest Lock', betTypeGroup:'Spread', booked:true,
        description:'Baltimore Ravens -3 at Indianapolis Colts', risk:66, toWin:60, odds:'-110',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'bal-ind', espnEventId:null, team:'Baltimore Ravens', opponent:'Indianapolis Colts', betType:'spread', line:-3}]
      },
      {
        id:'NFL-W1-03', category:'Best Total', betTypeGroup:'Total', booked:true,
        description:'Atlanta Falcons / Pittsburgh Steelers Under 40.5', risk:55, toWin:50, odds:'-110',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'atl-pit', espnEventId:null, team:'Atlanta Falcons', opponent:'Pittsburgh Steelers', betType:'total', direction:'under', line:40.5}]
      },
      {
        id:'NFL-W1-04', category:'Best Bang for the Buck', betTypeGroup:'Moneyline', booked:true,
        description:'Miami Dolphins ML at Las Vegas Raiders', risk:150, toWin:213, odds:'+142',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'mia-lv', espnEventId:null, team:'Miami Dolphins', opponent:'Las Vegas Raiders', betType:'moneyline'}]
      },
      {
        id:'NFL-W1-05', category:'3-Team Parlay', betTypeGroup:'Parlay', booked:true,
        description:'Baltimore -3 / Miami +3 / Denver +2.5', risk:50, toWin:300, odds:'+600',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[
          {gameKey:'bal-ind', espnEventId:null, team:'Baltimore Ravens', opponent:'Indianapolis Colts', betType:'spread', line:-3},
          {gameKey:'mia-lv', espnEventId:null, team:'Miami Dolphins', opponent:'Las Vegas Raiders', betType:'spread', line:3},
          {gameKey:'den-kc', espnEventId:null, team:'Denver Broncos', opponent:'Kansas City Chiefs', betType:'spread', line:2.5}
        ]
      },
      {
        id:'NFL-W1-06', category:'3-Team Underdog Parlay', betTypeGroup:'Parlay', booked:true,
        description:'Houston ML +102 / Miami ML +142 / Denver ML +117', risk:25, toWin:240, odds:'+960',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[
          {gameKey:'buf-hou', espnEventId:null, team:'Houston Texans', opponent:'Buffalo Bills', betType:'moneyline'},
          {gameKey:'mia-lv', espnEventId:null, team:'Miami Dolphins', opponent:'Las Vegas Raiders', betType:'moneyline'},
          {gameKey:'den-kc', espnEventId:null, team:'Denver Broncos', opponent:'Kansas City Chiefs', betType:'moneyline'}
        ]
      },
      {
        id:'NFL-W1-07', category:'Degenerate Pick', betTypeGroup:'Total', booked:true,
        description:'New York Jets / Tennessee Titans Under 38.5', risk:55, toWin:50, odds:'-110',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'nyj-ten', espnEventId:null, team:'New York Jets', opponent:'Tennessee Titans', betType:'total', direction:'under', line:38.5}]
      },
      {
        id:'NFL-W1-08', category:'Bonus Total', betTypeGroup:'Total', booked:true,
        description:'Baltimore Ravens / Indianapolis Colts Under 48', risk:55, toWin:50, odds:'-110',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[{gameKey:'bal-ind', espnEventId:null, team:'Baltimore Ravens', opponent:'Indianapolis Colts', betType:'total', direction:'under', line:48}]
      },
      {
        id:'NFL-W1-09', category:'Bonus 3-Team Parlay', betTypeGroup:'Parlay', booked:true,
        description:'Seattle -3 / Buffalo -1 / Tampa Bay +4', risk:25, toWin:143, odds:'+572',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[
          {gameKey:'ne-sea', espnEventId:null, team:'Seattle Seahawks', opponent:'New England Patriots', betType:'spread', line:-3},
          {gameKey:'buf-hou', espnEventId:null, team:'Buffalo Bills', opponent:'Houston Texans', betType:'spread', line:-1},
          {gameKey:'tb-cin', espnEventId:null, team:'Tampa Bay Buccaneers', opponent:'Cincinnati Bengals', betType:'spread', line:4}
        ]
      },
      {
        id:'NFL-W1-10', category:'Bonus 4-Team Teaser', betTypeGroup:'Teaser', booked:true,
        description:'Atlanta +9 / Jacksonville -3 / Denver +9 / Green Bay +7.5', risk:25, toWin:70, odds:'+280',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[
          {gameKey:'atl-pit', espnEventId:null, team:'Atlanta Falcons', opponent:'Pittsburgh Steelers', betType:'spread', line:9},
          {gameKey:'cle-jax', espnEventId:null, team:'Jacksonville Jaguars', opponent:'Cleveland Browns', betType:'spread', line:-3},
          {gameKey:'den-kc', espnEventId:null, team:'Denver Broncos', opponent:'Kansas City Chiefs', betType:'spread', line:9},
          {gameKey:'gb-min', espnEventId:null, team:'Green Bay Packers', opponent:'Minnesota Vikings', betType:'spread', line:7.5}
        ]
      },
      {
        id:'NFL-W1-11', category:'Bonus 3-Team Teaser', betTypeGroup:'Teaser', booked:true,
        description:'Atlanta +9 / Jacksonville -3 / Green Bay +7.5', risk:50, toWin:90, odds:'+180',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[
          {gameKey:'atl-pit', espnEventId:null, team:'Atlanta Falcons', opponent:'Pittsburgh Steelers', betType:'spread', line:9},
          {gameKey:'cle-jax', espnEventId:null, team:'Jacksonville Jaguars', opponent:'Cleveland Browns', betType:'spread', line:-3},
          {gameKey:'gb-min', espnEventId:null, team:'Green Bay Packers', opponent:'Minnesota Vikings', betType:'spread', line:7.5}
        ]
      },
      {
        id:'NFL-W1-12', category:'Bonus 3-Team Teaser', betTypeGroup:'Teaser', booked:true,
        description:'San Francisco +9.5 / Jacksonville -2.5 / Green Bay +7.5', risk:100, toWin:180, odds:'+180',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[
          {gameKey:'sf-lar', espnEventId:null, team:'San Francisco 49ers', opponent:'Los Angeles Rams', betType:'spread', line:9.5},
          {gameKey:'cle-jax', espnEventId:null, team:'Jacksonville Jaguars', opponent:'Cleveland Browns', betType:'spread', line:-2.5},
          {gameKey:'gb-min', espnEventId:null, team:'Green Bay Packers', opponent:'Minnesota Vikings', betType:'spread', line:7.5}
        ]
      },
      {
        id:'NFL-W1-13', category:'Bonus 5-Team Teaser', betTypeGroup:'Teaser', booked:true,
        description:'New England +9 / San Francisco +9.5 / Jacksonville -2.5 / Denver +9 / Green Bay +7.5', risk:25, toWin:100, odds:'+400',
        closingLine:null, closingOdds:null, result:null, pnl:null, settledAt:null,
        legs:[
          {gameKey:'ne-sea', espnEventId:null, team:'New England Patriots', opponent:'Seattle Seahawks', betType:'spread', line:9},
          {gameKey:'sf-lar', espnEventId:null, team:'San Francisco 49ers', opponent:'Los Angeles Rams', betType:'spread', line:9.5},
          {gameKey:'cle-jax', espnEventId:null, team:'Jacksonville Jaguars', opponent:'Cleveland Browns', betType:'spread', line:-2.5},
          {gameKey:'den-kc', espnEventId:null, team:'Denver Broncos', opponent:'Kansas City Chiefs', betType:'spread', line:9},
          {gameKey:'gb-min', espnEventId:null, team:'Green Bay Packers', opponent:'Minnesota Vikings', betType:'spread', line:7.5}
        ]
      }
    ];
  }

  D.config.build = 'v1.7.9';
  D.config.lastSiteUpdate = '2026-09-13T09:05:00-07:00';
})();